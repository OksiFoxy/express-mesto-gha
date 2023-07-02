const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev';
module.exports = {
  OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SECRET,
};
