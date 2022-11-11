/// <reference types="cypress" />

import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"

const cf = new commonFunctions
const dc = new databaseCommands

class AmexCardModule {
    addAmexCard(cards, cardType, isUpdateCard = false, isGetCardStatus = false, isGetCardMetadata = false) {
        let apiCredentialsId = '';
        let maskedCardNumber = '';
        let tokenRefId = '';

        /*Get random api credentials from database */
        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;

            /*Initialize Masked Card number */
            maskedCardNumber = cf.setMaskedCardNumber(cards.cardNumber);

            /*Invoike Amex Add Card endpoint */
            cy.invokeAmexAddCard(credentials[0][2].value, credentials[0][3].value, cards).then((apiResponse) => {
                this.responseBodyCheckForAmexAddCard(apiResponse);
                tokenRefId = apiResponse.body.tokenRefId;

                /*Get the information of the added card*/
                dc.getCardInfoByCardholderName(cards.cardHolder).then((dbResponse) => {
                    this.dbCheckAmexAddCard(dbResponse, cards, apiResponse, apiCredentialsId, cardType, maskedCardNumber);
                })

                if (isUpdateCard) {
                    let apiEndpoint = 'card';
                    cy.invokeAmexUpdateCard(credentials, apiEndpoint, tokenRefId, cards.tokenStatus).then((apiResponse) => {
                        this.responseBodyCheckForAmexUpdateCard(apiResponse);
                    })
                }

                else if (isGetCardStatus) {

                }

                else if (isGetCardMetadata) {

                }
            })
        })
    }

    /*Checking the properties of the api response body*/
    responseBodyCheckForAmexAddCard(apiResponse) {
        expect(apiResponse.status).to.equal(200)
        expect(apiResponse.body).to.have.property('cardProduct')
        expect(apiResponse.body).to.have.property('cardToken')
        expect(apiResponse.body).to.have.property('tokenExpiryMonth')
        expect(apiResponse.body).to.have.property('tokenExpiryYear')
        expect(apiResponse.body).to.have.property('tokenRefId')
    }

    /*Comparing database record from api request and response values*/
    dbCheckAmexAddCard(dbResponse, cards, apiResponse, apiCredentialsId, cardType, maskedCardNumber) {
        assert.equal((dbResponse[0][1].value).toLowerCase(), cardType, 'CardTypeCode checking')
        assert.equal(dbResponse[0][2].value, null, 'ClientId checking')
        assert.equal(dbResponse[0][3].value, null, 'UserId checking')
        assert.equal(dbResponse[0][4].value, cards.cardHolder, 'Description checking')
        assert.equal(dbResponse[0][6].value, maskedCardNumber, 'MaskedCardNumber checking')
        assert.equal(dbResponse[0][7].value, cards.cardHolder, 'CardholderName checking')
        assert.equal(dbResponse[0][8].value, cards.expiryMonth, 'CardExpiryMonth checking')
        assert.equal(dbResponse[0][9].value, cards.expiryYear, 'CardExpiryYear checking')
        assert.equal(dbResponse[0][10].value, true, 'IsActive checking')
        assert.equal(dbResponse[0][24].value, true, 'IsApproved checking')
        assert.equal(dbResponse[0][27].value, 'Approved', 'Status checking')
        assert.equal(dbResponse[0][30].value, apiResponse.body.cardToken, 'TokenNumber checking')
        assert.equal(dbResponse[0][31].value, apiResponse.body.tokenRefId, 'TokenRefId checking')
        //assert.equal(dbResponse[0][32].value, cards.countryCode, 'CountryCode checking')
        assert.equal(dbResponse[0][33].value, apiResponse.body.tokenExpiryMonth, 'TokenExpiryMonth checking')
        assert.equal(dbResponse[0][34].value, apiResponse.body.tokenExpiryYear, 'TokenExpiryYear checking')
        assert.equal(dbResponse[0][48].value, apiCredentialsId, 'ApiCredentialId checking')
    }

    responseBodyCheckForAmexUpdateCard(apiResponse) {
        expect(apiResponse.status).to.equal(200);
    }
}

export default AmexCardModule