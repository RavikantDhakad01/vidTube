import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

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

    } catch (error) {
        next(error)
    }
}

export {
    getChannelStats,
    getChannelVideos
}