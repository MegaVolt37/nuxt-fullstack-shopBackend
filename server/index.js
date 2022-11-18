
const express = require('express');
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




// ---- Подключение роутов
const posts = require('./routes/api/posts');
const catalog = require('./routes/api/catalog');
const login = require('./routes/api/users/login');
const me = require('./routes/api/users/me');
const registration = require('./routes/api/users/registration');

app.use('/api/posts', posts);
app.use('/api/catalog', catalog);
app.use('/api/users/login', login);
app.use('/api/users/me', me);
app.use('/api/users/registration', registration);
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