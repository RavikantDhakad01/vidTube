import { Router } from "express"
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:videoId").post(verifyJwt,toggleVideoLike)
router.route("/:commentId").post(verifyJwt,toggleCommentLike)
router.route("/:tweetId").post(verifyJwt,toggleTweetLike)
router.route("/videoes").post(verifyJwt,getLikedVideos)

export default router