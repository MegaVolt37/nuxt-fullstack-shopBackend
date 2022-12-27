const express = require('express');
const checkAuth = require('../../utils/checkAuth');
const { CartCreateValidation } = require('../../validations/validation');
const modelProduct = require('../../models/Product');
const modelCart = require('../../models/Cart');
const router = express.Router();



router.post('/add/:id', checkAuth, CartCreateValidation, async (request, response) => {
  try {
    const product = await modelProduct.findById(request.params.id)
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
// Получение всех товаров в корзине
router.get('/', checkAuth, async (request, response) => {
  try {
    const cart = await modelCart.find().exec();
    response.json(cart)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
// Количество товаров в корзине
router.get('/count', checkAuth, async (request, response) => {
  try {
    const cart = await modelCart.find().count();
    response.json(cart)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
router.delete('/:id', checkAuth, async (request, response) => {
  try {
    const productId = request.params.id
    modelCart.findOneAndDelete({
      _id: productId
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
// Нажатие на кнопку оформить заказ на фронте => переход в стадию оформления заказа
router.post('/order', checkAuth, async (request, response) => { 
  try {
    let arrId = [];
    request.body.forEach(element => {
      arrId.push(element.id)
    });
    const resDel = await modelCart.deleteMany({ _id: { $in: arrId } })
    if (resDel.deletedCount !== arrId.length) {
      return response.status(404).json({
        message: "Некоторые товары не были удалены"
      })
    } else if (!resDel.deletedCount) {
      return response.status(500).json(resDel)
    } else {
      response.json({
        success: true
      })
    }
  } catch (error) {
    console.log(error)
    response.status(500).json(error)
  }
})
module.exports = router;