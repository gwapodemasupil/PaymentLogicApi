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

Cypress.Commands.add('invokeAmexAddCard', (clientId, clientSecret, cards) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('baseUrl') + 'card/tokenise',
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

Cypress.Commands.add('invokeAmexUpdateCard', (apiCredentials, apiEndpoint, tokenRefId, tokenStatus) => {
    return cy.request({
        method: 'PUT',
        url: Cypress.env('baseUrl') + apiEndpoint,
        headers: {
            'client-id': apiCredentials[0][2].value,
            'client-secret' : apiCredentials[0][3].value,
            'host': Cypress.env('hostServices')
        },
        body: {
            tokenRefId: tokenRefId,
            tokenStatus: tokenStatus
        }
    })
})

Cypress.Commands.add('invokeAmexAddMerchant', (clientId, clientSecret, merchants) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('baseUrl') + 'merchant',
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

Cypress.Commands.add('invokeAmexUpdateMerchant', (clientId, clientSecret, merchants, merchantConfigApiId) => {
    return cy.request({
        method: 'PUT',
        url: Cypress.env('baseUrl') + 'merchant/' + merchantConfigApiId,
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

Cypress.Commands.add('invokeAmexApi', (clientId, clientSecret, method, apiEndpoint) => {
    return cy.request({
        method: method,
        //url: Cypress.env('baseUrl') + 'merchant/' + merchantConfigApiId,
        url: Cypress.env('baseUrl') + apiEndpoint,
        headers: {
            'client-id': clientId,
            'client-secret' : clientSecret,
            'host': Cypress.env('hostServices')
        }
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('invokeAmexAddPosConfig', (clientId, clientSecret, posConfig) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('baseUrl') + 'posData',
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
            cardmemberAuthMethod: posConfig.cardmemberAuthMethod,
            cardmemberAuthEntity: posConfig.cardmemberAuthEntity,
            cardDataOutputCapability: posConfig.cardDataOutputCapability,
            terminalOutputCapability: posConfig.terminalOutputCapability,
            pinCaptureCapability: posConfig.pinCaptureCapability
        },
        
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('invokeAmexUpdatePosConfig', (clientId, clientSecret, posConfig, posConfigId) => {
    return cy.request({
        method: 'PUT',
        url: Cypress.env('baseUrl') + 'posData/' + posConfigId,
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
            cardmemberAuthMethod: posConfig.cardmemberAuthMethod,
            cardmemberAuthEntity: posConfig.cardmemberAuthEntity,
            cardDataOutputCapability: posConfig.cardDataOutputCapability,
            terminalOutputCapability: posConfig.terminalOutputCapability,
            pinCaptureCapability: posConfig.pinCaptureCapability
        },
        
    }).then((response) => {
        return response
    })
})