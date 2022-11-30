import commonFunctions from "../../common/commonFunctions"
import databaseCommands from "../../common/databaseCommands"

const cf = new commonFunctions
const dc = new databaseCommands

class AmexPurchaseModule {
    amexPurchase(purchaseDetails) {
        let apiCredentialsId = '';
        let posConfigApiId = '';
        let merchantConfigApiId = '';

        dc.getRandomApiCredentials().then((credentials) => {
            apiCredentialsId = credentials[0][0].value;

            dc.getAmexApiRandomPosConfig().then((posConfigResult) => {
                posConfigApiId = posConfigResult[0][15].value;

                dc.getAmexApiRandomMerchantConfig().then((merchConfigResult) => {
                    merchantConfigApiId = merchConfigResult[0][7].value;

                    cy.invokeAmexPurchase(credentials, purchaseDetails, posConfigApiId, merchantConfigApiId).then((apiResponse) => {

                    })
                })
            })
        })
    }

    /*responseBodyCheckforPurchase(apiResponse, purchaseDetails) {
        expect(apiResponse.status).to.equal(200)
        expect(apiResponse.body.responseCode, purchaseDetails.responseCode, 'Response code checking');
        expect(apiResponse.body.amount, purchaseDetails.amount, 'Amount checking');
        expect(apiResponse.body.transactionId, , '');
        expect(apiResponse.body.transactionDateTime, , '');
        expect(apiResponse.body.settlementDate, , '');

    }*/
}

export default AmexPurchaseModule