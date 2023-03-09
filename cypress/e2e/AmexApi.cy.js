/// <reference types="cypress" />

/*Modules*/
import CardModule from "./modules/CardModule"
import MerchantModule from "./modules/MerchantModule"
import PosConfigModule from "./modules/PosConfigModule"
import PurchaseModule from "./modules/PurchaseModule"

/*Fixtures*/
import CardModuleConfiguration from "../fixtures/CardModuleConfiguration"
import MerchantModuleConfiguration from "../fixtures/MerchantModuleConfiguration"
import PosConfigModuleConfiguration from "../fixtures/PosConfigModuleConfiguration"
import PurchaseModuleConfiguration from "../fixtures/PurchaseModuleConfiguration"

/*Common*/
import commonWebActions from "../common/commonWebActions"
import databaseCommands from "../common/databaseCommands"

const cardModule = new CardModule
const cardModuleConfig = new CardModuleConfiguration
const merchantModule = new MerchantModule
const merchantModuleConfig = new MerchantModuleConfiguration
const posConfigModule = new PosConfigModule
const posConfigModuleConfiguration = new PosConfigModuleConfiguration
const purchaseModule = new PurchaseModule
const purchaseModuleConfiguration = new PurchaseModuleConfiguration
const cwa = new commonWebActions
const dc = new databaseCommands

describe('01_Amex API Card Module', () => {
    it('01-01 verify that it can successfully add Amex Card using a valid credentials', () => {
      const cardType = 'amex'
      const cards = cardModuleConfig.Cards(cardType)
      cardModule.addCard(cards, cardType);
    })

    it('01-02 verify that it cannot add Amex Card using an invalid credentials', () => {
      const cardType = 'amex'
      const cards = cardModuleConfig.Cards(cardType)
      cardModule.addCardUsingInvalidCredentials(cards);
    })

    it('02-01 - verify that it can successfully update card token status to suspend and get its status', () => {
      const cardType = 'amex'
      const tokenStatus = 'suspend'
      const cards = cardModuleConfig.Cards(cardType, tokenStatus);
      cardModule.addCard(cards, cardType, true);
    })

    it('02-02 - verify that it can successfully update card token status to resume and get its status', () => {
      const cardType = 'amex'
      const tokenStatus = 'resume'
      const cards = cardModuleConfig.Cards(cardType, tokenStatus);
      cardModule.addCard(cards, cardType, true);
    })

    it('02-03 - verify that it can successfully update card token status to delete and get its status', () => {
      const cardType = 'amex'
      const tokenStatus = 'delete'
      const cards = cardModuleConfig.Cards(cardType, tokenStatus);
      cardModule.addCard(cards, cardType, true);
    })

    it('02-04 - verify that it cannot update card token status using an invalid credentials', () => {
      const tokenStatus = 'suspend'
      cardModule.updateCardUsingInvalidCredentials(tokenStatus);
    })

    it('03-01 - verify that it can successfully get card metadata using a valid credentials', () => {
      const cardType = 'amex'
      const cards = cardModuleConfig.Cards(cardType);
      cardModule.addCard(cards, cardType, false, true);
    })

    it('03-02 - verify that it cannot get card metada using an invalid credentials', () => {
      const method = 'GET'
      cardModule.accessCardStatusUsingInvalidCredentials(method, false);
    })

    it('04-01 - verify that it cannot get card status using an invalid credentials', () => {
      const method = 'GET'
      cardModule.accessCardStatusUsingInvalidCredentials(method, true);
    })
})

