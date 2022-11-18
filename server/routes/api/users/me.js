const express = require('express');
const jwt = require('jsonwebtoken');
const modelUser = require('../../../models/User');
const checkAuth = require('../../../utils/checkAuth');
const bcrypt = require('bcrypt');
const router = express.Router();



router.get('/', checkAuth, async (request, response) => {
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
// router.post('/', async (request, response) => {
//   try {
//     const user = await modelUser.findOne({ email: request.body.email });
//     if (!user) {
//       return response.status(401).json({
//         message: "Логин или пароль не найден"
//       })
//     }
//     const isValidPass = await bcrypt.compare(request.body.password, user._doc.password)
//     if (!isValidPass) {
//       return response.status(401).json({
//         message: "Логин или пароль не найден"
//       })
//     }
//     const token = jwt.sign({
//       _id: user._id
//     }, 'secret', {
//       expiresIn: '1d'
//     })
//     const { password, ...userData } = user._doc
//     response.json({
//       ...userData,
//       token
//     })
//   } catch (error) {
//     console.log(error)
//     response.status(500).json(error)
//   }
// })


module.exports = router;