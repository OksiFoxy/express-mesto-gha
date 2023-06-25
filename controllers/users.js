const User = require('../models/userSchema');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,} = require('../utils/constants');


// Получение списка пользователей
module.exports.getUserList = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

// Получение пользователя по ID
module.exports.getUserId = ( req, res, next) => {
  User
    .findById(req.params.id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные при поиске пользователя',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND).send({
            message: 'Пользователь c указанным _id не найден',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Создание пользователя (Регистрация)
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body.data;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: `На сервере произошла ошибка` });
      }
    });
};

// Обновление профиля пользователя
module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body.data;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля` });
      } else {
        res.status(SERVER_ERROR).send({ message: `На сервере произошла ошибка` });
      }
    });
};

// Обновление аватара пользователя
module.exports.updateUserAvatar= (req, res) => {
  const { avatar } = req.body.data;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении аватара` });
      } else {
        res.status(SERVER_ERROR).send({ message: `На сервере произошла ошибка` });
      }
    });
};