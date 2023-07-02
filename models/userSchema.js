const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    minlength: 2,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправильная почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new Error('Неправильная почта или пароль'));
          return user;
        });
    });
};
// controllers/users.js

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = mongoose.model('user', userSchema);
