const Card = require('../models/cardSchema');
const {
  OK,
  CREATED,
} = require('../utils/constants');

const BadRequestError = require('../errors/BadRequest'); // 400
const NotFoundError = require('../errors/NotFound'); // 404
const ConflictError = require('../errors/ConflictError'); // 409
const NotUserError = require('../errors/NotUser'); // 409

// Возвращает все карточки:
module.exports.getCardList = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

// Создаёт карточку:
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

// Удаление карточки:
// module.exports.deleteCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .orFail(new NotFoundError('Такого ID карточки нет.'))
//     .then((card) => {
//       if (!card) {
//         return next(new NotFoundError('Карточка с указанным _id не найдена'));
//       }
//       return res.status(OK).send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Некорректные данные карточки'));
//       } else if (err.code === 11000) {
//         next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Нет такого ID карточки.'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) return next(new NotUserError('Это чужая карточка.'));

      return Card.deleteOne(card)
        .then(() => res.send({ message: card }));
    })
    .catch((err) => next(err));
};

// Поставить лайк карточке:
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.send({ card, message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка'));
      } else {
        next(err);
      }
    });
};

// Удалить лайк с карточки:
module.exports.removeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.send({ card, message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении лайка'));
      } else {
        next(err);
      }
    });
};
