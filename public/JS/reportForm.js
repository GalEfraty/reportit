require('dotenv').config()

//url-dev:"http://localhost:3001/reports/create"
//url-prod:"https://report-it.herokuapp.com/reports/create"
$(function() {
    $('.lds-spinner').hide();

    $('#reportForm').ajaxForm({
        url: "https://report-it.herokuapp.com/reports/create", //"http://localhost:3001/reports/create"
        dataType: 'json',
        crossDomain: true,
        success: function (resp) {
            $('.lds-spinner').hide();
            $('#reportForm').show();

            swal({
                position: 'top-end',
                type: 'success',
                title: resp.message,
                showConfirmButton: false,
                timer: 1500
            })
        },
        error: function(e) {
            $('.lds-spinner').hide();
            $('#reportForm').show();
            
            console.log(e)

            swal({
                type: 'error',
                title: e.responseJSON.error
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