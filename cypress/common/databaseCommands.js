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
        var dbCommand = `select top 1 * from AddressItems where addressEntityId = '` + addressEntityId + `'` + ` and entityRecordId = '` + entityRecordId + `'` + ` order by id desc`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.AmexApiMerchantConfig */
    getAmexApiMerchantConfigByApiId(apiId) {
        var dbCommand = `select * from AmexApiMerchantConfig where apiId = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getRandomAmexApiMerchantConfig(credentialId = '3') {
        var dbCommand = `select top 1 * from AmexApiMerchantConfig where ApiCredentialsId = '` + credentialId + `'` + ` and isActive = 1 order by newId()`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.AmexApiPosConfig */
    getAmexApiPosConfigByApiId(apiId) {
        var dbCommand = `select * from AmexApiPosConfig where apiId = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getRandomAmexApiPosConfig(credentialId = '3') {
        var dbCommand = `select top 1 * from AmexApiPosConfig where ApiCredentialsId = '` + credentialId + `'` + ` and isActive = 1 order by newId()`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.ApiCredentials*/
    getRandomApiCredentials(resellerId = '5') {
        var dbCommand = `select * from ApiCredentials where resellerId = '` + resellerId + `'`;
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
        var dbCommand = `select * from Cards where apiId = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getRandomCards(cardType = 'Amex', credentialId = '3') {
        var dbCommand = `select top 1 * from cards where cardTypeCode = '` + cardType + `'` + `and apiCredentialId = '` + credentialId + `'` + `order by newId()`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.GcagAuthorisations */
    getGcagAuthorisationsByTransactionId(transactionId) {
        var dbCommand = `select * from GcagAuthorisations where transactionId = '` + transactionId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.Merchants*/
    getRandomMerchant() {
        var dbCommand = `select top 1 * from merchants where isActive = 1 order by newId()`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.SystemJobs*/
    getSystemJob(systemJobTypeId) {
        var dbCommand = `select top 1 * from SystemJobs where jobTypeId = '` + systemJobTypeId + `'` + ` order by id desc`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    getSystemJobId(systemJobId) {
        var dbCommand = `select top 1 * from SystemJobs where id = '` + systemJobId + `'` + ` order by id desc`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }

    /*dbo.Transactions*/
    getTransactionByApiId(apiId) {
        var dbCommand = `select * from transactions where apiId = '` + apiId + `'`;
        return cy.sqlServer(dbCommand).then((result) => {
            return result
        })
    }
}

export default databaseCommands