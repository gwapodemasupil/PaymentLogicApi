/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class AmexApiCards {
    Cards(cardType) {
        var data = {
            cardNumber : cf.generateRandomCardNumber(cardType),
            cardHolder : 'AmexApiAddCard_' + cf.generateRandomString(7),
            cardHolderEmail : 'AmexApiAddCard_' + cf.generateRandomString(10) + '@paymentlogic.com.au',
            countryCode : cf.generateRandomCountryCode(),
            expiryMonth : cf.generateRandomExpiryMonth(),
            expiryYear : cf.generateExpiryYear(), 
            tokenStatus : cf.generateRandomTokenStatus()
        }
        return data
    }
}

export default AmexApiCards