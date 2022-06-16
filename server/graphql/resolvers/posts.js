const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });

        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);

        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      // console.log(body, context);

      if (body.trim() === "") {
        throw new Error("Post body can not be empty.");
      }
      const user = checkAuth(context);
      // console.log(user, "mutation");
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },

    async deletePost(_, { postId }, context) {
      // console.log(postId, context);
      const user = checkAuth(context);
      console.log(user);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();

          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // post already likes unlike it

          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // not like liked post

          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();

        return post;
      } else throw new UserInputError("Post not found.");
    },
  },
};
