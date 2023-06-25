const User = require('../models/userSchema');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,} = require('../utils/constants');


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
  console.log(req.user._id);
  const { name, about, avatar } = req.body;
  const owner = req.user._id;
  User.create({ name, about, avatar, owner })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
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
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND)
        .send({ message: 'Пользователь с этим id не найден' });
    }
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные.',
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
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND)
          .send({ message: 'Пользователь с этим id не найден' });
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные.',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};