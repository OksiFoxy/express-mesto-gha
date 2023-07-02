const router = require('express').Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardsRoutes');
const authMiddleware = require('../middlewares/auth');

router.use('/users', authMiddleware, userRoutes);
router.use('/cards', authMiddleware, cardRoutes);
router.use('/signin', login);
router.use('/signup', createUser);
router.use('/*', authMiddleware, (req, res) => {
  res.status(404)
    .send({ message: '404: Страница не найдена.' });
});

module.exports = router;
