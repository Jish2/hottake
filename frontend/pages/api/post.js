import mongoose from "mongoose";
import connect from "../../db/connect";
import Post from "../../db/models/Post";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  await connect();

  switch (method) {
    case "GET":
      try {
        const postID = req.query.postID;

        // catch invalid postID
        if (mongoose.Types.ObjectId.isValid(postID) === false) {
          res.status(400).json({
            message: "Invalid arguments provided",
          });
          return;
        }

        const results = await Post.findById(postID).limit(1);
        res.status(200).json(results);
      } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
      }
      break;
    case "POST":
      try {
        if (req.body.title.length == 0) {
          res.status(400).json({ message: "Post content is missing" });
        } else if (req.body.title.length <= 5) {
          res
            .status(400)
            .json({ message: "Post must be longer than 5 characters" });
        } else if (req.body.title.length > 140) {
          res
            .status(400)
            .json({ message: "Post must be less than 140 characters" });
        } else {
          const newPost = new Post({
            title: req.body.title,
            agree: [],
            disagree: [],
            votes: 0,
            interactions: 0,
            reports: [],
            date: new Date(),
          });
          const createdPost = await newPost.save();
          res.status(200).json(createdPost);
        }
      } catch (error) {
        console.error(error);
        res.status(400).json({ message: error });
      }
      break;
    default:
      res.status(400).json({ message: error });
      break;
  }
}
