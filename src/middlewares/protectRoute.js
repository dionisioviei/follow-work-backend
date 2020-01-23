const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

exports.protectRoute = role => {
  return (req, res, next) => {
    const userToken = req.headers['x-access-token'];
    if (!userToken)
      return res
        .status(401)
        .send({ auth: false, message: 'No token provided.' });
    try {
      const verify = jwt.verify(userToken, secret);
      if (role !== verify.type && role !== 'all')
        return res.status(401).send({ auth: false, message: 'Acesso negado.' });
      if (verify) {
        req.body.role = verify.type;
        req.body.roleUser = verify.username;
        next();
      } else {
        return res.status(401).send({ auth: false, message: 'Invalid token.' });
      }
    } catch (e) {
      return res.status(400).send({ auth: false, message: e });
    }
  };
};
