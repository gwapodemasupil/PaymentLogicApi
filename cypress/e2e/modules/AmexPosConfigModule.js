/// <reference types="cypress" />

import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"
import AmexApiPosConfig from "../../fixtures/AmexApiPosConfig"

const cf = new commonFunctions
const dc = new databaseCommands
const aapc = new AmexApiPosConfig

class AmexApiPosConfigModule {
    addAmexPosConfig(posConfig, isUpdatePosConfig = false, isGetPosConfig = false, isDeletePosConfig = false) {
        let apiCredentialsId = '';
        let posConfigId = '';
        let apiEndpoint = '';

        /*Get random api credentials from database */
        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;

            /*Invoke Amex Add Pos Config endpoint */
            cy.invokeAmexAddPosConfig(credentials[0][2].value, credentials[0][3].value, posConfig).then((apiResponse) => {
                this.responseBodyCheckforAmexAddPosConfig(apiResponse);
                posConfigId = apiResponse.body.posConfigId;
                apiEndpoint = '/posData/' + posConfigId;
                
                /*Get the pos config's information added in the database */
                dc.getAmexApiPosConfigByApiId(posConfigId).then((dbResponse) => {
                    this.dbCheckAmexAddPosConfig(dbResponse, posConfig, apiCredentialsId);
                })

                /*Update Pos Config */
                if (isUpdatePosConfig) {
                    let newPosConfig = aapc.PosConfig();
                    cy.invokeAmexUpdatePosConfig(credentials[0][2].value, credentials[0][3].value, newPosConfig, posConfigId).then((apiResponse) => {
                        this.responseBodyCheckForAmexUpdatePosConfig(apiResponse);

                        dc.getAmexApiPosConfigByApiId(posConfigId).then((dbResponse) => {
                            this.dbCheckAmexAddPosConfig(dbResponse, newPosConfig, apiCredentialsId);
                        })
                    })
                }

                /*Get Pos Config*/
                else if (isGetPosConfig) {
                    cy.invokeAmexApi(credentials[0][2].value, credentials[0][3].value, 'GET', apiEndpoint).then((apiResponse) => {
                        this.responseBodyCheckForGetPosConfig(apiResponse, posConfig)
                    })
                }

                /*Delete Pos Config*/
                else if (isDeletePosConfig) {
                    cy.invokeAmexApi(credentials[0][2].value, credentials[0][3].value, 'DELETE', apiEndpoint).then((apiResponse) => {
                        this.responseBodyCheckForAmexUpdatePosConfig(apiResponse);

                        dc.getAmexApiPosConfigByApiId(posConfigId).then((dbResponse) => {
                            this.dbCheckAmexDeletePosConfig(dbResponse)
                        })
                    })
                }
            })
        })
    }

    responseBodyCheckforAmexAddPosConfig(apiResponse) {
        expect(apiResponse.status).to.equal(200);
        expect(apiResponse.body).to.have.property('posConfigId');
    }

    responseBodyCheckForAmexUpdatePosConfig(apiResponse) {
        expect(apiResponse.status).to.equal(200);
    }

    dbCheckAmexAddPosConfig(dbResponse, posConfig, apiCredentialsId) {
        assert.equal(dbResponse[0][1].value, posConfig.description, 'Description checking');
        assert.equal(dbResponse[0][2].value, posConfig.cardInputCapability, 'CardInputCapability checking');
        assert.equal(dbResponse[0][3].value, posConfig.cardholderAuthCapability, 'CardholderAuthCapability checking');
        assert.equal(dbResponse[0][4].value, posConfig.cardCaptureCapability, 'CardCaptureCapability checking');
        assert.equal(dbResponse[0][5].value, posConfig.operatingEnvironment, 'OperatingEnvironment checking');
        assert.equal(dbResponse[0][6].value, posConfig.cardholderPresent, 'CardholderPresent checking');
        assert.equal(dbResponse[0][7].value, posConfig.cardPresent, 'CardPresent checking');
        assert.equal(dbResponse[0][8].value, posConfig.cardDataInputMode, 'CardDataInputMode checking');
        assert.equal(dbResponse[0][9].value, posConfig.cardmemberAuthMethod, 'CardmemberAuthMethod checking');
        assert.equal(dbResponse[0][10].value, posConfig.cardmemberAuthEntity, 'CardmemberAuthEntity checking');
        assert.equal(dbResponse[0][11].value, posConfig.cardDataOutputCapability, 'CardDataOutputCapability checking');
        assert.equal(dbResponse[0][12].value, posConfig.terminalOutputCapability, 'TerminalOutputCapability checking');
        assert.equal(dbResponse[0][13].value, posConfig.pinCaptureCapability, 'PinCaptureCapability checking');
        assert.equal(dbResponse[0][14].value, apiCredentialsId, 'ApiCredentialsId checking');
        assert.equal(dbResponse[0][16].value, true, 'IsActive checking');
    }

    responseBodyCheckForGetPosConfig(apiResponse, posConfig) {
        expect(apiResponse.status).to.equal(200);
        assert.equal(apiResponse.body.description, posConfig.description, 'Description checking');
        assert.equal(apiResponse.body.cardInputCapability, posConfig.cardInputCapability, 'CardInputCapability checking');
        assert.equal(apiResponse.body.cardholderAuthCapability, posConfig.cardholderAuthCapability, 'CardholderAuthCapability checking');
        assert.equal(apiResponse.body.cardCaptureCapability, posConfig.cardCaptureCapability, 'CardCaptureCapability checking');
        assert.equal(apiResponse.body.operatingEnvironment, posConfig.operatingEnvironment, 'OperatingEnvironment checking');
        assert.equal(apiResponse.body.cardholderPresent, posConfig.cardholderPresent, 'CardholderPresent checking');
        assert.equal(apiResponse.body.cardDataInputMode, posConfig.cardDataInputMode, 'CardPresent checking');
        assert.equal(apiResponse.body.cardmemberAuthMethod, posConfig.cardmemberAuthMethod, 'CardDataInputMode checking');
        assert.equal(apiResponse.body.cardmemberAuthEntity, posConfig.cardmemberAuthEntity, 'CardmemberAuthMethod checking');
        assert.equal(apiResponse.body.cardmemberAuthEntity, posConfig.cardmemberAuthEntity, 'CardmemberAuthEntity checking');
        assert.equal(apiResponse.body.cardDataOutputCapability, posConfig.cardDataOutputCapability, 'CardDataOutputCapability checking');
        assert.equal(apiResponse.body.terminalOutputCapability, posConfig.terminalOutputCapability, 'TerminalOutputCapability checking');
        assert.equal(apiResponse.body.pinCaptureCapability, posConfig.pinCaptureCapability, 'PinCaptureCapability checking');
    }

    dbCheckAmexDeletePosConfig(posConfig) {
        assert.equal(posConfig.length, 0, 'Checking if pos config is deleted successfully.')
    }
}

export default AmexApiPosConfigModule