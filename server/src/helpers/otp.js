import Otp from "../models/otp.model.js";

const generateOtp = async (userId, otpType) => {
  // Clear existing otps associated with user
  await Otp.deleteMany({ user: userId, otpType });
  // Proceed to generate and store new otp
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
  //   Get the current date
  const currentDate = new Date(Date.now());
  //   Add five minutes to the currentDate's time
  currentDate.setMinutes(currentDate.getMinutes() + 5);
  // Save the new timestamp in an expiresIn variable
  const expiresIn = currentDate.getTime();

  try {
    const newOtp = await Otp.create({
      user: userId,
      otp: otp,
      expiresIn: expiresIn,
      otpType: otpType,
    });

    return otp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { generateOtp };
