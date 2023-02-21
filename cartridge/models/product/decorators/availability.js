'use strict';

var Resource = require('dw/web/Resource');
var customerGroupHelper = require('*/cartridge/scripts/helpers/customerGroupHelper');
var estimateDeliveryDate = new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000));

module.exports = function (object, quantity, minOrderQuantity, availabilityModel) {
    var mySitePrefValue = dw.system.Site.getCurrent().getPreferences().getCustom()['product_Sku'];
    Object.defineProperty(object, 'availability', {
        enumerable: true,
        value: (function () {
            var availability = {};
            availability.messages = [];
            var productQuantity = quantity ? parseInt(quantity, 10) : minOrderQuantity;
            var availabilityModelLevels = availabilityModel.getAvailabilityLevels(productQuantity);
            var inventoryRecord = availabilityModel.inventoryRecord;

            if (inventoryRecord && inventoryRecord.inStockDate) {
                availability.inStockDate = inventoryRecord.inStockDate.toDateString();
            } else {
                availability.inStockDate = null;
            }


            // code for availability instock or not
            var atsvalue = availabilityModel.inventoryRecord != null ? availabilityModel.inventoryRecord.ATS.value : 0;
            var cust = session.isCustomerAuthenticated();

            if (atsvalue < mySitePrefValue && atsvalue > 0) {
                if (session.isCustomerAuthenticated()) {
                    if (customerGroupHelper.isCustomerInGroup()) {
                        if (availabilityModelLevels.inStock.value === productQuantity) {
                            availability.messages.push(Resource.msg('label.instock', 'common', null));
                            availability.messages.push("Expected Delivery by    :   " + estimateDeliveryDate.getDate() + '/' + (estimateDeliveryDate.getMonth() + 1) + '/' + estimateDeliveryDate.getFullYear());
                        } else {
                            availability.messages.push(Resource.msgf('label.quantity.in.stock', 'common',
                                null, availabilityModelLevels.inStock.value));
                        }
                    }
                } else {
                    availability.messages.push(Resource.msg('This product is available for only specific customers', 'common',
                        null));
                }
            } else if (availabilityModelLevels.inStock.value === productQuantity) {
                availability.messages.push(Resource.msg('label.instock', 'common', null));
                availability.messages.push("Expected Delivery by    :   " + estimateDeliveryDate.getDate() + '/' + (estimateDeliveryDate.getMonth() + 1) + '/' + estimateDeliveryDate.getFullYear());
            }
            //--------------------

            if (availabilityModelLevels.preorder.value > 0) {
                if (availabilityModelLevels.preorder.value === productQuantity) {
                    availability.messages.push(Resource.msg('label.preorder', 'common', null));
                } else {
                    availability.messages.push(
                        Resource.msgf(
                            'label.preorder.items',
                            'common',
                            null,
                            availabilityModelLevels.preorder.value
                        )
                    );
                }
            }

            if (availabilityModelLevels.backorder.value > 0) {
                if (availabilityModelLevels.backorder.value === productQuantity) {
                    availability.messages.push(Resource.msg('label.back.order', 'common', null));
                } else {
                    availability.messages.push(
                        Resource.msgf(
                            'label.back.order.items',
                            'common',
                            null,
                            availabilityModelLevels.backorder.value
                        )
                    );
                }
            }

            if (availabilityModelLevels.notAvailable.value > 0) {
                if (availabilityModelLevels.notAvailable.value === productQuantity) {
                    availability.messages.push(Resource.msg('label.not.available', 'common', null));
                } else {
                    availability.messages.push(Resource.msg('label.not.available.items', 'common', null));
                }
            }

            return availability;
        })(),
    });

    //code for availabilty property true or false
    var atsvalue = availabilityModel.inventoryRecord != null ? availabilityModel.inventoryRecord.ATS.value : 0;

    var isAtsValflag;
    if (atsvalue > mySitePrefValue) {
        isAtsValflag = availabilityModel.isOrderable(parseFloat(quantity) || minOrderQuantity)
    } else if (atsvalue < mySitePrefValue && atsvalue > 0) {
        if (session.isCustomerAuthenticated()) {
            if (customerGroupHelper.isCustomerInGroup()) {
                isAtsValflag = availabilityModel.isOrderable(parseFloat(quantity) || minOrderQuantity)
            } else {
                isAtsValflag = false;
            }
        }
    }
    Object.defineProperty(object, 'deliveryDate', {
        enumerable: true,
        value: estimateDeliveryDate,
    });

    Object.defineProperty(object, 'available', {
        enumerable: true,
        value: isAtsValflag
    });
};