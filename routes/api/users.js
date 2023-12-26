const bcrypt = require('bcryptjs');
const config = require('config');
const express = require('express');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

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

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
