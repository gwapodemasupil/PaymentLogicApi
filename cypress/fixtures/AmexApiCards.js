/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class AmexApiCards {
    Cards(cardType, tokenStatus) {
        var data = {
            cardNumber : cf.generateRandomCardNumber(cardType),
            cardHolder : 'AmexApiAddCard_' + cf.generateRandomString(7),
            cardHolderEmail : 'AmexApiAddCard_' + cf.generateRandomString(10) + '@paymentlogic.com.au',
            countryCode : cf.generateRandomCountryCode(),
            expiryMonth : cf.generateRandomExpiryMonth(),
            expiryYear : cf.generateExpiryYear(), 
            //tokenStatus : cf.generateRandomTokenStatus()
            tokenStatus : tokenStatus
        }
        return data
    }
}

export default AmexApiCards