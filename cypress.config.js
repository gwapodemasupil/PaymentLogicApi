const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      tasks = sqlServer.loadDBPlugin(config.env.db)
      on('task', tasks);
      return tasks
    },
  },
  env: {
    baseUrl: "https://stage-services.paymentlogic.com.au/amex/",
    hostServices: "stage-services.paymentlogic.com.au",
    db: {
      userName: "sql_Arvin",
      password: "ONU0ZyLGbsAGqxR",
      server: "paymentlogic.database.windows.net",
      options: {
        database: "PaymentLogicSTG",
        encrypt: true,
        rowCollectionOnRequestCompletion : true
      }
    }
  },
});
