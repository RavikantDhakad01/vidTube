import Subscription from "../models/subscription.models.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"


const toggleSubscription = async (req, res, next) => {
  const { channelId } = req.params
  try {

    if (req.user._id.toString() === channelId) {
      throw new ApiError(400, "User cannot subscribe to own channel")
    }
    const subscribe = await Subscription.findOne({
      subscriber: req.user._id,
      channel: channelId
    })

    if (!subscribe) {
      const newSubscribe = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
      })

      return res.status(201).json(new ApiResponse(201, newSubscribe, "Channel subscribed successfully"))
    }

    const deletedSubscribe = await Subscription.findByIdAndDelete(subscribe._id)
    return res.status(200).json(new ApiResponse(200, deletedSubscribe, "Channel unsubscribed successfully"))

  } catch (error) {
    next(error)
  }
}


const getUserChannelSubscribers = async (req, res, next) => {
  const { channelId } = req.params

  try {
    const subscribers = await Subscription.find({
      channel: channelId
    }).populate("subscriber","username avatar")

    return res.status(200).json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// controller to return channel list to which user has subscribed
const getSubscribedChannels = async (req, res, next) => {
  const { subscriberId } = req.params
  try {

  } catch (error) {
    next(error)
  }
}

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
}