
document.addEventListener('DOMContentLoaded', function() {

  var API_PATH = 'http://localhost/Frontend/admin_v1/api/';
  // var API_PATH = 'http://dev.mccorp.co.com/sprint-2/admin_v1/api/';

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

  /*Quick add*/
  $('#btnQuickAdd').click(function(){
      var sendData = {
          data : {
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
      };
      /*Send data to api*/
      $.post(API_PATH + 'coupon/quick-add', sendData, function(response){
          if(response == '1'){
              $('#message').text('Success');
          }else{
              $('#message').text('Error');
          }
      })
  });

  // Input lost focus (except selectbox) => save last values to localStorage
  $('#title, #description,#product_link,#discount,#expire_date,#coupon_code,#tags,#categories_id')
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
      // var dataCoupon = jQuery.parseJSON(localStorage['coupon']);
      console.log(localStorage['coupon']);
  })

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
                response($.map(res, function (value, key) {
                    return {
                        label: value.name,
                        value: value.id
                    };
                }));
             }
         });
      },
      select: function(event, ui) { // After selected
          $('#searchStore').val(ui.item.label);
          $('#selectedStore').val(ui.item.value);
          // Get categories
          $.post(API_PATH + 'category/list', {storeId : $('#selectedStore').val()}, function(response){
              if(response != '404'){
                  $.each(response, function(index, value){
                      $('#categories_id').append(
                        $('<option></option>').attr('value', value.id).text(value.name)
                      );
                  })
              }
          })
          // Show form add coupon
          $('#container').show();
          return false;
      },
      minLength: 2 // Number of characters before start search
  });

  // Remove selected store
  $('#remove').click(function(){
      $('#').val('');
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
              $.post(API_PATH + 'user/authenticate', data, function(response){
                  console.log(response);
                  if(response != '404'){
                      localStorage['user'] = response;
                      $('.container').hide();
                      $('.form-add').show();
                      $('#searchStore').focus();
                      user = jQuery.parseJSON(localStorage['user']);
                      $('#welcome').text('Have a nice day ' + user.username + ' :)');
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
      $('.form-add').hide();
      $('.container').show();
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

