import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"

const cf = new commonFunctions
const dc = new databaseCommands

class AmexPurchaseModule {
    amexPurchase(purchaseDetails) {
        let apiCredentialsId = '';
        let posConfigApiId = '';
        let merchantConfigApiId = '';
        //let transactionApiId = '';
        let transactionId = '';

        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;
            

            dc.getAmexApiRandomPosConfig().then((posConfigResult) => {
                posConfigApiId = posConfigResult[0][15].value;

                dc.getAmexApiRandomMerchantConfig().then((merchConfigResult) => {
                    merchantConfigApiId = merchConfigResult[0][7].value;

                    cy.invokeAmexPurchase(credentials, purchaseDetails, posConfigApiId, merchantConfigApiId).then((apiResponse) => {
                        //transactionApiId = apiResponse.body.transactionId;
                        this.responseBodyCheckforPurchase(apiResponse);

                        //dc.getTransactionByApiId(transactionApiId).then((dbTransaction) => {
                        dc.getTransactionByApiId().then((dbTransaction) => {
                            transactionId = dbTransaction[0][0].value;
                            this.dbCheckTransactions(dbTransaction, purchaseDetails, apiCredentialsId);
                        })
                    })
                })
            })
        })
    }

    responseBodyCheckforPurchase(apiResponse) {
        expect(apiResponse.status).to.equal(200)
        expect(apiResponse.body).to.have.property('responseCode')
        expect(apiResponse.body).to.have.property('amount')
        expect(apiResponse.body).to.have.property('transactionId')
        expect(apiResponse.body).to.have.property('transactionDateTime')
        expect(apiResponse.body).to.have.property('settlementDate')

    }

    dbCheckTransactions(dbResponse, purchaseDetails, apiCredentialsId) {
        assert.equal((dbResponse[0][1].value), null, 'CardDetailId checking')
        assert.equal((dbResponse[0][2].value), null, 'SettlementBatchId checking')
        assert.equal((dbResponse[0][3].value).slice(0, 10), purchaseDetails.getAuthorisationDate, 'AuthorisationDate checking')
        assert.equal((dbResponse[0][4].value), purchaseDetails.amount, 'Amount checking')
        assert.equal((dbResponse[0][5].value), null, 'Description checking')
        assert.equal((dbResponse[0][6].value), true, 'IsApproved checking')
        assert.equal((dbResponse[0][23].value).slice(0, 10), purchaseDetails.getwaySettlementDate, 'GatewaySettlementDate checking')
        assert.equal((dbResponse[0][24].value), true, 'IsAuthorised checking')
        assert.equal((dbResponse[0][28].value), null, 'ParentTransactionId checking')
        assert.equal((dbResponse[0][30].value), 'AUD', 'CurrencyCode checking')
        assert.equal((dbResponse[0][46].value), 'Approved', 'Status checking')
        assert.equal((dbResponse[0][50].value).slice(0, 10), purchaseDetails.getAuthorisationDate, 'AuthorisationProcessingDate checking')
        assert.equal((dbResponse[0][52].value), apiCredentialsId, 'ApiCredentialsId checking')
    }

    dbCheckGcagAuthorisations(dbResponse, posConfigResult) {

    }
}

export default AmexPurchaseModule