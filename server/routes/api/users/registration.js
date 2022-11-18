const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const expressValidator = require('express-validator');
const { registerValidation } = require('../../../validations/validation');
const modelUser = require('../../../models/User');
const router = express.Router();





router.post('/', registerValidation, async (request, response) => {
  try {
    const error = expressValidator.validationResult(request);
    if (!error.isEmpty()) {
      return response.status(400).json(error.array())
    }
    const passHash = request.body.password
    // Шифрование пароля
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passHash, salt)
    //
    const doc = new modelUser({
      email: request.body.email,
      fullName: request.body.fullName,
      password: passwordHash,
      avatarUrl: request.body.avatarUrl,
    })

    const User = await doc.save();
    const token = jwt.sign({
      _id: User._id
    }, 'secret', {
      expiresIn: '1d'
    })
    const { password, ...userData } = User._doc
    response.json({
      ...userData,
      token
    })
  } catch (e) {
    console.log(e)
    if (e.code == 11000) {
      response.status(400).json({
        message: "Данный email уже существует"
      })
    } else {
      response.status(500).json(e)
    }
  }
})


module.exports = router;