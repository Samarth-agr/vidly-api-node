const express = require("express");
const { User, validate } = require("../models/user"); // Correct import
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body); // Destructure `error` from the result of `validate`
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // Create a new user
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Save the user in the database
  await user.save();

  // Generate an auth token for the new user
  const token = user.generateAuthToken();

  // Send the response with the token in the header
  res
    .header("x-auth-token", token)
    .send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
});

module.exports = router;
