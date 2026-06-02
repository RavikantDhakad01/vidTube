import Subscription from "../models/subscription.models.js"
import User from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


const toggleSubscription = async (req, res, next) => {
  const { channelId } = req.params
  try {
    const channel = await User.findById(channelId)

    if (!channel) {
      throw new ApiError(404, "channel does not exist")
    }

    if (req.user._id.toString() === channelId) {
      throw new ApiError(400, "User cannot subscribe to his own channel")
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
    const channel = await User.findById(channelId)

    if (!channel) {
      throw new ApiError(404, "Channel does not exist")
    }

    const subscribers = await Subscription.find({
      channel: channelId
    }).populate("subscriber", "username avatar")

    const totalSubscribers = subscribers.length

    return res.status(200).json(new ApiResponse(200, {subscribers,totalSubscribers}, "Channel subscribers fetched successfully"))
  } catch (error) {
    next(error)
  }
}

const getSubscribedChannels = async (req, res, next) => {
  const { subscriberId } = req.params
  try {
     const user = await User.findById(subscriberId)

    if (!user) {
      throw new ApiError(404, "User does not exist")
    }

    const subscription = await Subscription.find({
      subscriber: subscriberId
    }).populate("channel", "username avatar")

    const totalSubscriptions = subscription.length

    return res.status(200).json(new ApiResponse(200, {subscription,totalSubscriptions}, "User subscription fetched successfully"))
    
  } catch (error) {
    next(error)
  }
}

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
}