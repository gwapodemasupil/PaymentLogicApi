// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/*Cypress.Commands.add('sqlServer', (query) => {
    if (!query) {
      throw new Error('Query must be set');
    }
  
    cy.task('sqlServer:execute', query).then(recordset => {
        var rec = recordset
        const Values = Object.values(rec[0]);
        const keys = Object.keys(rec[0]);
        let result = {};
        let index = 0;
        keys.forEach(keys => {
            result[keys[index]] = Values[index];
            index++
            return result
        })        
    });
});*/

Cypress.Commands.add('sqlServer', (query) => {
    if (!query) {
      throw new Error('Query must be set');
    }
  
    cy.task('sqlServer:execute', query).then(recordset => {
        if (recordset.length > 0) {
            var rec = recordset
            const Values = Object.values(rec[0]);
            const keys = Object.keys(rec[0]);
            let result = {};
            let index = 0;
            keys.forEach(keys => {
                result[keys[index]] = Values[index];
                index++
                return result
            })        
        }
        else {
            return recordset
        }
    });
});

Cypress.Commands.add('invokeCommonApi', (clientId, clientSecret, method, apiEndpoint) => {
    return cy.request({
        method: method,
        url: Cypress.env('baseUrl') + apiEndpoint,
        failOnStatusCode: false,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        }
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('invokeAddCardEndpoint', (clientId, clientSecret, cards) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('baseUrl') + 'card/tokenise',
        failOnStatusCode: false,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        },
        body: {
            cardNumber: cards.cardNumber,
            cardHolder: cards.cardHolder,
            cardHolderEmail: cards.cardHolderEmail,
            countryCode: cards.countryCode,
            expiryMonth: cards.expiryMonth,
            expiryYear: cards.expiryYear
        }
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('invokeUpdateCardEndpoint', (clientId, clientSecret, apiEndpoint, tokenRefId, tokenStatus) => {
    return cy.request({
        method: 'PUT',
        url: Cypress.env('baseUrl') + apiEndpoint,
        failOnStatusCode: false,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        },
        body: {
            tokenRefId: tokenRefId,
            tokenStatus: tokenStatus
        }
    })
})

Cypress.Commands.add('invokeAddMerchantEndpoint', (clientId, clientSecret, merchants, merchantConfigApiId) => {
    let endpoint = '';
    let requestMethod = '';

    //Update Merchant endpoint
    if (merchantConfigApiId != null) {
        requestMethod = 'PUT';
        endpoint = Cypress.env('baseUrl') + 'merchant/' + merchantConfigApiId;
    }

    //Add Merchant endpoint
    else {
        requestMethod = 'POST';
        endpoint = Cypress.env('baseUrl') + 'merchant';
    }

    return cy.request({
        method: requestMethod,
        url: endpoint,
        failOnStatusCode: false,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        },
        body: {
            merchantName: merchants.merchantName,
            merchantCategoryCode: merchants.merchantCategoryCode,
            merchantSENumber: merchants.merchantSENumber,
            merchantCountryCode: merchants.merchantCountryCode,
            merchantPhone: merchants.merchantPhone,
            merchantEmail: merchants.merchantEmail,
            merchantStreet: merchants.merchantStreet,
            merchantCity: merchants.merchantCity,
            merchantPostalCode: merchants.merchantPostalCode,
            merchantRegionCode: merchants.merchantRegionCode
        },
        
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('invokeAddPosConfigEndpoint', (clientId, clientSecret, posConfig, posConfigApiId) => {
    let requestMethod = '';
    let endpoint = '';

    //Update POS Config endpoint
    if (posConfigApiId != null) {
        requestMethod = 'PUT'
        endpoint = Cypress.env('baseUrl') + 'posData/' + posConfigApiId;
    }

    //Add POS Config endpoint
    else {
        requestMethod = 'POST'
        endpoint = Cypress.env('baseUrl') + 'posData';
    }

    return cy.request({
        method: requestMethod,
        //url: Cypress.env('baseUrl') + 'posData',
        url: endpoint,
        failOnStatusCode: false,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        },
        body: {
            description : posConfig.description,
            cardInputCapability : posConfig.cardInputCapability,
            cardholderAuthCapability : posConfig.cardholderAuthCapability,
            cardCaptureCapability : posConfig.cardCaptureCapability,
            operatingEnvironment : posConfig.operatingEnvironment,
            cardholderPresent : posConfig.cardholderPresent,
            cardPresent: posConfig.cardPresent,
            cardDataInputMode: posConfig.cardDataInputMode,
            cardMemberAuthMethod: posConfig.cardMemberAuthMethod,
            cardMemberAuthEntity: posConfig.cardMemberAuthEntity,
            cardDataOutputCapability: posConfig.cardDataOutputCapability,
            terminalOutputCapability: posConfig.terminalOutputCapability,
            pinCaptureCapability: posConfig.pinCaptureCapability
        },
        
    }).then((response) => {
        return response
    })
})


Cypress.Commands.add('invokePurchaseEndpoint', (clientId, clientSecret, purchaseDetails, posConfigApiId, merchantConfigApiId) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('baseUrl') + 'purchase',
        failOnStatusCode: false,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        },
        body: {
            posConfigId: posConfigApiId,
            merchantConfigId: merchantConfigApiId,
            cardAcceptorTerminalId: purchaseDetails.cardAcceptorTerminalId,
            cardNumber: purchaseDetails.cardNumber,
            cardHolder: purchaseDetails.cardHolder,
            expiryMonth: purchaseDetails.expiryMonth,
            expiryYear: purchaseDetails.expiryYear,
            cid: purchaseDetails.cid,
            cardToken: purchaseDetails.cardToken,
            amount: purchaseDetails.amount,
            currency: purchaseDetails.currency,
            track1Data: purchaseDetails.track1Data,
            track2Data: purchaseDetails.track2Data,
            iccData: purchaseDetails.iccData,
            customerData: {
                cardMemberFirstName: purchaseDetails.customerData.cardMemberFirstName,
                cardMemberLastName: purchaseDetails.customerData.cardMemberLastName,
                cardMemberBillingAddress: purchaseDetails.customerData.cardMemberBillingAddress,
                cardMemberPostalCode: purchaseDetails.customerData.cardMemberPostalCode,
                cardMemberPhone: purchaseDetails.customerData.cardMemberPhone,
                cardMemberEmail: purchaseDetails.customerData.cardMemberEmail,
                hostServer: purchaseDetails.customerData.hostServer,
                browserType: purchaseDetails.customerData.browserType,
                merchantSkuNo: purchaseDetails.customerData.merchantSkuNo,
                ipAddress: purchaseDetails.customerData.ipAddress,
                shipToFirstName: purchaseDetails.customerData.shipToFirstName,
                shipToLastName: purchaseDetails.customerData.shipToLastName,
                shipToPhone: purchaseDetails.customerData.shipToPhone,
                shipToAddress: purchaseDetails.customerData.shipToAddress,
                shipToPostalCode: purchaseDetails.customerData.shipToPostalCode,
                shipToMethodCode: purchaseDetails.customerData.shipToMethodCode,
                shipToCountryCode: purchaseDetails.customerData.shipToCountryCode
            },
            mockResponseCode: purchaseDetails.responseCode
        }
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('webLogin', (email, password, smsCode) => {
    //Login Page
    cy.get('input[id="UserName"]').clear().type(email);
    cy.get('input[id="Password"]').clear().type(password);
    cy.get('button[class="btn btn-rounded btn-lg btn-primary btn-block"]').click();

    //MFA Page
    cy.wait(5000);
    cy.get('div[class="navbar-brand large block m-t theme"]').click();
    cy.get('input[class="form-control text-center ng-pristine ng-valid ng-empty ng-valid-maxlength ng-touched"]').type(smsCode);
    cy.get('button[type="submit"]').click();
    cy.wait(10000);
})