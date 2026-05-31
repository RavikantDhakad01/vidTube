import {ApiError} from "../utils/ApiError.js"

const validateRequiredImage = (req, res, next) => {

     if (!req.file) {
        return next(new ApiError(400, "Image file is required"))
    }

    if (!req.file?.mimetype.startsWith("image/")) {
        return next(new ApiError(400, "Only images are allowed"))
    }
    next()
}

const validateOptionalImage = (req, res, next) => {

    if (!req.file) {
        return next()
    }

    if (!req.file.mimetype.startsWith("image/")) {
        return next(new ApiError(400, "Only images are allowed"))
    }

    next()
}

const validateVideo = (req, res, next) => {

    if (!req.file) {
        return next(new ApiError(400, "Video file is required"))
    }

    if (!req.file?.mimetype.startsWith("video/")) {
        return next(new ApiError(400, "Only videos are allowed"))
    }
    next()
}

const validateImageFiles = (req, res, next) => {
    const avatar = req.files?.avatar?.[0]
    const coverImage = req.files?.coverImage?.[0]

     if (!avatar) {
        return next(new ApiError(400, "Avatar file is required"))
    }
    
    if (avatar && !avatar.mimetype.startsWith("image/")) {
        return next(new ApiError(400, "Avatar must be an image"))
    }

    if (coverImage && !coverImage.mimetype.startsWith("image/")) {
        return next(new ApiError(400, "Cover image must be an image"))
    }

    next()
}

const validateVideoFiles = (req, res, next) => {

    const videoFile = req.files?.videoFile?.[0]
    const thumbnail = req.files?.thumbnail?.[0]

    if (!videoFile) {
        return next(new ApiError(400, "Video file is required"))
    }

    if (!thumbnail) {
        return next(new ApiError(400, "Thumbnail file is required"))
    }

    if (!videoFile.mimetype.startsWith("video/")) {
        return next(new ApiError(400, "Video file must be a video"))
    }

    if (!thumbnail.mimetype.startsWith("image/")) {
        return next(new ApiError(400, "Thumbnail must be an image"))
    }

    next()
}

export {
   validateRequiredImage,
   validateOptionalImage,
    validateVideo,
    validateImageFiles,
    validateVideoFiles
}