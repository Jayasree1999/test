'use strict';
var server = require('server');
var URLUtils = require('dw/web/URLUtils');
server.get('ShowForm', function (req, res, next) {
    var Customform = server.forms.getForm('customerRegister');
    res.render('profile/referal', {
        form: Customform
    })
    next();
})
server.post('sendemail', function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var Coupon = require('dw/campaign/Coupon');
    var CoupounStatusCodes = require('dw/campaign/CouponStatusCodes');
    var CouponMgr = require('dw/campaign/CouponMgr');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var user = req.currentCustomer.profile;
    var referalEmail = req.form.email;
    var referalEamilObj = {
        to: referalEmail,
        subject: 'Refer and Earn',
        from: 'no-reply@testorganization.com'
    }
    var refereeEamilObj = {
        to: user ? user.email : "geetha.chowdisetty@gmail.com",
        subject: 'Thanks for referal',
        from: 'no-reply@testorganization.com'
    }
    var loggedinUser=false;
    var redemptions = CouponMgr.getRedemptions('10PerOffReferral','10PerOffReferral')
    var isEmailFound = false;
    if (redemptions.length > 0) {
        var collection = require('*/cartridge/scripts/util/collections');
        //redemption > current element is being processed , and a callback function executing for each element in array
        collection.forEach(redemptions, function (Coupon) {
            if (Coupon.customerEmail === referalEmail) {
                isEmailFound = true;
            }
        })
    }
    if (!isEmailFound) {
        emailHelpers.sendEmail(referalEamilObj, 'emailtemplate/referEmailTemplate', {})
        emailHelpers.sendEmail(refereeEamilObj, 'emailtemplate/refereeEmailTemplate', {})
        res.json({
            success: true,
            message: "Refered"
        })
    } else{
    res.json({
        success: false,
        message: "Already Refered"
    })
}
   res.render('/home/referalISML',{
    isEmailFound:isEmailFound
   })
    next();
});
module.exports = server.exports();