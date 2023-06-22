const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const routes = require('./routes/router');
const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
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