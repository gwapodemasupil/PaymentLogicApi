/// <reference types="cypress" />

import commonFunctions from "./commonFunctions";

const cf = new commonFunctions

class commonChecking {

    invokeTargetApiEndpoint(method, apiEndpoint) {
        //Invoke Target endpoint using a null credentials
        cy.invokeAmexApi(null, null, method, apiEndpoint).then((apiResponse) => {
            this.responseBodyCheckForInvalidCredentials(apiResponse);
        })

        //Invoke Target endpoint using an invalid credentials
        cy.invokeAmexApi(cf.generateRandomString(7), cf.generateRandomString(7), method, apiEndpoint).then((apiResponse) => {
            this.responseBodyCheckForInvalidCredentials(apiResponse);
        })
    }

    /*Checking the response status and body for invalid credentials */
    responseBodyCheckForInvalidCredentials(apiResponse) {
        expect(apiResponse.status).to.equal(401)
        expect(apiResponse.body[0].errorCode).to.equal('104000')
        expect(apiResponse.body[0].errorDescription).to.equal('unauthorized')
        expect(apiResponse.body[0].errorType).to.equal('unauthorized_operation')
    }


}

export default commonChecking