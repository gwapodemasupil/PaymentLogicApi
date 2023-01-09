/// <reference types="cypress" />

import AmexApiCards from "../fixtures/AmexApiCards";
import AmexCardModule from "./modules/AmexCardModule";
import AmexApiMerchants from "../fixtures/AmexApiMerchants.js";
import AmexMerchantsModule from "./modules/AmexMerchantsModule";
import AmexApiPosConfig from "../fixtures/AmexApiPosConfig";
import AmexPosConfig from "./modules/AmexPosConfigModule";
import AmexApiPurchase from "../fixtures/AmexApiPurchase";
import AmexPurchaseModule from "./modules/AmexPurchaseModule";

const acm = new AmexCardModule
const amm = new AmexMerchantsModule
const card = new AmexApiCards
const merc = new AmexApiMerchants
const posCon = new AmexApiPosConfig
const apc = new AmexPosConfig
const aap = new AmexApiPurchase
const apm = new AmexPurchaseModule


describe('01_Amex API Card Module', () => {
    it('01-01 verify that it can successfully add Amex Card using a valid credentials', () => {
      const cardType = 'amex'
      const cards = card.Cards(cardType)
      acm.addAmexCard(cards, cardType);
    })

    it('01-02 verify that it cannot successfully add Amex Card using an invalid credentials', () => {
      const cardType = 'amex'
      const cards = card.Cards(cardType)
      acm.addAmexCardUsingInvalidCredentials(cards);
    })

    it('02-01 - verify that it can successfully update card token status to suspend and get its status', () => {
      const cardType = 'amex'
      const tokenStatus = 'suspend'
      const cards = card.Cards(cardType, tokenStatus);
      acm.addAmexCard(cards, cardType, true);
    })

    it('02-02 - verify that it can successfully update card token status to resume and get its status', () => {
      const cardType = 'amex'
      const tokenStatus = 'resume'
      const cards = card.Cards(cardType, tokenStatus);
      acm.addAmexCard(cards, cardType, true);
    })

    it('02-03 - verify that it can successfully update card token status to delete and get its status', () => {
      const cardType = 'amex'
      const tokenStatus = 'delete'
      const cards = card.Cards(cardType, tokenStatus);
      acm.addAmexCard(cards, cardType, true);
    })

    it('02-04 - verify that it cannot successfully update card token status using an invalid credentials', () => {
      const tokenStatus = 'suspend'
      acm.updateAmexCardUsingInvalidCredentials(tokenStatus);
    })

    it('03-01 - verify that it can succesfully get card metadata using a valid credentials', () => {
      const cardType = 'amex'
      const cards = card.Cards(cardType);
      acm.addAmexCard(cards, cardType, false, true);
    })

    it('03-02 - verify that it cannot successfully get card metada using an invalid credentials', () => {
      const method = 'GET'
      acm.accessCardStatusUsingInvalidCredentials(method, false);
    })

    it('04-01 - verify that it cannot successfully get card status using an invalid credentials', () => {
      const method = 'GET'
      acm.accessCardStatusUsingInvalidCredentials(method, true);
    })
})

describe('02_Amex API Merchant Module', () => {
    it('01-01 - verify that it can successfully add Merchant using a valid credentials', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants);
    })

    it('01-02 - verify that it cannot successfully add Merchant using an invalid credentials', () => {
      const merchants = merc.Merchants();
      amm.addMerchantUsingInvalidCredentials(merchants);
    })

    it('02-01 - verify that it can successfully update Merchant using a valid credentials', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants, true);
    })

    it('02-02 - verify that it cannot successfully update Merchant using an invalid credentials', () => {
      const merchants = merc.Merchants();
      amm.addMerchantUsingInvalidCredentials(merchants, true);
    })

    it('03-01 - verify that it can successfully get Merchant using a valid credentials', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants, false, true);
    })

    it('03-02 - verify that it cannot successfully get Merchant using an invalid credentials', () => {
      const method = 'GET';
      amm.accessMerchantUsingInvalidCredentials(method);
    })

    it('04-01 - verify that it can successfully delete Merchant using a valid credentials', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants, false, false, true);
    })

    it('04-02 - verify that it cannot successfully delete Merchant using an invalid credentials', () => {
      const method = 'DELETE';
      amm.accessMerchantUsingInvalidCredentials(method);
    })
})

describe('03_AMEX API Pos Config Module', () => {
    it('01-01 - verify that it can successfully add pos config using valid credentials', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig)
    })

    it('01-02 - verify that it cannot successfully add pos config using invalid credentials', () => {
      const posConfig = posCon.PosConfig();
      apc.addPosConfigUsingInvalidCredentials(posConfig)
    })

    it('02-01 - verify that it can successfully update pos config using valid credentials', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig, true)
    })

    it('02-02 - verify that it cannot successfully update pos config using an invalid credentials', () => {
      const posConfig = posCon.PosConfig();
      apc.addPosConfigUsingInvalidCredentials(posConfig, true)
    })

    it('03-01 - verify that it can successfully get pos config using valid credentials', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig, false, true)
    })

    it('03-02 - verify that it cannot successfully get pos config using an invalid credentials', () => {
      const method = 'GET';
      apc.accessPosConfigUsingInvalidCredentials(method)
    })

    it('04-01 - verify that it can successfully delete pos config using valid credentials', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig, false, false, true)
    })

    it('04-02 - verify that it can successfully delete pos config using invalid credentials', () => {
      const method = 'DELETE';
      apc.accessPosConfigUsingInvalidCredentials(method)
    })
})

describe.skip('04_AMEX API Purchase Module', () => {
    it('01 - verify that it can successfully perform payment', () => {
      const cardType = 'amex'
      const purchaseDetails = aap.Purchase(cardType);
      apm.amexPurchase(purchaseDetails);
    })
})