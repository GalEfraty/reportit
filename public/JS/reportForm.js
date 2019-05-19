//require('dotenv').config()

//url-dev:"http://localhost:3001/reports/create"
//url-prod:"https://report-it.herokuapp.com/reports/create"
$(function() {
    $('.lds-spinner').hide();

    $('#reportForm').ajaxForm({
        url: "https://report-it.herokuapp.com/reports/create",
        dataType: 'json',
        crossDomain: true,
        success: function (resp) {
            $('.lds-spinner').hide();
            $('#reportForm').show();    
            swal({
                title: resp.message,
                text: resp.text,
                type: "info",
                showCancelButton: false,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                showConfirmButton: true
              })
              .then(
                  function()
                    {
                        //"http://localhost:3001"
                        //"https://report-it.herokuapp.com"
                        location.replace("https://report-it.herokuapp.com")
                    }
                )
              },
        error: function(e) {
            $('.lds-spinner').hide();
            $('#reportForm').show();
            console.log(e)
            swal({
                type: 'error',
                title: e.responseJSON.error,
                showConfirmButton: true
            })
        },
        beforeSubmit: function(arr, $form, opts) {
            $('#reportForm').hide();
            $('.lds-spinner').show();

            opts['headers'] = {
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Credentials": true,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                "Access-Control-Allow-Headers": 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
            };
            return true;
        }
    });
});