describe('02_Amex API Merchant Module', () => {
    it('01-01 - verify that it can successfully add Merchant using a valid credentials', () => {
      dc.getRandomMerchant().then((dbResult) => {
        const merchant = merchantModuleConfig.Merchants(dbResult[0][2].value);
        merchantModule.addMerchant(merchant);
      })
    })

    it('01-02 - verify that it cannot add Merchant using an invalid credentials', () => {
      dc.getRandomMerchant().then((dbResult) => {
        const merchant = merchantModuleConfig.Merchants(dbResult[0][2].value);
        merchantModule.addMerchantUsingInvalidCredentials(merchant);
      })
    })

    it('02-01 - verify that it can successfully update Merchant using a valid credentials', () => {
      dc.getRandomMerchant().then((dbResult) => {
        const merchant = merchantModuleConfig.Merchants(dbResult[0][2].value);
        merchantModule.addMerchant(merchant, true);
      })
    })

    it('02-02 - verify that it cannot update Merchant using an invalid credentials', () => {
      dc.getRandomMerchant().then((dbResult) => {
        const merchant = merchantModuleConfig.Merchants(dbResult[0][2].value);
        merchantModule.addMerchantUsingInvalidCredentials(merchant, true);
      })
    })

    it('03-01 - verify that it can successfully get Merchant using a valid credentials', () => {
      dc.getRandomMerchant().then((dbResult) => {
        const merchant = merchantModuleConfig.Merchants(dbResult[0][2].value);
        merchantModule.addMerchant(merchant, false, true);
      })
    })

    it('03-02 - verify that it cannot get Merchant using an invalid credentials', () => {
      const method = 'GET';
      merchantModule.accessMerchantUsingInvalidCredentials(method);
    })

    it('04-01 - verify that it can successfully delete Merchant using a valid credentials', () => {
      dc.getRandomMerchant().then((dbResult) => {
        const merchant = merchantModuleConfig.Merchants(dbResult[0][2].value);
        merchantModule.addMerchant(merchant, false, false, true);
      })
    })

    it('04-02 - verify that it cannot delete Merchant using an invalid credentials', () => {
      const method = 'DELETE';
      merchantModule.accessMerchantUsingInvalidCredentials(method);
    })
})

describe('03_AMEX API Pos Config Module', () => {
    it('01-01 - verify that it can successfully add pos config using valid credentials', () => {
      const posConfig = posConfigModuleConfiguration.PosConfig();
      posConfigModule.addPosConfig(posConfig)
    })

    it('01-02 - verify that it cannot add pos config using invalid credentials', () => {
      const posConfig = posConfigModuleConfiguration.PosConfig();
      posConfigModule.addPosConfigUsingInvalidCredentials(posConfig)
    })

    it('02-01 - verify that it can successfully update pos config using valid credentials', () => {
      const posConfig = posConfigModuleConfiguration.PosConfig();
      posConfigModule.addPosConfig(posConfig, true)
    })

    it('02-02 - verify that it cannot update pos config using an invalid credentials', () => {
      const posConfig = posConfigModuleConfiguration.PosConfig();
      posConfigModule.addPosConfigUsingInvalidCredentials(posConfig, true)
    })

    it('03-01 - verify that it can successfully get pos config using valid credentials', () => {
      const posConfig = posConfigModuleConfiguration.PosConfig();
      posConfigModule.addPosConfig(posConfig, false, true)
    })

    it('03-02 - verify that it cannot get pos config using an invalid credentials', () => {
      const method = 'GET';
      posConfigModule.accessPosConfigUsingInvalidCredentials(method)
    })

    it('04-01 - verify that it can successfully delete pos config using valid credentials', () => {
      const posConfig = posConfigModuleConfiguration.PosConfig();
      posConfigModule.addPosConfig(posConfig, false, false, true)
    })

    it('04-02 - verify that it can successfully delete pos config using invalid credentials', () => {
      const method = 'DELETE';
      posConfigModule.accessPosConfigUsingInvalidCredentials(method)
    })
})

describe('04_AMEX API Purchase Module', () => {
    it('01-01 verify that it can successfully perform payment', () => {
      const cardType = 'amex'
      const purchaseDetails = purchaseModuleConfiguration.Purchase(cardType);
      cwa.launchPaymentLogicPage();
      purchaseModule.purchase(purchaseDetails);
    })

    it('01-02 - verify that it cannot perform payment', () => {
      const cardType = 'amex'
      const purchaseDetails = purchaseModuleConfiguration.Purchase(cardType);
      purchaseModule.invokePurchaseEndpointUsingInvalidCredentials(purchaseDetails);
    })

})