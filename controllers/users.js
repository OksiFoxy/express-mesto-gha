const User = require('../models/userSchema');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,} = require('../utils/constants');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');

// Получение списка пользователей
module.exports.getUserList = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
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
      return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// Создание пользователя (Регистрация)
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
};


// Обновление профиля пользователя
module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail().then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND).send({
            message: 'Пользователь не найден',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};
// Обновление аватара пользователя
module.exports.updateUserAvatar  = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Некорректный ID пользователя для обновления аватара.'))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND).send({
            message: 'Пользователь не найден',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};