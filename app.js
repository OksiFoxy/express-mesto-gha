const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const routes = require('./routes/router');
const { PORT = 3000 } = process.env;
const app = express();

// AntiDOS & helmet
// https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Лимитировать каждый IP до 100 запросов на `окно` (здесь, за 15 минут)
  standardHeaders: true, // Лимит скорости возврата в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключите заголовки `X-RateLimit-*`
});
app.use(limiter); // AntiDOS на все реквесты
app.use(helmet()); // защита

app.disable('x-powered-by');
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '648f9449a63c8df8f9725ec4',
  };
  next();
});

app.use(routes);
mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('БД подключена');
  })
  .catch(() => {
    console.log('БД отвалилась');
  });

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`);
});