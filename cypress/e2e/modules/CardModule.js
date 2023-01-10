/// <reference types="cypress" />

import commonChecking from "../../common/commonChecking"
import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"

const cc = new commonChecking
const cf = new commonFunctions
const dc = new databaseCommands

class CardModule {
    addCard(cards, cardType, isUpdateCard = false, isGetCardMetadata = false) {
        let apiCredentialsId = '';
        let maskedCardNumber = '';
        let tokenRefId = '';
        let cardsApiId = '';

        /*Initialize Masked Card number */
        maskedCardNumber = cf.setMaskedCardNumber(cards.cardNumber);

        /*Get random api credentials from database */
        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;

            /*Invoke Add Card endpoint */
            cy.invokeAddCardEndpoint(credentials[0][2].value, credentials[0][3].value, cards).then((apiResponse) => {
                cc.checkResponseBodyStatus(apiResponse);
                this.checkResponseBodyAddCardEndpoint(apiResponse);
                tokenRefId = apiResponse.body.tokenRefId;

                /*Get the information of the added card*/
                dc.getCardInfoByCardholderName(cards.cardHolder).then((dbResponse) => {
                    this.dbCheckAddCard(dbResponse, cards, apiResponse, apiCredentialsId, cardType, maskedCardNumber);
                    cardsApiId = dbResponse[0][41].value;
                })

                if (isUpdateCard) {
                    let apiEndpoint = 'card';
                    cy.invokeUpdateCardEndpoint(credentials[0][2].value, credentials[0][3].value, apiEndpoint, tokenRefId, cards.tokenStatus).then((putResponse) => {
                        cc.checkResponseBodyStatus(putResponse);
                        let getCardStatusEndpoint = 'card/' + tokenRefId + '/status';

                        cy.invokeCommonApi(credentials[0][2].value, credentials[0][3].value, 'GET', getCardStatusEndpoint).then((getResponse) => {
                            cc.checkResponseBodyStatus(getResponse);
                            this.checkResponseBodyGetCardStatus(getResponse);
                            dc.getCardDetailsByApiId(cardsApiId).then((dbResponse) => {
                                var updatedTokenStatus = this.initializeCardTokenStatus(cards.tokenStatus);
                                this.dbCheckCardTokenStatus(dbResponse, updatedTokenStatus);
                            })
                        })
                    })
                }
                else if (isGetCardMetadata) {
                    let getCardMetadataEndpoint = 'card/' + tokenRefId + '/metadata'
                    cy.invokeCommonApi(credentials[0][2].value, credentials[0][3].value, 'GET', getCardMetadataEndpoint).then((getResponse) => {
                        cc.checkResponseBodyStatus(getResponse);
                        dc.getCardDetailsByApiId(cardsApiId).then((dbResponse) => {
                            this.checkResponseBodyCardMetadata(getResponse, apiResponse, dbResponse);
                        })
                    })
                }
            })
        })
    }

    //Add Card endpoint
    addCardUsingInvalidCredentials(cards) {
        //Invoke Add Card endpoint using a null credentials
        cy.invokeAddCardEndpoint(null, null, cards).then((apiResponse) => {
            cc.checkResponseBodyInvalidCredentials(apiResponse);
        })

        //Invoke Add Card endpoint using an invalid credentials
        cy.invokeAddCardEndpoint(cf.generateRandomString(7), cf.generateRandomString(7), cards).then((apiResponse) => {
            cc.checkResponseBodyInvalidCredentials(apiResponse);
        })
    }

    //Update Card endpoint
    updateCardUsingInvalidCredentials(tokenStatus) {
        let apiEndpoint = 'card';
        let tokenRefId = '';

        dc.getRandomCards().then((dbResponse) => {
            tokenRefId = dbResponse[0][31].value;

            //Invoke Update Card endpoint using a null credentials
            cy.invokeUpdateCardEndpoint(null, null, apiEndpoint, tokenRefId, tokenStatus).then((apiResponse) => {
                cc.checkResponseBodyInvalidCredentials(apiResponse);
            })

            //Invoke Add Card endpoint using an invalid credentials
            cy.invokeUpdateCardEndpoint(cf.generateRandomString(7), cf.generateRandomString(7), apiEndpoint, tokenRefId, tokenStatus).then((apiResponse) => {
                cc.checkResponseBodyInvalidCredentials(apiResponse);
            })
        })
    }

    accessCardStatusUsingInvalidCredentials(method, isGetCardStatus = false) {
        let apiEndpoint = '';
        let tokenRefId = '';

        dc.getRandomCards().then((dbResponse) => {
            tokenRefId = dbResponse[0][31].value;

            //Get Card Status endpoint
            if (isGetCardStatus) {
                apiEndpoint = 'card/' + tokenRefId + '/status';
            }

            //Get Card Metadata endpoint
            else {
                apiEndpoint = 'card/' + tokenRefId + '/metadata';
            }

            //Invoke Get Card Status/Metadata
            cc.invokeTargetApiEndpoint(method, apiEndpoint);
        })
    }

    /*Checking the properties of the api response body*/
    checkResponseBodyAddCardEndpoint(apiResponse) {
        expect(apiResponse.body).to.have.property('cardProduct')
        expect(apiResponse.body).to.have.property('cardToken')
        expect(apiResponse.body).to.have.property('tokenExpiryMonth')
        expect(apiResponse.body).to.have.property('tokenExpiryYear')
        expect(apiResponse.body).to.have.property('tokenRefId')
    }

    /*Comparing database record from api request and response values*/
    dbCheckAddCard(dbResponse, cards, apiResponse, apiCredentialsId, cardType, maskedCardNumber) {
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
        assert.equal(dbResponse[0][33].value, apiResponse.body.tokenExpiryMonth, 'TokenExpiryMonth checking')
        assert.equal(dbResponse[0][34].value, apiResponse.body.tokenExpiryYear, 'TokenExpiryYear checking')
        assert.equal(dbResponse[0][48].value, apiCredentialsId, 'ApiCredentialId checking')
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

    dbCheckCardTokenStatus(dbResponse, tokenStatus) {
        assert.equal(dbResponse[0][35].value, tokenStatus, 'TokenExpiryYear checking')
    }

    checkResponseBodyGetCardStatus(apiResponse) {
        assert.equal(apiResponse.body.tokenStatus, 'Active', 'Token status checking');
    }

    checkResponseBodyCardMetadata(getResponse, apiResponse, dbResponse) {
        /*Checking between Get Card Metadata response and Add Card Response */
        assert.equal(getResponse.body.cardProduct, apiResponse.body.cardProduct, 'Card Product checking');
        assert.equal(getResponse.body.lastFourTokenNumber, cf.getLastDigit(apiResponse.body.cardToken, -4), 'Last Four Token number checking');
        assert.equal(getResponse.body.tokenExpiryMonth, apiResponse.body.tokenExpiryMonth, 'Token Expiry Month checking');
        assert.equal(getResponse.body.tokenExpiryYear, apiResponse.body.tokenExpiryYear, 'Token Expiry Year checking');

        /*Checking between Get Card Metadata response and Database record */
        assert.equal(getResponse.body.lastFourTokenNumber, cf.getLastDigit(dbResponse[0][30].value, -4), 'Card Token number checking');
        assert.equal(getResponse.body.tokenExpiryMonth, dbResponse[0][33].value, 'Card Token Expiry Month checking');
        assert.equal(getResponse.body.tokenExpiryYear, dbResponse[0][34].value, 'Card Token Expiry Year checking');
    }
}

export default CardModule