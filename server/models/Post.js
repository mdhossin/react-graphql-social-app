const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: String,
    username: String,
    createdAt: String,
    comments: [
      {
        body: String,
        username: String,
        createdAt: String,
      },
    ],
    likes: [
      {
        username: String,
        createdAt: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
