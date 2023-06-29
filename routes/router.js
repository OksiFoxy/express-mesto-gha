const router = require('express').Router();
const userRouter = require('./userRoutes');
const cardRouter = require('./cardsRoutes');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req, res) => {
  res.status(404)
    .send({ message: '404: Страница не найдена.' });
});

module.exports = router;
