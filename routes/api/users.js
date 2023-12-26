const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const router = express.Router();

router.post(
  '/',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Email is not a valid email').isEmail(),
    body('password', 'Password should be at least 4 characters').isLength({
      min: 4
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist.' }] });

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        avatar,
        password: hashedPassword
      });

      await user.save();

      res.send('User registered');
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
