import { Router } from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:videoId").get(verifyJwt,getVideoComments).post(verifyJwt,addComment)
router.route("/:id").patch(verifyJwt,updateComment)
router.route("/:id").delete(verifyJwt,deleteComment)


export default router