module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username can not be empty.";
  }
  if (email.trim() === "") {
    errors.email = "Email can not be empty.";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email.";
    }
  }

  if (password === "") {
    errors.password = "Password can not be empty.";
  } else if (password !== confirmPassword) {
    errors.password = "Password did not match.";
  } else {
    if (password.length < 6) {
      errors.password = "Password must be at least 6 charactors.";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username or password is wrong.";
  }
  if (password.trim() === "") {
    errors.password = "Username or password is wrong.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
