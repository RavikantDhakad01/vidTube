import Comment from "../models/comment.models.js"
import Video from "../models/video.models.js"
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
        if (!content || content.trim() === "") {
            throw new ApiError(400, "Content is required")
        }

        const comment = await Comment.create({
            content: content,
            video: videoId,
            owner: req.user?._id
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
        const { content } = req.body
        const { id } = req.patarams

        const comment = await Comment.findByIdAndUpdate(id,
            {
                content: content
            },
            {
                new: true
            })

        if (!comment) {
            throw new ApiError(404, "Comment not found")
        }

        return res.status(200).json(new ApiResponse(200, comment, "Comment content updated successfully"))

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