const axios = require("axios");
const Dev = require("../models/dev.js");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, longitude, latitude } = req.body;
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const githubResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = githubResponse.data;

      const techsArray = techs.split(",").map(tech => tech.trim());

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      });
      return res.json(dev);
    }
  }
};
