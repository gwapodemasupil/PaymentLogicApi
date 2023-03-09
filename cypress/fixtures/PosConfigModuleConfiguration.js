/// <reference types="cypress" />

import commonFunctions from "../common/commonFunctions"

const cf = new commonFunctions

class PosConfigModuleConfiguration {
    PosConfig() {
        var data = {
            description : 'ApiPosConfig_' + cf.generateRandomString(7),
            cardInputCapability : cf.generateCardInputCapability(),
            cardholderAuthCapability : cf.generateCardInputCapability(),
            cardCaptureCapability : cf.generateCardCaptureCapability(),
            operatingEnvironment : cf.generateOperatingEnvironment(),
            cardholderPresent : cf.generateCardholderPresent(),
            cardPresent: cf.generateCardPresent(),
            cardDataInputMode: cf.generateCardDataInputMode(),
            cardMemberAuthMethod: cf.generateCardMemberAuthMethod(),
            cardMemberAuthEntity: cf.generateCardMemberAuthEntity(),
            cardDataOutputCapability: cf.generateCardDataOutputCapability(),
            terminalOutputCapability: cf.generateTerminalOutputCapability(),
            pinCaptureCapability: cf.generatePinCaptureCapability()
        }
        return data
    }
}

export default PosConfigModuleConfiguration