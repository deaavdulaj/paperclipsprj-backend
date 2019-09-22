const express = require("express");
const app = express();
const port = 3000;
const routes = require("../routes");
const cors = require("cors");

module.exports = () => {
  app
    .use(express.json())
    .use(cors())
    .use("/api", routes)
    .listen(port, () => console.log(`Example app listening on port 3000!`));
};
