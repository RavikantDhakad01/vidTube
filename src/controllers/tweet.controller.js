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
const getUserTweets = async (req, res, next) => {
   const { userId } = req.params
   try {
      const userTweets = await Tweet.find({
         owner: userId
      }).sort({ createdAt: -1 })
      return res.status(200).json(new ApiResponse(200, userTweets, "user tweets fetched successfully"))
   } catch (error) {
      next(error)
   }
}


const updateTweet = async (req, res, next) => {
   const { tweetId } = req.params
   const { content } = req.body
   try {
      if (!content || content.trim() === "") {
         throw new ApiError(400, "Fields are required")
      }

      const tweet = await Tweet.findById(tweetId)
      if (!tweet) {
         throw new ApiError(404, "Tweet does not exist")
      }

      if (tweet.owner.toString() !== req.user._id.toString()) {
         throw new ApiError(403, "Unauthorized access")
      }
      tweet.content = content.trim()
      await tweet.save({ validateBeforeSave: false })
      return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"))

   } catch (error) {
      next(error)
   }
}

const deleteTweet = async (req, res, next) => {
   const { tweetId } = req.params
   try {
      const tweet = await Tweet.findById(tweetId)
      if (!tweet) {
         throw new ApiError(404, "Tweet does not exist")
      }

      if (tweet.owner.toString() !== req.user._id.toString()) {
         throw new ApiError(403, "Unauthorized access")
      }

   const deletedTweet =  await Tweet.findByIdAndDelete(tweet._id)
      return res.status(200).json(new ApiResponse(200,deletedTweet, "Tweet deleted successfully"))
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
