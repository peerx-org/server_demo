import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  return hashedPass;
};

const comparePassword = async (password: string, userPassword: string) => {
  const isValid = await bcrypt.compare(password, userPassword);

  return isValid;
};

export { hashPassword, comparePassword };
