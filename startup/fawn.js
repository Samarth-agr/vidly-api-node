// startup/fawn.js
// @ts-ignore
const fawn = require('fawn');
module.exports = function (mongoose) {
  fawn.init(mongoose);
};
