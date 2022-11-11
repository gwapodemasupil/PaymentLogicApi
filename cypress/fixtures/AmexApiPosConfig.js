/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class AmexApiPosConfig {
    PosConfig() {
        var data = {
            description : 'AmexApiAddPosConfig_' + cf.generateRandomString(7),
            cardInputCapability : cf.generateCardInputCapability(),
            cardholderAuthCapability : cf.generateCardInputCapability(),
            cardCaptureCapability : cf.generateCardCaptureCapability(),
            operatingEnvironment : cf.generateOperatingEnvironment(),
            cardholderPresent : cf.generateCardholderPresent(),
            cardPresent: cf.generateCardPresent(),
            cardDataInputMode: cf.generateCardDataInputMode(),
            cardmemberAuthMethod: cf.generateCardmemberAuthMethod(),
            cardmemberAuthEntity: cf.generateCardmemberAuthEntity(),
            cardDataOutputCapability: cf.generateCardDataOutputCapability(),
            terminalOutputCapability: cf.generateTerminalOutputCapability(),
            pinCaptureCapability: cf.generatePinCaptureCapability()
        }
        return data
    }
}

export default AmexApiPosConfig