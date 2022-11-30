/// <reference types="cypress" />

import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"

const cf = new commonFunctions
const dc = new databaseCommands

class AmexCardModule {
    addAmexCard(cards, cardType, isUpdateCard = false, isGetCardMetadata = false) {
        let apiCredentialsId = '';
        let maskedCardNumber = '';
        let tokenRefId = '';
        let cardsApiId = '';

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
                    cardsApiId = dbResponse[0][41].value;
                })

                if (isUpdateCard) {
                    let apiEndpoint = 'card';
                    cy.invokeAmexUpdateCard(credentials, apiEndpoint, tokenRefId, cards.tokenStatus).then((putResponse) => {
                        this.responseBodyCheckForAmexUpdateCard(putResponse);
                        let getCardStatusEndpoint = 'card/' + tokenRefId + '/status';

                        cy.invokeAmexApi(credentials[0][2].value, credentials[0][3].value, 'GET', getCardStatusEndpoint).then((getResponse) => {
                            this.responseBodyCheckForGetCardStatus(getResponse);
                            dc.getCardDetailsByApiId(cardsApiId).then((dbResponse) => {
                                var updatedTokenStatus = this.initializeCardTokenStatus(cards.tokenStatus);
                                this.dbCheckAmexCardTokenStatus(dbResponse, updatedTokenStatus);
                            })
                        })
                    })
                }
                else if (isGetCardMetadata) {
                    let getCardMetadataEndpoint = 'card/' + tokenRefId + '/metadata'
                    cy.invokeAmexApi(credentials[0][2].value, credentials[0][3].value, 'GET', getCardMetadataEndpoint).then((getResponse) => {
                        dc.getCardDetailsByApiId(cardsApiId).then((dbResponse) => {
                            this.responseBodyCheckForAmexCardMetadata(getResponse, apiResponse, dbResponse);
                        })
                    })
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

    responseBodyCheckForGetCardStatus(apiResponse) {
        expect(apiResponse.status).to.equal(200);
        expect(apiResponse.body.tokenStatus, 'Active', 'Token status checking');
    }

    initializeCardTokenStatus(tokenValue) {
        let tokenStatus = '';

        if (tokenValue == 'suspend') {
            tokenStatus = 'Suspended'
        }

        else if (tokenValue == 'delete') {
            tokenStatus = 'Canceled'
        }
        else {
            tokenStatus = 'Active'
        }
        return tokenStatus;
    }

    dbCheckAmexCardTokenStatus(dbResponse, tokenStatus) {
        assert.equal(dbResponse[0][35].value, tokenStatus, 'TokenExpiryYear checking')
    }

    responseBodyCheckForAmexCardMetadata(getResponse, apiResponse, dbResponse) {
        expect(getResponse.status).to.equal(200);
        /*Checking between Get Card Metadata response and Add Card Response */
        expect(getResponse.body.cardProduct, apiResponse.body.cardProduct, 'Card Product checking');
        expect(getResponse.body.lastFourTokenNumber, cf.getLastDigit(apiResponse.body.cardToken, -4), 'Last Four Token number checking');
        expect(getResponse.body.tokenExpiryMonth, apiResponse.body.tokenExpiryMonth, 'Token Expiry Month checking');
        expect(getResponse.body.tokenExpiryYear, apiResponse.body.tokenExpiryYear, 'Token Expiry Year checking');

        /*Checking between Get Card Metadata response and Database record */
        expect(getResponse.body.expiryMonth, dbResponse[0][8].value, 'Card Expiry Month checking');
        expect(getResponse.body.expiryYear, dbResponse[0][9].value, 'Card Expiry Year checking');
        expect(getResponse.body.lastFourTokenNumber, cf.getLastDigit(dbResponse[0][30].value, -4), 'Card Token number checking');
        expect(getResponse.body.tokenExpiryMonth, dbResponse[0][33].value, 'Card Token Expiry Month checking');
        expect(getResponse.body.tokenExpiryYear, dbResponse[0][34].value, 'Card Token Expiry Year checking');
    }
}

export default AmexCardModule