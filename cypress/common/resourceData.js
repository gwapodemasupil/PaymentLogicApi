/// <reference types="cypress" />

class resourceData {

    plAdminUser = 'AutoUser1';
    plAdminPassword = 'test1234';
    smsCode = '999999';

    //Xpaths
    //Login Page
    inputFieldUserName = 'input[id="UserName"]';
    inputFieldPassword = 'input[id="Password"]';
    buttonLogin = 'button[class="btn btn-rounded btn-lg btn-primary btn-block"]';
    textPaymentLogic = 'div[class="navbar-brand large block m-t theme"]';
    inputFieldSmsCode = 'input[class="form-control text-center ng-pristine ng-valid ng-empty ng-valid-maxlength ng-touched"]';
    buttonSubmit = 'button[type="submit"]';

    //Payment Logic Page - Left menu
    textDailyBatches = 'i[title="Daily Batches"]';
    textSettlementBatches = 'a[href="#/settlementbatches"]';

    //Payment Logic Page - Daily Batches page
    buttonProcessDailyAmexBatch = 'button[class="btn-addon btn btn-wlth btn-success play ng-scope"]';
    buttonProcessDailyAmexBatchYes = 'button[class="btn btn-success btn-rounded"]'; 

    //Purchase
    incorrectSystemJobStatus = 'The System Job status is not set to Completed.';

}

export default resourceData