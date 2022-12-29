const express = require('express');
const checkAuth = require('../../../utils/checkAuth');
const { ProductCreateValidation } = require('../../../validations/validation');
const modelProduct = require('../../../models/Product');
const modelUser = require('../../../models/User');
const router = express.Router();
const multer = require('multer')


const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, './images/products/')
  },
  filename: (_, file, callback) => {
    callback(null, Date.now() + '_' + file.originalname)
  },
});

const fileFilter = (req, file, callback) => {
  // reject 
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }


}

const upload = multer({
  storage, limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})


router.post('/', checkAuth, ProductCreateValidation, upload.single('image'), async (request, response) => {
  try {
    let resultPrice = request.body.stock ? (request.body.price - (request.body.price * (request.body.stock / 100))).toFixed(2) : null
    const doc = new modelProduct({
      name: request.body.name,
      price: request.body.price,
      priceStock: resultPrice,
      discount: (request.body.price - (request.body.price * 0.05)).toFixed(2),
      article: request.body.article,
      category: request.body.category,
      brand: request.body.brand,
      country: request.body.country,
      weight: request.body.weight,
      image: request.protocol + '://' + request.get('host') + '/' + request.file.path,
      supplier: request.userId,
      stock: request.body.stock,
      countStorage: request.body.countStorage,
    });
    const post = await doc.save();
    response.json(post)
  } catch (error) {
    console.log(error)
    response.status(500).json(error)

  }

})
router.get('/', async (request, response) => {
  try {
    if (Object.keys(request.query).length) {
      const productsFilter = await modelProduct.find({ 'name': { '$regex': `${Object.values(request.query)}` } });
      response.json(productsFilter)
    } else {
      const products = await modelProduct.find().exec();
      response.json(products)
    }
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
    const user = await modelUser.findById(productId.supplier)
    if (!productId) {
      return response.status(400).send({
        message: "Товар не найден"
      })
    }
    productId._doc.supplier = { id: productId._doc.supplier, fullName: user.fullName }
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
    let resultPrice = ""
    let resultDiscount = ""
    const postId = request.params.id
    if (request.body.stock) {
      const product = await modelProduct.findById(request.params.id)
      resultPrice = request.body.stock ? (product.price - (product.price * (request.body.stock / 100))).toFixed(2) : null
    } else {
      const product = await modelProduct.findById(request.params.id)
      resultPrice = product.stock ? (product.price - (product.price * (product.stock / 100))).toFixed(2) : null
    }
    if (request.body.price) {
      resultDiscount = (request.body.price - (request.body.price * 0.05)).toFixed(2)
    } else {
      const product = await modelProduct.findById(request.params.id)
      resultDiscount = (product.price - (product.price * 0.05)).toFixed(2)
    }
    await modelProduct.updateOne({
      _id: postId
    }, {
      name: request.body.name,
      price: request.body.price,
      priceStock: resultPrice,
      discount: resultDiscount,
      article: request.body.article,
      category: request.body.category,
      brand: request.body.brand,
      country: request.body.country,
      weight: request.body.weight,
      stock: request.body.stock,
      countStorage: request.body.countStorage,
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