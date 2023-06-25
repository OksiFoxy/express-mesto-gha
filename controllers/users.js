const User = require('../models/userSchema');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const { OK, CREATED, SERVER_ERROR,} = require('../utils/constants');
// Получение списка пользователей
module.exports.getUserList = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка получения списка пользователей' }));
};

// Получение пользователя по ID
module.exports.getUserId = ( req, res, next) => {
  User
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по этому _id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
        return;
      }
      next(err);
    });
};

// Создание пользователя (Регистрация)
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      next(err);
    });
};


// Обновление профиля пользователя
module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь с таким ID не найден.'))
    .then((updatedUserData) => res.send({ data: updatedUserData }))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

// Обновление аватара пользователя
module.exports.updateUserAvatar  = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Некорректный ID пользователя для обновления аватара.'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};