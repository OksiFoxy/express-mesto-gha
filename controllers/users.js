const User = require('../models/userSchema');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,} = require('../utils/constants');
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
    .orFail()
    .then((user) => res.status(OK).send(user))
      .catch(err => res.status(BAD_REQUEST).send({ message: 'Произошла ошибка получения пользователя по ID' }));
  };

// Создание пользователя (Регистрация)
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Пользователь не создан, ошибка данных.',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};


// Обновление профиля пользователя
module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь с таким ID не найден.'))
    .then((updatedUserData) => res.send({ data: updatedUserData }))
    .catch(err => res.status(BAD_REQUEST).send({ message: 'Произошла ошибка' }));
};

// Обновление аватара пользователя
module.exports.updateUserAvatar  = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Некорректный ID пользователя для обновления аватара.'))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(err => res.status(BAD_REQUEST).send({ message: 'Произошла ошибка изменения аватара' }));
};