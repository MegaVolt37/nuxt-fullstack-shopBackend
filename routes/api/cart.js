const express = require('express');
const checkAuth = require('../../utils/checkAuth');
const { CartCreateValidation } = require('../../validations/validation');
const modelProduct = require('../../models/Product');
const modelCart = require('../../models/Cart');
const router = express.Router();



router.post('/add/:id', checkAuth, CartCreateValidation, async (request, response) => {
  try {
    const product = await modelProduct.findById(request.params.id)
    console.log(product)
    const doc = new modelCart({
      name: product.name,
      price: product.price,
      priceStock: product.priceStock,
      discount: product.discount,
      stock: product.stock,
      countStorage: product.countStorage,
      countCart: request.body.count,
      image: product.image,
      supplier: product.supplier,
    });
    const post = await doc.save();
    response.json(post)
  } catch (error) {
    if (error.code == 11000) {
      response.status(400).json({
        message: "Данный товар уже добавлен в корзину"
      })
    } else {
      console.log(error)
      response.status(500).json(error)
    }
  }

})
router.get('/', async (request, response) => {
  try {
    const cart = await modelCart.find().exec();
    response.json(cart)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.get('/news', async (request, response) => {
  try {
    const products = await modelProduct.find().sort({ createdAt: -1 }).limit(4).exec();
    response.json(products)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.get('/stock', async (request, response) => {
  try {
    const products = await modelProduct.find({ stock: { $exists: true } }).sort({ createdAt: -1 }).limit(4);
    response.json(products)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.get('/:id', async (request, response) => {
  try {
    const productId = await modelProduct.findById(request.params.id)
    if (!productId) {
      return response.status(400).send({
        message: "Товар не найден"
      })
    }
    response.json(productId)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.delete('/:id', checkAuth, async (request, response) => {
  try {
    const postId = request.params.id
    modelProduct.findOneAndDelete({
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
    await modelProduct.updateOne({
      _id: postId
    }, {
      title: request.body.title,
      text: request.body.text,
      image: request.file.path,
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