
const express = require('express');
const path = require('path')
const checkAuth = require('./utils/checkAuth');
const multer = require('multer')
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://alexandr0095:08SA108ser@cluster0.exetvsg.mongodb.net/shopNuxt3?retryWrites=true&w=majority').then(() => {
  console.log('DB ok')
}).catch((e) => {
  console.log('DB error', e)
})
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Хранилище картинок
// const storage = multer.diskStorage({
//   destination: (_, __, callback) => {
//     callback(null, './images')
//   },
//   filename: (_, file, callback) => {
//     callback(null, file.originalname)
//   },
// });
// const upload = multer({ storage })

// ---- Подключение роутов
const posts = require('./routes/api/posts');
const catalog = require('./routes/api/catalog');
const login = require('./routes/api/users/login');
const me = require('./routes/api/users/me');
const registration = require('./routes/api/users/registration');
const post = require('./routes/api/catalog/post');
const product = require('./routes/api/catalog/product');
const cart = require('./routes/api/cart');

app.use('/api/posts', posts);
app.use('/api/catalog', catalog);
app.use('/api/users/login', login);
app.use('/api/users/me', checkAuth, me);
app.use('/api/users/registration', registration);
app.use('/api/catalog/post', post);
app.use('/api/catalog/product', product);
app.use('/api/cart', cart);
// Разобраться с картинкой get запрос
app.use('/images', express.static('./images'));
app.use('/images/products', express.static('./images/products/'));
// app.use('/images', upload.single('image'), (request, response) => {
//   response.status(200).json({
//     url: `/images/${request.file.originalname}`,
//     message: "Файл упешно загружен"
//   })
// });

// ------









if (process.env.NODE_ENV === 'production') {
  // Static
  app.use(express.static(__dirname + 'public'));

  app.get(/.*/, (req, res) => res.sendFile(__dirname + 'public/index.html'))
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started port-${port}`)
});