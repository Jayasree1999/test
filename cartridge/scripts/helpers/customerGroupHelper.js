'use strict';
var CustomerMgr = require('dw/customer/CustomerMgr');

function isCustomerInGroup() {
    var isCustInGroup = false;

    var customeGroupPreferenceValue = "specificCustomers";
    var customerNo = session.getCustomer().getProfile().customerNo;
    var customer = CustomerMgr.getCustomerByCustomerNumber(customerNo);
    var specificCustomerGroups = customer.getCustomerGroups();
    var customerGroups = CustomerMgr.getCustomerGroups();

    for (var i = 0; i < specificCustomerGroups.length; i++) {
        var specificCustomerGroup = specificCustomerGroups[i].ID;

        if (specificCustomerGroup == customeGroupPreferenceValue) {
            isCustInGroup = true;
        }
    }
    return isCustInGroup;
}
module.exports = {
    isCustomerInGroup: isCustomerInGroup
};