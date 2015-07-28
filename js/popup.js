
document.addEventListener('DOMContentLoaded', function() {

  var API_PATH = 'http://localhost/Frontend/admin_v1/api/';
  // var API_PATH = 'http://dev.mccorp.co.com/sprint-2/admin_v1/api/';
  var STORE_LIST = [];
  var SELECTED_STORE = [];

  // Paste data from clipboard
  $('#url').click(function(){
      $('#url').select();
      document.execCommand('paste');
  })

  $('#start').click(function(){
      var url = $('#url').val();
      $.get(API_PATH + 'store/check-exists?url=' + url,
          function(response){
              message = '';
              items = [];
              if(response.length > 0){
                  // $('#myRS').append("<br> Maybe existed <br>");
                  // for(var i = 0; i < response.length; i++){
                  //     var store =
                  //     "Url: <a target='_blank' href='" + response[i].store_url + "'>" + response[i].store_url + "</a> <br>"
                  //     + "Name: " + response[i].name
                  //     + "</div><hr>";
                  //     $('#myRS').append(store);
                  message += "Maybe existed";
                  for(var i = 0; i < response.length; i++){
                      items.push({title : response[i].name, message : response[i].store_url});
                  }
              }else{
                  message = 'Your copied data not match any store url';
                  items = [{title : '404', message : 'Not Found'}];
              }
              Notify('n1', message, items);
          });
  }) /*End button Start click*/
/*///////////////////////////////////////////////////////////////////////////////////////////////////*/
  $('#expire_date').datetimepicker();
  $('#publish_date').datetimepicker();

  function showUserInfo(){
      if(localStorage['user']){
          var user = jQuery.parseJSON(localStorage['user']);
          $('#author').val(user.id);
          $('#welcome').text('Have a nice day ' + user.username + ' :)');
          $('#searchStore').focus();
      }
  }
  // If logged => show user info, hide login form
  if(localStorage['user']){
      $('#form_add').show();
      $('#form-login').hide();
      showUserInfo();
  }
  // If have coupon data then show it
/*  if(localStorage['coupon']){
      var coupon = jQuery.parseJSON(localStorage['coupon']);
      $('#title').val(coupon.title);
      $('#description').val(coupon.description);
      $('#product_link').val(coupon.product_link);
      $('#exclusive').val(coupon.exclusive);
      $('#sticky').val(coupon.sticky);
      $('#coupon_type').val(coupon.coupon_type);
      $('#currency').val(coupon.currency);
      $('#discount').val(coupon.discount);
      $('#expire_date').val(coupon.expire_date);
      $('#event_id').val(coupon_type.event_id);
      $('#searchStore').val(coupon.searchStore);
      $('#status').val(coupon.status);
      $('#author').val(coupon.author);
      $('#publish_date').val(coupon.publish_date);
      $('#coupon_code').val(coupon.coupon_code);
      $('#tags').val(coupon.tags);
      $('#verified').val(coupon.verified);
      $('#categories_id').val(coupon.categories_id);
  }*/

  /*Quick add*/
  $('#btnQuickAdd').click(function(){
      if($('#coupon_type').val() == 'Coupon Code'){
          if($('#coupon_code').val() == ''){
              $('#coupon-code-error').show();
              $('#coupon_code').focus();
              return false;
          }else{
            $('#coupon-code-error').hide();
          }
      }else{
          $('#coupon-code-error').hide();
      }
      // Validate form inputs
      /*var rules = {
          title : {required : true},
          description : {required : true},
          categories_id : {required : true},
          product_link : {url : true},
          discount : {number : true, required : true},
          publish_date : {required : true}
      };
      var messages = {
          title : {required : "Please enter title"},
          description : {required : "Please enter description"},
          categories_id : {required : "Please select at least one category"},
          product_link : {url : "Product url not valid"},
          number : {url : "Please enter a valid number", required : "Please enter discount value"},
          publish_date : {required : "Please select publish date"},
      };*/
      var rules = [];var messages = [];
      $("#form_add").validate({rules, messages, submitHandler: function(resp) {
              var sendData = {data : {
                      title : $('#title').val(),
                      description : $('#description').val(),
                      product_link : $('#product_link').val(),
                      exclusive : $('#exclusive').val(),
                      sticky : $('#sticky').val(),
                      coupon_type : $('#coupon_type').val(),
                      currency : $('#currency').val(),
                      discount : $('#discount').val(),
                      expire_date : $('#expire_date').val(),
                      event_id : $('#event_id').val(),
                      searchStore : $('#searchStore').val(),
                      status : $('#status').val(),
                      author : $('#author').val(),
                      publish_date : $('#publish_date').val(),
                      coupon_code : $('#coupon_code').val(),
                      tags : $('#tags').val(),
                      verified : $('#verified').val(),
                      categories_id : JSON.stringify($('#categories_id').val()),
                      event_name : $('#event_id option:selected').text() ? $('#event_id option:selected').text() : '',
                      store_id : $('#selectedStore').val()
                  },
                  store : SELECTED_STORE
              };
              /*Send data to api*/
              $.post(API_PATH + 'coupon/quick-add', sendData, function(response){
                  console.log(response);
                  if(response['coupon'] == '1'){
                      $('#message').text('Add coupon success');
                  }
                  if(response['vendor'] == '1'){
                      $('#message').text($('#message').text() + ' - Add vendor success');
                  }
                  if(response['coupon'] != '1'){
                      $('#message').text('Error!');
                  }
              })
          }
      });


  });

  // Input lost focus (except selectbox) => save last values to localStorage
  /*$('#title, #description,#product_link,#discount,#expire_date,#coupon_code,#tags,#categories_id')
  .focusout(function(){
      var coupon =
      {
          title : $('#title').val(),
          description : $('#description').val(),
          product_link : $('#product_link').val(),
          exclusive : $('#exclusive').val(),
          sticky : $('#sticky').val(),
          coupon_type : $('#coupon_type').val(),
          currency : $('#currency').val(),
          discount : $('#discount').val(),
          expire_date : $('#expire_date').val(),
          event_id : $('#event_id').val(),
          searchStore : $('#searchStore').val(),
          status : $('#status').val(),
          author : $('#author').val(),
          publish_date : $('#publish_date').val(),
          coupon_code : $('#coupon_code').val(),
          tags : $('#tags').val(),
          verified : $('#verified').val(),
          categories_id : JSON.stringify($('#categories_id').val())
      }
      // Save draft to localStorage
      localStorage['coupon'] = JSON.stringify(coupon);
  })*/

  // Get events
  $.post(API_PATH + 'event/list', {year : new Date().getFullYear()}, function(response){
      $.each(response, function(index, value){
          $('#event_id').append(
            $('<option></option>').attr('value', value.id).text(value.name)
          );
      })
  });

  // Find store
  $( "#searchStore" ).autocomplete({
      source: function (request, response) {
         $.ajax({
            url: API_PATH + 'store/filter/' + $('#searchStore').val(),
            type: 'GET',
            data: {},
            success: function (res) {
                localStorage['storeList'] = res;
                STORE_LIST = res;
                response($.map(res, function (value, key) {
                    return {
                        label: value.name,
                        value: value.id,
                        indexOfStore: key,
                        countries_code: value.countries_code
                    };
                }));
             }
         });
      },
      select: function(event, ui) { // After selected
          // print country code
          $('#lblCountry').text('');
          country = JSON.parse(ui.item.countries_code);
          for (var i = country.length - 1; i >= 0; i--) {
              $('#lblCountry').text($('#lblCountry').text() + ' ' + country[i]);
          };

          SELECTED_STORE = STORE_LIST[ui.item.indexOfStore];
          $('#searchStore').val(ui.item.label);
          $('#selectedStore').val(ui.item.value);
          // Get categories
          $.post(API_PATH + 'category/list', {storeId : $('#selectedStore').val()}, function(response){
              if(response != '404'){
                  $('#categories_id').empty();
                  $.each(response, function(index, value){
                      $('#categories_id').append(
                        $('<option></option>').attr('value', value.id).text(value.name)
                      );
                  })
              }
          })
          // Show form add coupon
          $('#form_coupon').show();
          $('#title').focus();
          return false;
      },
      minLength: 2 // Number of characters before start search
  });

  // Remove selected store
  $('#remove').click(function(){
      $('#searchStore').val('');
      $('#selectedStore').val('');
      $('#searchStore').focus();
      $('#form_coupon').hide();
  })

  // Sign in
  $('#signIn').click(function(){
      $("#frmSignIn").validate({
          rules: {
              inputEmail: {
                  required: true,
                  email: true
              },
              inputPassword: {
                  required: true,
                  // minlength: 5
              }
          },
          messages: {
              inputPassword: {
                  required: "Please provide a password",
                  // minlength: "Your password must be at least 5 characters long"
              },
              inputEmail: "Please enter a valid email address"
          },
          submitHandler: function(form) {
              var data = {
                  email : $('#inputEmail').val(),
                  password : $('#inputPassword').val()
              };
              $.post(API_PATH + 'user/login', data, function(response){
                  if(response != '404'){
                      localStorage['user'] = response;
                      $('#form-login').hide();
                      $('#form_add').show();
                      $('#searchStore').focus();
                      showUserInfo();
                  }else{
                      $('#lblError').text('Oop!!! Something wrong');
                  }
              })
          }
      });

  })

  // Logout
  $('#logout').click(function(){
      localStorage['user'] = [];
      localStorage['coupon'] = [];
      $('#form_add').hide();
      $('#form-login').show();
  })

}) /*End DOMContentLoaded*/

/*function Notify*/
// function Notify(id, message, items){
//       var opt = {
//         type: "list",
//         title: "Results",
//         message: message,
//         iconUrl: 'img/super-man-icon.png',
//         items: items
//       };

//       chrome.notifications.clear(id, function() {
//           chrome.notifications.create(id, opt, function() {});
//       });
//   }

