const bcrypt = require("bcrypt");

const hashPassword = async (unhashedPassword) => {
  let salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(unhashedPassword, salt);
};

const compareHash = async (newHash, oldHash) => {
  return await bcrypt.compare(newHash, oldHash);
};

module.exports = { hashPassword, compareHash };
