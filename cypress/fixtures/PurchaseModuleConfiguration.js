/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class PurchaseModuleConfiguration {
    Purchase(cardType) {
        var data = {
            //posConfigId: 'e32c258b-2763-433d-bdf0-46c720341f53',
            //merchantConfigId: 'c8c37656-a802-4187-93b9-9349762edeaa',
            cardAcceptorTerminalId: cf.generateRandomNumbers(4),
            cardNumber: cf.generateRandomCardNumber(cardType),
            cardHolder: 'ApiPurchase_' + cf.generateRandomString(7),
            expiryMonth: cf.generateRandomExpiryMonth(),
            expiryYear: cf.generateExpiryYear(),
            cid: cf.generateRandomNumbers(4),
            cardToken: '',
            amount: '9999.99',
            currency: 'AUD',
            track1Data: cf.generateRandomNumbers(6),
            track2Data: cf.generateRandomNumbers(6),
            customerData: {
                cardMemberFirstName: 'ApiPurchase_cardMemberFirstName_' + cf.generateRandomString(4),
                cardMemberLastName: 'ApiPurchase_cardMemberLastName_' + cf.generateRandomString(4),
                cardMemberBillingAddress: 'ApiPurchase_cardMemberBillingAddress_' + cf.generateRandomString(5),
                cardMemberPostalCode: cf.generateRandomNumbers(4),
                cardMemberPhone: '0400111222',
                cardMemberEmail: 'ApiPurchase_' + cf.generateRandomString(10) + '@paymentlogic.com.au',
                hostServer: 'paymentlogic.com',
                browserType: 'chrome',
                merchantSkuNo: cf.generateRandomNumbers(6),
                ipAddress: '1.1.1.1',
                shipToFirstName: 'ApiPurchase_shipToFirstName_' + cf.generateRandomString(4),
                shipToLastName: 'ApiPurchase_shipToLastName_' + cf.generateRandomString(4),
                shipToPhone: '0400111222',
                shipToAddress: 'ApiPurchase_shipToAddress_' + cf.generateRandomString(5),
                shipToPostalCode: cf.generateRandomNumbers(4),
                shipToMethodCode: cf.generateShipToMethodCode(),
                shipToCountryCode: cf.generateRandomCountryCode(),
            },
            responseCode: '000',
            getwaySettlementDate: cf.generateGatewaySettlementDate(),
            getAuthorisationDate: cf.generateAuthorisationDate(),
            plAdminUser: 'AutoUser1',
            plAdminPassword: 'test1234',
        }
        return data
    }
}

export default PurchaseModuleConfiguration