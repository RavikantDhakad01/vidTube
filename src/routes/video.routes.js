import { Router } from "express";
import {
    publishVideo,
    getAllVideos,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
    updateVideo
} from "../controllers/video.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware"
import upload from "../middlewares/multer.middleware.js"; s


const router = Router()

router.route("/").post(verifyJwt, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishVideo)

router.route("/").get(getAllVideos)

router.route("/:id").get(verifyJwt, getVideoById)
router.route("/:id").delete(verifyJwt, deleteVideo)
router.route("/:id/toggle").patch(verifyJwt, togglePublishStatus)
router.route("/:id").patch(verifyJwt, upload.single("thumbnail"), updateVideo)

export default router
