import bcrypt from "bcrypt";

const hashPassword = async (unhashedPassword) => {
  let salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(unhashedPassword, salt);
};

const compareHash = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export default { hashPassword, compareHash };
