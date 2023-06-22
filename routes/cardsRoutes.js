const router = require('express').Router();

const {
  getCardList, createCard, deleteCard, likeCard, removeLikeCard,
} = require('../controllers/cards');

// Получить список, создать или удалить карточку
router.get('/', getCardList);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
// Поставить и убрать лайк
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;