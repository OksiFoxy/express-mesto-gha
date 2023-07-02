const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const BadRequest = require('../errors/BadRequest'); // 400
const AuthError = require('../errors/AuthError'); // 401
const NotFound = require('../errors/NotFound'); // 404
const ConflictError = require('../errors/ConflictError'); // 409
const ServerError = require('../errors/ServerError'); // 500

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SECRET,
} = require('../utils/constants');

// Получение списка пользователей
module.exports.getUserList = (req, res) => {
  User.find({})
    .then((users) => res
      .send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};
// Получение пользователя
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Получение пользователя по ID
module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Создание пользователя (Регистрация)
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Обновление профиля пользователя
module.exports.updateUserData = (req, res) => {
  const {
    name, about, email, password,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
      email,
      password,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Обновление аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })

    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
