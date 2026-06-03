import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import Video from "../models/video.models.js"
import Subscription from "../models/subscription.models.js"

const getChannelStats = async (req, res, next) => {
    try {
        const userVideos = await Video.find({
            owner: req.user._id
        })
      const  totalUserVideos = userVideos.length

        const totalVideosViews = userVideos.reduce((acc, curr) => acc + curr.views, 0)

        const totalSubscribersCount = await Subscription.countDocuments({
            channel: req.user._id
        })

        return res.status(200).json(new ApiResponse(200, {
            totalUserVideos, totalVideosViews, totalSubscribersCount
        }, "Channel stats fetched successfully"))
    } catch (error) {
        next(error)
    }
}


const getChannelVideos = async (req, res, next) => {

    try {
        const userVideos = await Video.find({
            owner: req.user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json(new ApiResponse(200, userVideos, "User videos fetched successfully"))
    } catch (error) {
        next(error)
    }
}

export {
    getChannelStats,
    getChannelVideos
}