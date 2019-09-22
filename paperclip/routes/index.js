const router = require("express").Router();
const { User, Repo } = require("../models");
const jwt = require("jsonwebtoken");
var Octokit = require("@octokit/rest");
router.post("/login", async (req, res) => {
  var octokit = new Octokit({
    debug: true,
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "",
    auth: {
      type: "basic",
      username: req.body.username,
      password: req.body.password
    }
  });

  const authUser = await octokit.users.getAuthenticated().catch(error => {
    res.status(error.status).json({ error: error.headers.status });
  });

  if (authUser) {
    const user = {
      username: authUser.data.login,
      email: authUser.data.email,
      github_id: authUser.data.id
    };
    let existingUser = await User.findOne({
      where: { github_id: user.github_id }
    });
    if (!existingUser) {
      existingUser = await User.create(user);
    }
    const token = jwt.sign(
      {
        user: user.github_id
      },
      process.env.TOKEN_KEY,
      { expiresIn: 60 * 60 }
    );
    await Repo.destroy({
      where: {
        user_id: existingUser.id
      }
    });
    const fetchedRepos = await octokit.repos.list();
    const repos = fetchedRepos.data.map(
      ({
        name,
        full_name,
        private,
        owner: { login },
        permissions,
        html_url
      }) => ({
        user_id: existingUser.id,
        name,
        fullname: full_name,
        private,
        owner: login,
        url: html_url,
        permissions: Object.keys(permissions).reduce(
          (acc, perms) => [...(permissions[perms] ? [perms, ...acc] : acc)],
          []
        )
      })
    );
    Repo.bulkCreate(repos);
    res.send(200).json({ user, token });
  }
});

router.get("/repos", async (req, res) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoyNDg0NDk1NSwiaWF0IjoxNTY5MTUxODAzLCJleHAiOjE1NjkxNTU0MDN9.DrZnrQnU7ZXb4tPKQOTsue5e3m16ao8P3RQIq2qZMvI";
  //   const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token.replace("Bearer ", ""),
      process.env.TOKEN_KEY,
      async (err, result) => {
        const { user: user_gh_id } = result;
        if (err) {
          res.status(422).json({ err });
        } else {
          const user = await User.findOne({ where: { github_id: user_gh_id } });
          if (user) {
            const repos = await Repo.findAll({ where: { user_id: user.id } });
            res.status(200).json({ repos });
          } else {
            res.status(422).json({ error: "User not found" });
          }
        }
      }
    );
  }
});

module.exports = router;
