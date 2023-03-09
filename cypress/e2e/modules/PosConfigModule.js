/// <reference types="cypress" />

import commonChecking from "../../common/commonChecking"
import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"
import PosConfigModuleConfiguration from "../../fixtures/PosConfigModuleConfiguration"


const cc = new commonChecking
const cf = new commonFunctions
const dc = new databaseCommands
const posConfiguration = new PosConfigModuleConfiguration

class PosConfigModule {
    addPosConfig(posConfig, isUpdatePosConfig = false, isGetPosConfig = false, isDeletePosConfig = false) {
        let apiCredentialsId = '';
        let posConfigApiId = '';
        let apiEndpoint = '';

        /*Get random api credentials from database */
        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;

            /*Invoke Add Pos Config endpoint */
            cy.invokeAddPosConfigEndpoint(credentials[0][2].value, credentials[0][3].value, posConfig).then((apiResponse) => {
                cc.checkResponseBodyStatus(apiResponse);
                this.checkResponseBodyAddPosConfig(apiResponse);
                posConfigApiId = apiResponse.body.posConfigId;
                apiEndpoint = '/posData/' + posConfigApiId;
                
                /*Get the pos config's information added in the database */
                dc.getAmexApiPosConfigByApiId(posConfigApiId).then((dbResponse) => {
                    this.dbCheckAddPosConfig(dbResponse, posConfig, apiCredentialsId);
                })

                /*Update Pos Config */
                if (isUpdatePosConfig) {
                    let newPosConfig = posConfiguration.PosConfig();
                    cy.invokeAddPosConfigEndpoint(credentials[0][2].value, credentials[0][3].value, newPosConfig, posConfigApiId).then((apiResponse) => {
                        cc.checkResponseBodyStatus(apiResponse);

                        dc.getAmexApiPosConfigByApiId(posConfigApiId).then((dbResponse) => {
                            this.dbCheckAddPosConfig(dbResponse, newPosConfig, apiCredentialsId);
                        })
                    })
                }

                /*Get Pos Config*/
                else if (isGetPosConfig) {
                    cy.invokeCommonApi(credentials[0][2].value, credentials[0][3].value, 'GET', apiEndpoint).then((apiResponse) => {
                        this.checkResponseBodyGetPosConfig(apiResponse, posConfig)
                    })
                }

                /*Delete Pos Config*/
                else if (isDeletePosConfig) {
                    cy.invokeCommonApi(credentials[0][2].value, credentials[0][3].value, 'DELETE', apiEndpoint).then((apiResponse) => {
                        cc.checkResponseBodyStatus(apiResponse);

                        dc.getAmexApiPosConfigByApiId(posConfigApiId).then((dbResponse) => {
                            this.dbCheckDeletePosConfig(dbResponse)
                        })
                    })
                }
            })
        })
    }

    //Add/Update POS Config endpoint
    addPosConfigUsingInvalidCredentials(posConfig, isUpdatePosConfig = false) {
        let posConfigApiId = '';

        dc.getRandomAmexApiPosConfig().then((dbResponse) => {

            if (isUpdatePosConfig) {
                posConfigApiId = dbResponse[0][15].value;
            }

            else {
                posConfigApiId = null;
            }

            //Invoke Add/Update Pos Config endpoint using a null credentials
            cy.invokeAddPosConfigEndpoint(null, null, posConfig, posConfigApiId).then((apiResponse) => {
                cc.checkResponseBodyInvalidCredentials(apiResponse);
            })

            //Invoke Add/Update Pos Config endpoint using an invalid credentials
            cy.invokeAddPosConfigEndpoint(cf.generateRandomString(7), cf.generateRandomString(7), posConfig, posConfigApiId).then((apiResponse) => {
                cc.checkResponseBodyInvalidCredentials(apiResponse);
            })
        })
    }

    //Get/Delete POS Config endpoint
    accessPosConfigUsingInvalidCredentials(method) {
        let apiEndpoint = '';
        let posConfigApiId = '';

        dc.getRandomAmexApiPosConfig().then((dbResponse) => {
            posConfigApiId = dbResponse[0][15].value
            apiEndpoint = 'posData/' + posConfigApiId;

            cc.invokeTargetApiEndpoint(method, apiEndpoint);
        })
    }

    checkResponseBodyAddPosConfig(apiResponse) {
        expect(apiResponse.body).to.have.property('posConfigId');
    }


    dbCheckAddPosConfig(dbResponse, posConfig, apiCredentialsId) {
        assert.equal(dbResponse[0][1].value, posConfig.description, 'Description checking');
        assert.equal(dbResponse[0][2].value, posConfig.cardInputCapability, 'CardInputCapability checking');
        assert.equal(dbResponse[0][3].value, posConfig.cardholderAuthCapability, 'CardholderAuthCapability checking');
        assert.equal(dbResponse[0][4].value, posConfig.cardCaptureCapability, 'CardCaptureCapability checking');
        assert.equal(dbResponse[0][5].value, posConfig.operatingEnvironment, 'OperatingEnvironment checking');
        assert.equal(dbResponse[0][6].value, posConfig.cardholderPresent, 'CardholderPresent checking');
        assert.equal(dbResponse[0][7].value, posConfig.cardPresent, 'CardPresent checking');
        assert.equal(dbResponse[0][8].value, posConfig.cardDataInputMode, 'CardDataInputMode checking');
        assert.equal(dbResponse[0][9].value, posConfig.cardMemberAuthMethod, 'cardMemberAuthMethod checking');
        assert.equal(dbResponse[0][10].value, posConfig.cardMemberAuthEntity, 'cardMemberAuthEntity checking');
        assert.equal(dbResponse[0][11].value, posConfig.cardDataOutputCapability, 'CardDataOutputCapability checking');
        assert.equal(dbResponse[0][12].value, posConfig.terminalOutputCapability, 'TerminalOutputCapability checking');
        assert.equal(dbResponse[0][13].value, posConfig.pinCaptureCapability, 'PinCaptureCapability checking');
        assert.equal(dbResponse[0][14].value, apiCredentialsId, 'ApiCredentialsId checking');
        assert.equal(dbResponse[0][16].value, true, 'IsActive checking');
    }

    checkResponseBodyGetPosConfig(apiResponse, posConfig) {
        expect(apiResponse.status).to.equal(200);
        assert.equal(apiResponse.body.description, posConfig.description, 'Description checking');
        assert.equal(apiResponse.body.cardInputCapability, posConfig.cardInputCapability, 'CardInputCapability checking');
        assert.equal(apiResponse.body.cardholderAuthCapability, posConfig.cardholderAuthCapability, 'CardholderAuthCapability checking');
        assert.equal(apiResponse.body.cardCaptureCapability, posConfig.cardCaptureCapability, 'CardCaptureCapability checking');
        assert.equal(apiResponse.body.operatingEnvironment, posConfig.operatingEnvironment, 'OperatingEnvironment checking');
        assert.equal(apiResponse.body.cardholderPresent, posConfig.cardholderPresent, 'CardholderPresent checking');
        assert.equal(apiResponse.body.cardDataInputMode, posConfig.cardDataInputMode, 'CardPresent checking');
        assert.equal(apiResponse.body.cardMemberAuthMethod, posConfig.cardMemberAuthMethod, 'CardDataInputMode checking');
        assert.equal(apiResponse.body.cardMemberAuthEntity, posConfig.cardMemberAuthEntity, 'cardMemberAuthMethod checking');
        assert.equal(apiResponse.body.cardMemberAuthEntity, posConfig.cardMemberAuthEntity, 'cardMemberAuthEntity checking');
        assert.equal(apiResponse.body.cardDataOutputCapability, posConfig.cardDataOutputCapability, 'CardDataOutputCapability checking');
        assert.equal(apiResponse.body.terminalOutputCapability, posConfig.terminalOutputCapability, 'TerminalOutputCapability checking');
        assert.equal(apiResponse.body.pinCaptureCapability, posConfig.pinCaptureCapability, 'PinCaptureCapability checking');
    }

    dbCheckDeletePosConfig(posConfig) {
        assert.equal(posConfig.length, 0, 'Checking if pos config is deleted successfully.')
    }
}

export default PosConfigModule