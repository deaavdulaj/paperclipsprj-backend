const Sequelize = require("sequelize");
const connection = require("../init/db");
const Model = Sequelize.Model;

class Repo extends Model {}
Repo.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    private: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    owner: {
      type: Sequelize.STRING,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    permissions: {
      type: Sequelize.JSON,
      allowNull: false
    }
  },
  {
    sequelize: connection,
    modelName: "repo"
  }
);

module.exports = Repo;
