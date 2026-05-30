import {ApiError} from "../utils/ApiError.js"

const validateImage = (req, res, next) => {

     if (!req.file) {
        return next(new ApiError(400, "Image file is required"))
    }

    if (!req.file?.mimetype.startsWith("image/")) {
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

export {
    validateImage,
    validateVideo,
    validateImageFiles
}