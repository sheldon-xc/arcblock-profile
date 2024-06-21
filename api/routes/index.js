const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();

const infoRouter = require('./info');

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

router.use('/info', infoRouter);

module.exports = router;
