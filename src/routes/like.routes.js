import { Router } from "express"
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/video/:videoId").post(verifyJwt,toggleVideoLike)
router.route("/comment/:commentId").post(verifyJwt,toggleCommentLike)
router.route("/tweet/:tweetId").post(verifyJwt,toggleTweetLike)
router.route("/videos").get(verifyJwt,getLikedVideos)

export default router