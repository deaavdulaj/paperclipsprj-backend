const dbConnection = require("./db");
const initServer = require("./server");

module.exports = () => {
  initServer();
  return dbConnection;
};
