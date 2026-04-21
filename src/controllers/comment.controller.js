import Comment from "../models/comment.models.js"
import Video from "../models/video.models.js"
import mongoose from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const addComment = async (req, res, next) => {
    try {
        const { content } = req.body
        const { videoId } = req.params

        const video = await Video.findById(videoId)

        if (!video) {
            throw new ApiError(404, "Video not found")
        }
        if (!content) {
            throw new ApiError(401, "Content is required")
        }

        const comment = await Comment.create({
            content: content,
            video: new mongoose.Types.ObjectId(videoId),
            owner: new mongoose.Types.ObjectId(req.user?._id)
        })

        if (!comment) {
            throw new ApiError(500, "Something went wrong while adding comment")
        }

        return res.status(201).json(new ApiResponse(201, comment, "Comment Added successfully"))

    } catch (error) {
        next(error)
    }
}

const getVideoComments = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

const updateComment = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}