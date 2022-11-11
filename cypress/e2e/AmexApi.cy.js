/// <reference types="cypress" />

import AmexApiCards from "../fixtures/AmexApiCards";
import AmexCardModule from "./modules/AmexCardModule";
import AmexApiMerchants from "../fixtures/AmexApiMerchants.js";
import AmexMerchantsModule from "./modules/AmexMerchantsModule";
import AmexApiPosConfig from "../fixtures/AmexApiPosConfig";
import AmexPosConfig from "./modules/AmexPosConfigModule";

const acm = new AmexCardModule
const amm = new AmexMerchantsModule
const card = new AmexApiCards
const merc = new AmexApiMerchants
const posCon = new AmexApiPosConfig
const apc = new AmexPosConfig


describe('01_Amex API Card Module', () => {
    it('01 - verify that it can successfully add Amex Card', () => {
      const cardType = 'amex'
      const cards = card.Cards(cardType);
      acm.addAmexCard(cards, cardType);
    })

    it.only('02 - can update card', () => {
      const cardType = 'amex'
      const cards = card.Cards(cardType);
      acm.addAmexCard(cards, cardType, true);
    })

    it('03 - can get card status', () => {
      
    })

    it('04 - can get card metadata', () => {
      
    })
})

describe('02_Amex API Merchant Module', () => {
    it('01 - verify that it can successfully add Merchant', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants);
    })

    it('02 - verify that it can successfully update Merchant', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants, true);
    })

    it('03 - verify that it can successfully get Merchant', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants, false, true);
    })

    it('04 - verify that it can successfully delete Merchant', () => {
      const merchants = merc.Merchants();
      amm.addAmexMerchant(merchants, false, false, true);
    })
})

describe('03_AMEX API Pos Config Module', () => {
    it('01 - verify that it can successfully add pos config', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig)
    })

    it('02 - verify that it can successfully update pos config', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig, true)
    })

    it('03 - verify that it can successfully get pos config', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig, false, true)
    })

    it('04 - verify that it can successfully delete pos config', () => {
      const posConfig = posCon.PosConfig();
      apc.addAmexPosConfig(posConfig, false, false, true)
    })
})