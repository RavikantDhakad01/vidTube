import { Router } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
} from "../controllers/auth.controller.js"

import upload from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser)

router.route("/login").post(loginUser)
router.route("/refresh-tokens").post(refreshAccessToken)

//secure routes
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/current-user").get(verifyJwt, getCurrentUser)
router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/update-account").patch(verifyJwt, updateAccountDetails)
router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateUserAvatar)
router.route("/update-cover").patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(verifyJwt, getUserChannelProfile)
router.route("/history").get(verifyJwt, getUserWatchHistory)

export default router