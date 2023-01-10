/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class MerchantModuleConfiguration {
    Merchants() {
        var data = {
            merchantCategoryCode : cf.generateRandomNumbers(4),
            merchantSENumber : cf.generateRandomNumbers(10),
            merchantName : 'ApiMerchant_' + cf.generateRandomString(7),
            merchantCountryCode : cf.generateRandomCountryCode(),
            merchantPhone : "0400111222",
            merchantEmail : 'ApiMerchant_' + cf.generateRandomString(10) + '@paymentlogic.com.au',
            merchantStreet : 'ApiMerchant_' + cf.generateRandomString(5),
            merchantCity : 'ApiMerchant_' + cf.generateRandomString(3),
            merchantPostalCode : cf.generateRandomNumbers(4),
            merchantRegionCode : cf.generateRandomNumbers(1)
        }
        return data
    }
}

export default MerchantModuleConfiguration