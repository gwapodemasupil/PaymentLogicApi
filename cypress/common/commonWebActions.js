/// <reference types="cypress" />
import resourcedata from "./resourceData";
const rd = new resourcedata

class commonWebActions {
    launchPaymentLogicPage() {
        this.openWebPage();
        this.loginWebPage(rd.plAdminUser, rd.plAdminPassword, rd.smsCode);
    }

    openWebPage() {
        cy.viewport(1920, 1280);
        cy.visit(Cypress.env('webBaseUrl'), {timeout: 10000})
    }

    loginWebPage(email, password, smsCode) {
        //Login Page
        cy.get(rd.inputFieldUserName).clear().type(email);
        cy.get(rd.inputFieldPassword).clear().type(password);
        cy.get(rd.buttonLogin).click();
        cy.wait(5000);

        //MFA Page
        cy.get(rd.textPaymentLogic).click();
        cy.get(rd.inputFieldSmsCode).type(smsCode);
        cy.get(rd.buttonSubmit).click();
        //cy.wait(10000);
    }


    processDataCaptureRequest() {
        this.goToSettlementBatchPage();
        this.processDailyAmexBatch();
    }

    goToSettlementBatchPage() {
        cy.wait(5000);
        cy.get(rd.textDailyBatches).click();
        cy.wait(2000);
        cy.get(rd.textSettlementBatches).click();
    }

    processDailyAmexBatch() {
        cy.wait(5000);
        cy.get(rd.buttonProcessDailyAmexBatch).click();
        cy.wait(3000);
        cy.get(rd.buttonProcessDailyAmexBatchYes).click()
    }
}

export default commonWebActions