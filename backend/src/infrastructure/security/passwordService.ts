import bcrypt from "bcrypt";


export const PasswordService = {
  hashPassword: async (password: string) => {
    return await bcrypt.hash(password, 10);
  },

  comparePassword: async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
  }
};




