'use strict';
var formValidation = require('base/components/formValidation');
$(document).ready(function () {
    $('form.checkout-registration').submit(function (e) {
        var form = $(this);
        e.preventDefault();
        var url = form.attr('action');
        form.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            success: function (data) {
                form.spinner().stop();
                if (!data.success) {
                    formValidation(form, data);
                } else {
                    location.href = data.redirectUrl;
                }
            },
            error: function (err) {
                if (err.responseJSON.redirectUrl) {
                    window.location.href = err.responseJSON.redirectUrl;
                }
                form.spinner().stop();
            }
        });
        return false;
    });
    $('.download_pdf').click(function (e) {
        var element = document.getElementById('divToExport');
        element.style.width = '700px';
        element.style.height = '900px';
        var opt = {
            margin:       0.5,
            filename:     'invoice.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait',precision: '12' }
          };
        // choose the element and pass it to html2pdf() function and call the save() on it to save as pdf.
        html2pdf().set(opt).from(element).save();
    });
});