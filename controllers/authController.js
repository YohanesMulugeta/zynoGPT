const User = require("../model/user");

exports.signUp = async function (req, res, next) {
  const { name, email, password, passwordConfirm, photo, plan } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    photo,
    plan,
  });

  user.password = undefined;

  res.status(201).json({
    status: "success",
    data: { user },
  });
};
