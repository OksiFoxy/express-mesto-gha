const router = require('express').Router();
const { NOT_FOUND } = require('../utils/constants');
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardsRoutes');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(NOT_FOUND)
    .send({ message: '404: Страница не найдена.' });
});

module.exports = router;