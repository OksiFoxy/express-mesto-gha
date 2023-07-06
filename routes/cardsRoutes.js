const cardRouter = require('express').Router();

const {
  getCardList, createCard, deleteCard, likeCard, removeLikeCard,
} = require('../controllers/cards');
const { validNewCard, validCardId } = require('../utils/validate');

// Получить список, создать или удалить карточку
cardRouter.get('/', getCardList);
cardRouter.post('/', validNewCard, createCard);
cardRouter.delete('/:cardId', validCardId, deleteCard);
// Поставить и убрать лайк
cardRouter.put('/:cardId/likes', validCardId, likeCard);
cardRouter.delete('/:cardId/likes', validCardId, removeLikeCard);

module.exports = cardRouter;
