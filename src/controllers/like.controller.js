import Like from "../models/like.models.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

const toggleVideoLike = async (req, res, next) => {

     const { videoId } = req.params
    try {       
        const like = await Like.findOne({ video: videoId, likedBy: req.user._id })

        if (!like) {
            const newLike = await Like.create({
                video: videoId, likedBy: req.user._id
            })

            return res.status(200).json(new ApiResponse(200, newLike, "Video liked"))
        }

        const unLike = await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200, unLike, "Video unliked"))

    } catch (error) {
        next(error)
    }
}

const toggleCommentLike = async (req, res, next) => {

 const { commentId } = req.params
    try {
        const like = await Like.findOne({ comment: commentId, likedBy: req.user._id })

        if (!like) {
            const newLike = await Like.create({
                comment: commentId, likedBy: req.user._id
            })
            return res.status(200).json(new ApiResponse(200, newLike, "Comment liked"))
        }

        const unLike = await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200, unLike, "Comment unliked"))

    } catch (error) {
        next(error)
    }
}

const toggleTweetLike = async (req, res, next) => {

    const { tweetId } = req.params
    try {
        const like = await Like.findOne({ tweet: tweetId, likedBy: req.user._id })

        if (!like) {
            const newLike = await Like.create({
                tweet: tweetId, likedBy: req.user._id
            })
            return res.status(200).json(new ApiResponse(200, newLike, "Tweet liked"))
        }

        const unLike = await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200, unLike, "Tweet unliked"))

    } catch (error) {
        next(error)
    }
}


const getLikedVideos = async (req, res, next) => {

    try {
        const likedVideos = await Like.find({
            likedBy: req.user._id,
            video: { $exists: true }
        }).populate("video")

        return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))

    } catch (error) {
        next(error)
    }
}

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}