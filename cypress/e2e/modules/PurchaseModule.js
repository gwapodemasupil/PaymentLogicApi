import commonChecking from "../../common/commonChecking"
import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"

const cc = new commonChecking
const cf = new commonFunctions
const dc = new databaseCommands

class PurchaseModule {
    purchase(purchaseDetails) {
        let apiCredentialsId = '';
        let posConfigApiId = '';
        let merchantConfigApiId = '';
        let transactionApiId = '';
        let transactionId = '';

        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;
            
            dc.getRandomAmexApiPosConfig().then((posConfigResult) => {
                posConfigApiId = posConfigResult[0][15].value;

                dc.getRandomAmexApiMerchantConfig().then((merchConfigResult) => {
                    merchantConfigApiId = merchConfigResult[0][7].value;

                    cy.invokePurchaseEndpoint(credentials, purchaseDetails, posConfigApiId, merchantConfigApiId).then((apiResponse) => {
                        transactionApiId = apiResponse.body.transactionId;
                        cc.checkResponseBodyStatus(apiResponse);
                        this.checkResponseBodyPurchase(apiResponse);

                        dc.getTransactionByApiId(transactionApiId).then((dbTransaction) => {
                        //dc.getTransactionByApiId().then((dbTransaction) => {
                            transactionId = dbTransaction[0][0].value;
                            this.dbCheckTransactions(dbTransaction, purchaseDetails, apiCredentialsId);

                            dc.getGcagAuthorisationsByTransactionId(transactionId).then((dbGcagAuthorisation) => {
                                this.dbCheckGcagAuthorisations(dbGcagAuthorisation, purchaseDetails, posConfigResult, merchConfigResult)
                            })
                        })
                    })
                })
            })
        })
    }

    checkResponseBodyPurchase(apiResponse) {
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

    dbCheckGcagAuthorisations(dbResponse, purchaseDetails, posConfigResult, merchConfigResult) {
        assert.equal((dbResponse[0][5].value), purchaseDetails.amount.replace('.', ''), 'AmountTransaction checking')
        assert.equal((dbResponse[0][11].value), posConfigResult[0][3].value, 'Pos_CardAuthentication checking')
        assert.equal((dbResponse[0][12].value), posConfigResult[0][4].value, 'Pos_CardCapture checking')
        assert.equal((dbResponse[0][13].value), posConfigResult[0][2].value, 'Pos_CardDataInput checking')
        assert.equal((dbResponse[0][14].value), posConfigResult[0][8].value, 'Pos_CardDataInputMode checking')
        assert.equal((dbResponse[0][15].value), posConfigResult[0][11].value, 'Pos_CardDataOutput checking')
        assert.equal((dbResponse[0][16].value), posConfigResult[0][6].value, 'Pos_CardholderPresent checking')
        assert.equal((dbResponse[0][17].value), posConfigResult[0][10].value, 'Pos_CardMemberIdentityEntity checking')
        assert.equal((dbResponse[0][18].value), posConfigResult[0][9].value, 'Pos_CardMemberIdentityMethod checking')
        assert.equal((dbResponse[0][19].value), posConfigResult[0][7].value, 'Pos_CardPresent checking')
        assert.equal((dbResponse[0][20].value), posConfigResult[0][5].value, 'Pos_OperatingEnvironment checking')
        assert.equal((dbResponse[0][21].value), posConfigResult[0][13].value, 'Pos_PinCapture checking')
        assert.equal((dbResponse[0][22].value), posConfigResult[0][12].value, 'Pos_TerminalOutput checking')
        assert.equal((dbResponse[0][24].value), merchConfigResult[0][1].value, 'CardAcceptorBusinessCode checking')
        assert.equal((dbResponse[0][27].value), purchaseDetails.cardAcceptorTerminalId, 'CardAcceptorTerminalId checking')
        assert.equal((dbResponse[0][28].value), merchConfigResult[0][2].value, 'CardAcceptorIdCode checking')
        //assert.equal((dbResponse[0][29].value), merchConfigResult[0][3].value, 'CardAcceptorName checking')
        assert.equal((dbResponse[0][37].value), true, 'IsProcessed checking')
        assert.equal((dbResponse[0][53].value), posConfigResult[0][0].value, 'AmexApiPosConfigId checking')
        assert.equal((dbResponse[0][54].value), merchConfigResult[0][0].value, 'AmexApiMerchantConfigId checking')
        assert.equal((dbResponse[0][56].value), merchConfigResult[0][4].value, 'CardAcceptorPhone checking')
        assert.equal((dbResponse[0][57].value), merchConfigResult[0][5].value, 'CardAcceptorEmail checking')
    }
}

export default PurchaseModule