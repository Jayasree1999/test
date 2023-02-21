'use strict';
var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
server.get('Show', function (req, res, next) {
    var actionUrl = URLUtils.url('GoogleRecaptcha-Submit');
    var Cutomform = server.forms.getForm('customform');
    Cutomform.clear();
    var recaptcha = getterRecaptcha();
    res.render('/home/recaptchatemplate', {
        actionUrl: actionUrl,
        form: Cutomform,
        recaptcha: recaptcha
    })
    next();
})
// function to get custom prefrences
function getterRecaptcha() {
    var googleSitekey = dw.system.Site.current.preferences.custom.recaptcha_site_key;
    var googleSecretKey = dw.system.Site.current.preferences.custom.recaptcha_secret_key;
    var googRecaptchaScript = dw.system.Site.current.preferences.custom.recaptcha_script_path;
    return {
        "googleSitekey": googleSitekey,
        "googleSecretKey": googleSecretKey,
        "googRecaptchaScript": googRecaptchaScript
    }
}
​
server.post(
    'Submit',
    server.middleware.https,
    function (req, res, next) {
        var Transaction = require("dw/system/Transaction");
        var customObjectMgr = require("dw/object/CustomObjectMgr");
        var continueUrl = URLUtils.url('GoogleRecaptcha-Show')
        var Cutomform = server.forms.getForm('customform');
        Transaction.wrap(function () {
            var customObj = customObjectMgr.createCustomObject('Form', Cutomform.email.value);
            customObj.custom.FirstName = Cutomform.fname.value;
            customObj.custom.LastName = Cutomform.lname.value;
            customObj.custom.Email = Cutomform.email.value;
        });
        res.render('home/success', {
            continueUrl: continueUrl,
            form: Cutomform
        });
        next();
    });
module.exports = server.exports();