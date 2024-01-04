import bcrypt from "bcrypt";

const hashPassword = async (unhashedPassword) => {
  let salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(unhashedPassword, salt);
};

const isValidPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export default { hashPassword, isValidPassword };
