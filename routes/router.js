const router = require('express').Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardsRoutes');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(404)
    .send({ message: '404: Страница не найдена.' });
});

module.exports = router;