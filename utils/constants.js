const OK = 200;
const CREATED = 201;
const SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev';

module.exports = {
  OK, CREATED, SECRET,
};
