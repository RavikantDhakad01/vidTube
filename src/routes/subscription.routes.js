import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/channel/:channelId").post(verifyJwt, toggleSubscription).get(verifyJwt, getUserChannelSubscribers)
router.route("/subscriber/:subscriberId").get(verifyJwt, getSubscribedChannels)

export default router