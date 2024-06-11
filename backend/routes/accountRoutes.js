const express = require('express');
const router = express.Router();

const Acc = require('../db/models/accModel.js');

const asyncError = require('../middlewares/asyncErrors.js');

router.route('/acc').get(asyncError(async(req, res) => {
  const acc = await Acc.find();

  res.status(200).json({
    success: true,
    acc: acc[0]
  });
}));

router.route('/acc').put(asyncError(async(req, res) => {
  const acc = await Acc.find();

  const data = {
    account: acc[0].account ? 0 : 1,
  };

  const newAcc = await Acc.findByIdAndUpdate(acc[0]._id, data);

  res.status(200).json({
    success: true,
    account: newAcc.account ? 0 : 1,
  });
}));

module.exports = router;