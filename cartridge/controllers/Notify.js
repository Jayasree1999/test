'use strict';
var server = require('server');
var URLUtils = require('dw/web/URLUtils');
server.post('Handler', server.middleware.https, function (req, res, next) {
    var email = req.httpParameterMap.email.stringValue;
    var productId = req.httpParameterMap.productId.stringValue;

    var Transaction = require('dw/system/Transaction');
    try {
        Transaction.wrap(function () {
            var CustomObjectMgr = require('dw/object/CustomObjectMgr');
            var customObject = CustomObjectMgr.getCustomObject('JNotify', productId);

            if (empty(customObject)) {
                var co = CustomObjectMgr.createCustomObject('JNotify', productId);
                co.custom.email = email;
                res.redirect(URLUtils.url('Product-Show', 'pid').toString() + productId + '&success=done');
            } else {
                if (customObject.custom.email.includes(email)) {
                    res.print('Already sent');
                }
                else {
                    customObject.custom.email = customObject.custom.email + ',' + email;
                    res.redirect(URLUtils.url('Product-Show', 'pid').toString() + productId + '&success=done');
                }
            }
            
        });
    } catch (e) {
        var err = e;
        res.setStatusCode(500);
        res.json({
            error: true,
            queryString: err,
            redirectUrl: URLUtils.url('Error-Start').toString(),

        });
    }
    next();
});
server.get('success', function (req, res, next) {
    res.print('success');
    next();
});
module.exports = server.exports();