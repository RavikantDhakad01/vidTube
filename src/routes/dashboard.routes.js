import { Router } from "express";
import {
    getChannelStats,
    getChannelVideos
} from "../controllers/dashbord.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/stats").get(verifyJwt,getChannelStats)
router.route("/videos").get(verifyJwt,getChannelVideos)

export default router