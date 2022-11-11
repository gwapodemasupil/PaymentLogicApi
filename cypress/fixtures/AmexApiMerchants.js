/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class AmexApiMerchants {
    Merchants() {
        var data = {
            merchantCategoryCode : cf.generateRandomNumbers(4),
            merchantSENumber : cf.generateRandomNumbers(10),
            merchantName : 'AmexApiAddMerchant_' + cf.generateRandomString(7),
            merchantCountryCode : cf.generateRandomCountryCode(),
            merchantPhone : "0400111222",
            merchantEmail : 'AmexApiAddMerchant_' + cf.generateRandomString(10) + '@paymentlogic.com.au',
            merchantStreet : 'AmexApiAddMerchant_' + cf.generateRandomString(5),
            merchantCity : 'AmexApiAddMerchant_' + cf.generateRandomString(3),
            merchantPostalCode : cf.generateRandomNumbers(4),
            merchantRegionCode : cf.generateRandomNumbers(1),
        }
        return data
    }
}

export default AmexApiMerchants