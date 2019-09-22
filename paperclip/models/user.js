const Sequelize = require("sequelize");
const connection = require("../init/db");
const Repo = require("./repo");
const Model = Sequelize.Model;

class User extends Model {}
User.init(
  {
    github_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize: connection,
    modelName: "user"
  }
);

User.hasMany(Repo, {
  foreignKey: "user_id"
});

module.exports = User;
