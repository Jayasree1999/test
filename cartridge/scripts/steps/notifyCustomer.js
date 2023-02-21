'use strict';
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
module.exports = {
    notify: function notify(parameters) {
        var ProductMgr = require('dw/catalog/ProductMgr');
        var iterator = require('dw/util/Iterator');
        iterator = CustomObjectMgr.queryCustomObjects('JNotify', '', null);
        while (iterator.hasNext()) {
            var co = iterator.next();
            var y = co.custom.pid.toString();
            var product = ProductMgr.getProduct(y);
            if (product.getAvailabilityModel().getAvailabilityStatus() == 'IN_STOCK') {
                Transaction.wrap(function () {
                    
                    var HashMap = require('dw/util/HashMap');
                    var Map = require('dw/util/Map');
                    var Mail = require('dw/net/Mail');
                    var Resource = require('dw/web/Resource');
                    var Site = require('dw/system/Site');
                    var Template = require('dw/util/Template');

                    var map = new HashMap();
                    map.put('pid', y);
                    var email = new Mail();
                    var template = new dw.util.Template('notify/notifyMeMail');
                    var content = template.render(map).text;
                    email.addTo(co.custom.email);
                    email.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com');
                    email.setSubject(Resource.msg('notify.confirmation.subject', 'forms', null));
                    email.setContent(content, 'text/html', 'UTF-8');
                    email.send();
                    CustomObjectMgr.remove(co);
                });
            }
        }
    },
};