/// <reference types="cypress" />

import commonChecking from "../../common/commonChecking"
import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"
import MerchantModuleConfiguration from "../../fixtures/MerchantModuleConfiguration"

const cc = new commonChecking
const cf = new commonFunctions
const dc = new databaseCommands
const merchantConfig = new MerchantModuleConfiguration

class MerchantModule {
    addMerchant(merchants, isUpdateMerchant = false, isGetMerchant = false, isDeleteMerchant = false) {
        let apiCredentialsId = '';
        let isUpdate = false;
        let apiEndpoint = '';
        let merchantConfigApiId  = '';
        let merchantId = '';
        let addressDetailId = '';

        /*Get random api credentials from database */
        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value

            /*Invoke Add Merchant endpoint */
            cy.invokeAddMerchantEndpoint(credentials[0][2].value, credentials[0][3].value, merchants).then((apiResponse) => {
                cc.checkResponseBodyStatus(apiResponse);
                this.checkResponseBodyAddMerchant(apiResponse);
                merchantConfigApiId = apiResponse.body.merchantConfigId;
                apiEndpoint = 'merchant/' + merchantConfigApiId;
                
                /*Get the merchant's information added in the database */
                dc.getAmexApiMerchantConfigByApiId(merchantConfigApiId).then((merchantDetails) => {
                    this.dbCheckAddMerchant(merchantDetails, merchants, apiCredentialsId, isUpdate)
                    merchantId = merchantDetails[0][0].value;

                    /*Get the merchant's address items added in the database */
                    dc.getAddressItems(4, merchantId).then((addressItems) => {

                        /*Get the merchant's address details added in the database */
                        dc.getAddressDetails(addressItems[0][1].value).then((addressDetails) => {
                            this.dbCheckAddressDetails(addressDetails, merchants)
                            addressDetailId = addressDetails[0][0].value;
                        })

                        /*Update Merchant */
                        if (isUpdateMerchant) {
                            let isUpdate = true;
                            let newMerchant = merchantConfig.Merchants()

                            cy.invokeAddMerchantEndpoint(credentials[0][2].value, credentials[0][3].value, newMerchant, merchantConfigApiId).then((apiResponse) => {
                                cc.checkResponseBodyStatus(apiResponse);

                                /*Get the merchant's information added in the database */
                                dc.getAmexApiMerchantConfigByApiId(merchantConfigApiId).then((updatedMerchant) => {
                                    this.dbCheckAddMerchant(updatedMerchant, newMerchant, apiCredentialsId, isUpdate)
                                    
                                    /*Get the merchant's address details added in the database */
                                    dc.getAddressDetails(addressDetailId).then((addressDetails) => {
                                        this.dbCheckAddressDetails(addressDetails, newMerchant)
                                    })
                                })
                            })
                        }

                        /*Get Merchant */
                        else if (isGetMerchant) {
                            cy.invokeCommonApi(credentials[0][2].value, credentials[0][3].value, 'GET', apiEndpoint).then((apiResponse) => {
                                cc.checkResponseBodyStatus(apiResponse);
                                this.checkResponseBodyGetMerchant(apiResponse, merchants);
                            })
                        }

                        /*Delete Merchant */
                        else if (isDeleteMerchant) {
                            cy.invokeCommonApi(credentials[0][2].value, credentials[0][3].value, 'DELETE', apiEndpoint).then((apiResponse) => {
                                cc.checkResponseBodyStatus(apiResponse);

                                /*Get the merchant's information added in the database */
                                dc.getAmexApiMerchantConfigByApiId(merchantConfigApiId).then((dbRecord) => {
                                    this.dbCheckDeleteMerchant(dbRecord);
                                })
                            })
                        }
                    })
                })
            })
        })    
    }

    //Add/Update Merchant endpoint
    addMerchantUsingInvalidCredentials(merchants, isUpdateMerchant = false) {
        let merchantConfigApiId = '';

        dc.getRandomAmexApiMerchantConfig().then((dbResponse) => {

            if (isUpdateMerchant) {
                merchantConfigApiId = dbResponse[0][7].value;
            }
            else {
                merchantConfigApiId = null;
            }

            //Invoke Add/Update Merchant endpoint using a null credentials
            cy.invokeAddMerchantEndpoint(null, null, merchants, merchantConfigApiId).then((apiResponse) => {
                cc.checkResponseBodyInvalidCredentials(apiResponse);
            })

            //Invoke Add/Update Merchant endpoint using an invalid credentials
            cy.invokeAddMerchantEndpoint(cf.generateRandomString(7), cf.generateRandomString(7), merchants, merchantConfigApiId).then((apiResponse) => {
                cc.checkResponseBodyInvalidCredentials(apiResponse);
            })
        })     
    }

    //Get/Delete Merchant Endpoint
    accessMerchantUsingInvalidCredentials(method) {
        let apiEndpoint = '';
        let merchantConfigApiId = '';

        dc.getRandomAmexApiMerchantConfig().then((dbResponse) => {
            merchantConfigApiId = dbResponse[0][7].value
            apiEndpoint = 'merchant/' + merchantConfigApiId;

            //Invoke Get/Delete Merchant endpoint using a null and invalid credentials
            cc.invokeTargetApiEndpoint(method, apiEndpoint);
        })
    }

    /*Checking the properties of the api response body*/
    checkResponseBodyAddMerchant(apiResponse) {
        expect(apiResponse.body).to.have.property('merchantConfigId');
    }

    /*Comparing database record from api request values*/
    dbCheckAddMerchant(merchantConfig, merchants, apiCredentialsId, isUpdate) {
        assert.equal(merchantConfig[0][1].value, merchants.merchantCategoryCode, 'MerchantCategoryCode checking');
        if (!isUpdate) {
            assert.equal(merchantConfig[0][2].value, merchants.merchantSENumber, 'MerchantSENumber checking');
        }
        assert.equal(merchantConfig[0][3].value, merchants.merchantName, 'MerchantName checking');
        assert.equal(merchantConfig[0][4].value, merchants.merchantPhone, 'MerchantPhone checking');
        assert.equal(merchantConfig[0][5].value, merchants.merchantEmail, 'MerchantEmail checking');
        assert.equal(merchantConfig[0][6].value, apiCredentialsId, 'ApiCredentialsId checking');
        assert.equal(merchantConfig[0][8].value, true, 'isActive checking');
    }

    /*Comparing database record from api request values*/
    dbCheckAddressDetails(addressDetails, merchants) {
        assert.equal(addressDetails[0][1].value, merchants.merchantCountryCode, 'CountryCode checking');
        assert.equal(addressDetails[0][2].value, merchants.merchantStreet, 'AddressLine1 checking');
        assert.equal(addressDetails[0][3].value, null, 'AddressLine2 checking');
        assert.equal(addressDetails[0][4].value, merchants.merchantCity, 'Suburb checking');
        assert.equal(addressDetails[0][5].value, merchants.merchantPostalCode, 'Postcode checking');
        assert.equal(addressDetails[0][6].value, merchants.merchantRegionCode, 'StateOrProvinceId checking');
        assert.equal(addressDetails[0][7].value, true, 'IsActive checking');
        assert.equal(addressDetails[0][12].value, null, 'OverrideStateOrProvinceName checking');
        assert.equal(addressDetails[0][13].value, null, 'PlaceId checking');
        assert.equal(addressDetails[0][14].value, null, 'Latitude checking');
        assert.equal(addressDetails[0][15].value, null, 'Longitude checking');
        assert.equal(addressDetails[0][16].value, null, 'GoogleAddress checking');
    }

    dbCheckDeleteMerchant(merchant) {
        assert.equal(merchant.length, 0, 'Checking if merchant is deleted successfully.')
    }

    checkResponseBodyGetMerchant(apiResponse, merchants) {
        assert.equal(apiResponse.body.merchantCategoryCode, merchants.merchantCategoryCode, 'MerchantCategoryCode checking');
        assert.equal(apiResponse.body.merchantSENumber, merchants.merchantSENumber, 'MerchantSENumber checking');
        assert.equal(apiResponse.body.merchantName, merchants.merchantName, 'MerchantName checking');
        assert.equal(apiResponse.body.merchantPhone, merchants.merchantPhone, 'MerchantPhone checking');
        assert.equal(apiResponse.body.merchantEmail, merchants.merchantEmail, 'MerchantEmail checking');
        assert.equal(apiResponse.body.merchantStreet, merchants.merchantStreet, 'MerchantStreet checking');
        assert.equal(apiResponse.body.merchantCity, merchants.merchantCity, 'MerchantCity checking');
        assert.equal(apiResponse.body.merchantPostalCode, merchants.merchantPostalCode, 'MerchantPostalCode checking');
        assert.equal(apiResponse.body.merchantRegionCode, merchants.merchantRegionCode, 'MerchantRegionCode checking');
        assert.equal(apiResponse.body.merchantCountryCode, merchants.merchantCountryCode, 'MerchantCountryCode checking');
    }
}

export default MerchantModule