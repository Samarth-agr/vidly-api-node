const express = require("express");
const { User, validate } = require("../models/user"); // Correct import
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  // Validate request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the email is already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // 🔹 Ensure username is included
  user = new User({
    username: req.body.username, // FIXED: Add username
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Save the user
  await user.save();

  // Generate auth token
  const token = user.generateAuthToken();

  // Send response with the token
  res
    .header("x-auth-token", token)
    .send({
      _id: user._id,
      username: user.username, // FIXED: Send username
      name: user.name,
      email: user.email
    });
});


module.exports = router;
