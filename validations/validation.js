const expressValidator = require('express-validator');
const registerValidation = [
  // Ели в теле запроса будет email, и это свойство является email,
  expressValidator.body('email', 'Неверный формат почты').isEmail(),
  expressValidator.body('password', "Пароль не может содержать меньше 6 символов").isLength({ min: 6 }),
  expressValidator.body('fullName', "Имя не может содержать меньше 3 символов").isLength({ min: 3 }),
  // Проверка этого поля,если не придет,то ок.Если придет то проверяем наличие ссылки
  expressValidator.body('avatarUrl', "Неверная ссылка").optional().isURL(),
];
const loginValidation = [
  expressValidator.body('email', 'Неверный формат почты').isEmail(),
  expressValidator.body('password', "Пароль не может содержать меньше 6 символов").isLength({ min: 6 }),
];
const PostCreateValidation = [
  expressValidator.body('title', 'Поле title не может быть пустым').isLength({ min: 1, max: 100 }),
  expressValidator.body('text', 'Поле text не может быть пустым').isLength({ min: 1, max: 1000 }),
  expressValidator.body('image', "неверная ссылка").optional().isLength(),
];
const ProductCreateValidation = [
  expressValidator.body('name', 'Поле name не может быть пустым').isLength({ min: 1, max: 100 }),
  expressValidator.body('price', 'Поле price не может быть пустым').isLength({ min: 1, max: 1000 }),
  expressValidator.body('article', 'Поле article не может быть пустым').isLength({ min: 1, max: 1000 }),
  expressValidator.body('brand', 'Поле brand не может быть пустым').isLength({ min: 1, max: 1000 }),
  expressValidator.body('country', 'Поле country не может быть пустым').isLength({ min: 1, max: 1000 }),
  expressValidator.body('weight', 'Поле weight не может быть пустым').isLength({ min: 1, max: 1000 }),
  expressValidator.body('image', "неверная ссылка").optional().isLength(),
];
const CartCreateValidation = [
  expressValidator.body('count', 'Поле count не может быть пустым').isLength({ min: 1, max: 100 }),

];
module.exports = { registerValidation, loginValidation, PostCreateValidation, ProductCreateValidation, CartCreateValidation };