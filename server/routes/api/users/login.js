const express = require('express');
const jwt = require('jsonwebtoken');
const modelUser = require('../../../models/User');
const { loginValidation } = require('../../../validations/validation');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/', loginValidation, async (request, response) => {
  try {
    const user = await modelUser.findOne({ email: request.body.email });
    if (!user) {
      return response.status(401).json({
        message: "Логин или пароль не найден"
      })
    }
    const isValidPass = await bcrypt.compare(request.body.password, user._doc.password)
    if (!isValidPass) {
      return response.status(401).json({
        message: "Логин или пароль не найден"
      })
    }
    const token = jwt.sign({
      _id: user._id
    }, 'secret', {
      expiresIn: '1d'
    })
    const { password, ...userData } = user._doc
    response.json({
      ...userData,
      token
    })
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})


module.exports = router;