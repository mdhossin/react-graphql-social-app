const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validation");

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credentials";
        throw new UserInputError("Username or password is wrong", { errors });
      }

      const token = generateToken(user);

      return {
        token,
        ...user._doc,
        id: user._id,
      };
    },

    // register(parent, args, context, info) egula pabo er er moddhe but parent temon kaje lage na parent ke _, evbabe likbo and info temon kaje lage na and agrs er moddhe registerInput pabo jeta typeDefs er moddhe define korsi valovabe bujte hobe

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // need to do first:
      // validate user data

      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // make sure user does't already exists

      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError("This email already exists", {
          errors: {
            username: "This email already exists",
          },
        });
      }
      // hash password and create an auth token

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        confirmPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);
      // console.log({ ...res._doc }); sob data pabo

      return {
        token,
        ...res._doc,
        id: res._id,
      };
    },
  },
};

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}
