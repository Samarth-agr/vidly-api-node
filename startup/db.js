const mongoose = require('mongoose');
const fawn = require('fawn');

const db ='mongodb://localhost/vidly';

module.exports = function () {
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to ${db}...`);
      fawn.init(mongoose);
    })
    .catch((err) => {
      console.error('Could not connect to MongoDB...', err);
      process.exit(1);
    });
};
