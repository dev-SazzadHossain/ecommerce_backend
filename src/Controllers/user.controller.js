import { User } from "../Models/user.model.js";
import cloudinaryService from "../Utils/cloudinary.service.js";
import { emailTemplate } from "../Utils/email.template.js";
import { mailProviderService } from "../Utils/mail.provider.js";
import { options } from "../Utils/options.js";
import { randomNumberGenerator } from "../Utils/random.number.js";

// * generateAccessAndRefreshToken function
const generateAccessAndRefreshToken = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(406).send({ error: "invalid user credentials" });
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res.send({
      error: `generateAccessAndRefreshToken Failed:${error.message}`.bgWhite
        .red,
    });
  }
};

//* user register controller
const userRegisterController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      addressOne,
      addressTwo,
      city,
      postCode,
      division,
      district,
      password,
    } = req.body;
    // *check userInfo
    if (
      [
        firstName,
        lastName,
        email,
        phoneNumber,
        addressOne,
        addressTwo,
        city,
        postCode,
        division,
        district,
        password,
      ].some((field) => field.trim() === "")
    ) {
      return res.status(406).send({ error: "All fields are required" });
    }
    // *check userInfo

    // *check existing user
    const existedUser = await User.findOne({
      $or: [{ firstName }, { email }, { phoneNumber }],
    });
    if (existedUser) {
      return res.status(406).send({ error: "User already exists" });
    }
    // *check existing user
    const randomNumber = randomNumberGenerator(9999);

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      addressOne,
      addressTwo,
      city,
      postCode,
      division,
      district,
      password,
      verifyOtp: Number(randomNumber),
    });

    const response = await user.save({ validateBeforeSave: false });
    const responseUser = await User.findOne(response._id).select(
      "-password -refreshToken -verifiedOpt"
    );
    const sendMainResponse = await mailProviderService(
      responseUser?.email,
      "Email Verification Mail",
      emailTemplate,
      randomNumber
    );

    // * remove otp 5  minutes later
    setTimeout(async () => {
      await User.findByIdAndUpdate(
        responseUser?._id,
        {
          $unset: {
            verifyOtp: 1,
          },
        },
        { new: true }
      );
      console.log("opt remove success");
    }, 80000);

    return res.status(200).send({
      success: true,
      message: "User Create Successfully",
      data: responseUser,
    });
  } catch (error) {
    return res.send({
      error: `user controller error:${error?.message}`.bgBlack.white,
    });
  }
};

// *user login controller
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((field) => field.trim() === "")) {
      return res.status(406).send({ error: "all fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(406).send({ error: "user dose not exist" });
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(406).send({ error: "invalid user credentials" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );
    const loginUser = await User.findById(user?._id).select(
      "-password -refreshToken"
    );

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .send({
        success: true,
        message: "Login Successfully",
        accessToken,
        refreshToken,
        data: loginUser,
      });

    //*   login successfully
  } catch (error) {
    return res
      .status(406)
      .send({ error: `user loginError:${error.message}`.bgWhite.red });
  }
};

// * user logout
const userLogOut = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req?.user?.id,
    {
      $unset: {
        refreshToken: 1, // remove refreshToken use 1 or ""
      },
    },
    { new: true }
  ); //* auth middleware set user req.user

  if (!user) {
    return res.send({ error: "user is not found" });
  }

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send({
      success: true,
      message: "LogOut SuccessFully",
    });

  try {
  } catch (error) {
    return res.status(404).send({ error: `userLogOut Error:${error.message}` });
  }
};

//* ------------profile----------------
//* user profile upload controller
const userProfileUpdate = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(406).send({ error: "file missing" });
    }
    const uploadResponse = await cloudinaryService(file?.path);
    if (!uploadResponse) {
      return res.status(406).send({ error: "Upload failed" });
    }
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({ error: "invalid user access" });
    }
    user.image = uploadResponse?.url;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .send({ success: true, message: "User Profile UploadSuccessfully" });
  } catch (error) {
    return res.send({
      error: `user profile upload error:${error.message}`.bgWhite.red,
    });
  }
};

// * user password change
const userPasswordChange = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if ([oldPassword, newPassword].some((field) => field.trim() === "")) {
      return res.status(406).send({ error: "all fields are required" });
    }
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.send({ error: "User dose not exist" });
    }
    const checkPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!checkPasswordCorrect) {
      return res.status(406).send({ error: "invalid user Password" });
    } else {
      user.password = newPassword;
      await user.save({ validateBeforeSave: false });
      res
        .status(200)
        .send({ success: true, message: "Password Change Successfully" });
    }
  } catch (error) {
    return res
      .status(404)
      .send({ error: `userPasswordChangeError:${error.message}` });
  }
};

// * user update profile info
const userUpdateProfileInfo = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      addressOne,
      addressTwo,
      city,
      postCode,
      division,
      district,
    } = req.body;
    // *check userInfo
    if (
      [
        firstName,
        lastName,
        email,
        phoneNumber,
        addressOne,
        addressTwo,
        city,
        postCode,
        division,
        district,
      ].some((field) => field.trim() === "")
    ) {
      return res.status(406).send({ error: "All fields are required" });
    }
    // *check userInfo

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        $set: {
          firstName,
          lastName,
          email,
          phoneNumber,
          addressOne,
          addressTwo,
          city,
          postCode,
          division,
          district,
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ error: "User Profile Update failed", message: error.message });
    }
    return res
      .status(200)
      .send({ success: true, message: "User Profile Update Successfully" });
  } catch (error) {
    return res
      .status(404)
      .send({ error: `userUpdateProfileInfo Error:${error.message}` });
  }
};

// * user email verify

const userEmailVerify = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.send({ message: "otp is required" });
    }
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(406).send({ error: "User dose not exist" });
    }
    const checkOtp = user.verifyOtp === Number(otp);
    if (!checkOtp) {
      return res.send({ message: "invalid otp" });
    }
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .send({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    return res.send({ error: "Email Verify failed" });
  }
};

export {
  userRegisterController,
  userLoginController,
  userLogOut,
  userProfileUpdate,
  userPasswordChange,
  userUpdateProfileInfo,
  userEmailVerify,
};
