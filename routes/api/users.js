const express = require('express');
const { body, validationResult } = require('express-validator');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    res.send('User routes');
  }
);

module.exports = router;
