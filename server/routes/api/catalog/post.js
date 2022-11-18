const express = require('express');
const checkAuth = require('../../../utils/checkAuth');
const router = express.Router();

router.post('/', checkAuth, async (request, response) => {
  try {
    const user = await modelUser.findById(request.userId)
    if (!user) {
      return response.status(400).send({
        message: "Пользователь не найден"
      })
    }
    const { password, ...userData } = user._doc
    response.json(userData)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})