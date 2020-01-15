const Dev = require("../models/dev.js");

module.exports = {
  async index(req, res) {
    const { longitude, latitude, techs } = req.query;

    const techsArray = techs.split(",").map(tech => tech.trim());

    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    });

    return res.json(devs);
  }
};
