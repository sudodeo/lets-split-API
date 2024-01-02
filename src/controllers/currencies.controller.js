const currenciesModel = require("../models/currencies.model");

exports.getCurrencies = async (req, res) => {
  try {
    currencies = await currenciesModel.getCurrencies();
    res.status(200).json({currencies})
  } catch (error) {
    res.status(500).json({
        success:false,
        error: "internal server error"
    })
    console.error(error)
  }
};
