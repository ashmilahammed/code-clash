export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expires = new Date(Date.now() +  60 * 1000);

  return { otp, expires };
};


