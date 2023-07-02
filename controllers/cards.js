const Card = require('../models/cardSchema');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/constants');

// Возвращает все карточки:
module.exports.getCardList = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка при запросе всех карточек' }));
};

// Создаёт карточку:
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Удаление карточки:
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные карточки.',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Поставить лайк карточке:
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Удалить лайк с карточки:
module.exports.removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для удаления лайка.',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
