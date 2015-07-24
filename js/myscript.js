
window.addEventListener("load", MainFunction, false);

function MainFunction(evt) {

    $(document).on("keydown", function(e) {
        // Alt + C
        if((e.keyCode == 67) && e.altKey) {
            var clipboardData = 'Copied : <input style="width:300px" type="text" id="copyData">';
            if($('#myRS').length == 0){
                $('body').prepend("<div style='background-color:whitesmoke;' id='myRS'></div>");
                $('#myRS').html(clipboardData);
            }else{
                $('#myRS').html(clipboardData);
            }
            $('#copyData').select();
            document.execCommand('paste');
            var url = $('#copyData').val();

            // $.get('http://localhost/Frontend/admin_v1/api/store/check-exists?url=' + url,
            $.get('http://dev.mccorp.co.com/sprint-2/admin_v1/api/store/check-exists?url=' + url,
            function(response){

                if(response.length > 0){
                    // $('#myRS').append("<br> Maybe existed <br>");
                    // for(var i = 0; i < response.length; i++){
                    //     var store =
                    //     "Url: <a target='_blank' href='" + response[i].store_url + "'>" + response[i].store_url + "</a> <br>"
                    //     + "Name: " + response[i].name
                    //     + "</div><hr>";
                    //     $('#myRS').append(store);

                }else{
                    $('#myRS').append('Your copied data not match any store url');
                }
            })
        }
    })
}
/*
document.addEventListener("keypress", function(event) {
  // alert('ok');
    if((e.keyCode == 69 || e.keyCode == 101) && e.ctrlKey && e.shiftKey) {
        alert('ok');
    }
}, true);*/
