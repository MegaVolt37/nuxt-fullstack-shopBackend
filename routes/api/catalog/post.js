const express = require('express');
const checkAuth = require('../../../utils/checkAuth');
const { PostCreateValidation } = require('../../../validations/validation');
const modelPost = require('../../../models/Post');
const router = express.Router();

router.post('/', checkAuth, PostCreateValidation, async (request, response) => {
  try {
    const doc = new modelPost({
      title: request.body.title,
      text: request.body.text,
      imageUrl: request.body.imageUrl,
      author: request.userId
    });
    const post = await doc.save();
    response.json(post)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }

})
// ЗДесь пофиксить отдачу пароля пользователю
router.get('/', async (request, response) => {
  try {
    const posts = await modelPost.find().populate('author').exec();
    response.json(posts)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.get('/:id', async (request, response) => {
  try {
    const postId = request.params.id
    modelPost.findOneAndUpdate({
      _id: postId
    }, {
      $inc: {
        viewsCount: 1
      }
    }, {
      returnDocument: "after",

    }, (err, doc) => {
      if (err) {
        console.log(err)
        return response.status(500).json(err)
      }
      if (!doc) {
        return response.status(404).json({
          message: "Статья не найдена"
        })
      }
      response.json(doc)
    })
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.delete('/:id', checkAuth, async (request, response) => {
  try {
    const postId = request.params.id
    modelPost.findOneAndDelete({
      _id: postId
    }, (err, doc) => {
      if (err) {
        console.log(err)
        return response.status(500).json(err)
      }
      if (!doc) {
        return response.status(404).json({
          message: "Статья не найдена"
        })
      }
      response.json({
        success: true
      })
    })
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.patch('/:id', checkAuth, async (request, response) => {
  try {
    const postId = request.params.id
    await modelPost.updateOne({
      _id: postId
    }, {
      title: request.body.title,
      text: request.body.text,
      imageUrl: request.body.imageUrl,
      author: request.userId
    })
    response.json({
      success: true
    })
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
module.exports = router;