/// <reference types="cypress" />

class databaseCommands {
    /*dbo.AddressDetails */
    getAddressDetails(addressDetailId) {
        var dbCommand = `select top 1 * from AddressDetails where id = '` + addressDetailId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.AddressItems */
    getAddressItems(addressEntityId, entityRecordId) {
        var dbCommand = `select top 1 * from AddressItems where addressentityid = '` + addressEntityId + `'` + ` and entityrecordid = '` + entityRecordId + `'` + ` order by id desc`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.AmexApiMerchantConfig */
    getAmexApiMerchantConfigByApiId(apiId) {
        var dbCommand = `select * from AmexApiMerchantConfig where apiid = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getAmexApiRandomMerchantConfig() {
        var dbCommand = `select top 1 * from AmexApiMerchantConfig where ApiCredentialsId = 3 and isActive = 1 order by newid()`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.AmexApiPosConfig */
    getAmexApiPosConfigByApiId(apiId) {
        var dbCommand = `select * from AmexApiPosConfig where apiid = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getAmexApiRandomPosConfig() {
        var dbCommand = `select top 1* from AmexApiPosConfig where ApiCredentialsId = 3 and isActive = 1 order by newid()`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.ApiCredentials*/
    getRandomApiCredentials(ressellerId = '5') {
        var dbCommand = `select * from ApiCredentials where resellerid = '` + ressellerId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.Cards*/
    getCardInfoByCardholderName(cardholderName) {
        var dbCommand = `select top 1 * from Cards where description = '` + cardholderName + `'` + ` order by id desc`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getCardDetailsByApiId(apiId) {
        var dbCommand = `select * from Cards where apiid = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }
}

export default databaseCommands