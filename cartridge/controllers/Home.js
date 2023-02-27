'use strict';
var Content = require('dw/content/ContentMgr');
var server = require('server');
server.extend(module.superModule);
server.append('Show', function (req, res, next) {
    var Customer = require('dw/customer/Customer');
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var ProductFactory = require('*/cartridge/scripts/factories/product');

    var cx = require('dw/customer');
    var Order = require('dw/order/Order');
    var OrderHistory = require('dw/customer/OrderHistory');
    var customerOrderHistory = customer.getOrderHistory();
    var orders = customerOrderHistory.getOrders("status={0}", "creationDate DESC", Order.ORDER_STATUS_NEW);
    var viewData = res.getViewData();
    var OrderDate;
    var OrderLocation;
    var recentOrders = [];
    while (orders.hasNext()) {
        var order = orders.next();
        for (var item = 0; item < order.productLineItems.length; item++) {
            var product = order.productLineItems[item].product;
            var mypid = product.ID;
            var obj = {
                pid: product.ID
            }

            var product = {

                productdetail: ProductFactory.get(obj),
                orderDate: order.creationDate,
                OrderLocation: order.defaultShipment.shippingAddress.city

            };
            recentOrders.push(product);
        }
    }

    viewData = ({
        recentOrders: recentOrders,
    })

    res.setViewData(viewData);
    next();
});
module.exports = server.exports();
