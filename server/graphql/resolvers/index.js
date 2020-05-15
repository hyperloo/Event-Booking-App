const authResolver = require("./auth");
const bookingResolver = require("./booking");
const eventsResolver = require("./events");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
};

module.exports = rootResolver;
