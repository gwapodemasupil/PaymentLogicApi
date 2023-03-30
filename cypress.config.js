const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  taskTimeout: 10000,
  projectId: 'h48ogp',
  e2e: {
    setupNodeEvents(on, config) {
      tasks = sqlServer.loadDBPlugin(config.env.db)
      on('task', tasks);
      return tasks
    },
  },
  env: {
    baseUrl: "https://stage-amexapi.paymentlogic.com.au/",
    webBaseUrl: "https://stage-web.paymentlogic.com.au/",
    hostServices: "stage-amexapi.paymentlogic.com.au",
    db: {
      userName: "",
      password: "",
      server: "paymentlogic.database.windows.net",
      options: {
        database: "PaymentLogicSTG",
        encrypt: true,
        rowCollectionOnRequestCompletion : true
      }
    }
  },
  clientCertificates: [
    {
      url: 'https://stage-amexapi.paymentlogic.com.au',
      certs: [
        {
          pfx: 'cypress/certificates/AMEX-CLIENT-CERT-STAGING.pfx',
          passphrase: 'cypress/certificates/password.txt'
        },
      ]
    },
  ]
});
