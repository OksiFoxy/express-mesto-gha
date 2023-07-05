const router = require('express').Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardsRoutes');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { createUser, login } = require('../controllers/users');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/signin', login);
router.use('/signup', createUser);
router.use('/*', auth, () => {
  throw new NotFound('404: Страница не найдена.');
});

module.exports = router;
