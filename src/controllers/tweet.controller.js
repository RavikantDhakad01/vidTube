import Tweet from "../models/tweet.models.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

const createTweet = async (req, res, next) => {
   const { content } = req.body

   try {
      if (!content || content.trim() === "") {
         throw new ApiError(400, "Fields are required")
      }
      const tweet = await Tweet.create({
         content: content.trim(),
         owner: req.user._id
      })
      return res.status(201).json(new ApiResponse(201, tweet, "Tweet made successfully"))
   } catch (error) {
      next(error)
   }
}


const updateTweet = async (req, res) => {
   try {

   } catch (error) {
      next(error)
   }
}

const deleteTweet = async (req, res) => {
   try {

   } catch (error) {
      next(error)
   }
}

export {
   createTweet,
   getUserTweets,
   updateTweet,
   deleteTweet
}
