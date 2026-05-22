import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import Video from "../models/video.models.js"
// TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
const getChannelStats = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

// TODO: Get all the videos uploaded by the channel
const getChannelVideos = async (req, res, next) => {

    try {
        const userVideos = await Video.find({
            owner: req.user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json(new ApiResponse(200, userVideos, "user videos fetched successfully"))
    } catch (error) {
        next(error)
    }
}

export {
    getChannelStats,
    getChannelVideos
}