import { Router } from "express";
import {
    publishVideo,
    getAllVideos,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
    updateVideo
} from "../controllers/video.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"; 
import {validateVideoFiles,validateOptionalImage} from "../middlewares/fileType.middleware.js"

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
]),validateVideoFiles, publishVideo)

router.route("/").get(getAllVideos)

router.route("/:id").get(verifyJwt, getVideoById)
router.route("/:id").delete(verifyJwt, deleteVideo)
router.route("/:id/toggle").patch(verifyJwt, togglePublishStatus)
router.route("/:id").patch(verifyJwt, upload.single("thumbnail"),validateOptionalImage, updateVideo)

export default router
