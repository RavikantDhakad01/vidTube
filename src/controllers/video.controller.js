import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudnary.js"
import Video from "../models/video.models.js"
import mongoose from "mongoose"

const publishVideo = async (req, res, next) => {

    try {

        const { description, title } = req.body

        if (!description || !title) {
            throw new ApiError(400, "Both Title and description are required")
        }

        const videoFileLocalPath = req.files?.videoFile[0]?.path
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path

        if (!videoFileLocalPath) {
            throw new ApiError(400, "Video file is missing")
        }
        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail file is missing")
        }

        const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

        if (!videoFile?.url) {
            throw new ApiError(500, "Something went wrong while uploading video")
        }
        if (!thumbnailFile?.url) {
            throw new ApiError(500, "Something went wrong while uploading Thumbnail")
        }

        try {
            const video = await Video.create({
                videoFile: videoFile?.url,
                thumbnail: thumbnailFile?.url,
                title,
                description,
                duration: videoFile?.duration || 0,
                owner: req.user?._id
            })



            if (!video) {
                throw new ApiError("404", "Something went wrong while saving video")
            }

            return res.status(201).json(new ApiResponse(201, video, "Video uploaded successfully"))

        } catch (error) {

            console.log("Something went wrong while saving video", error);

            if (videoFile?.url) {
                await deleteFromCloudinary(videoFile.public_id)
            }

            if (thumbnailFile?.url) {
                await deleteFromCloudinary(thumbnailFile.public_id)
            }

            throw new ApiError(500, "Something went wrong while saving video")
        }

    }

    catch (error) {
        next(error)
    }
}

export {
    publishVideo
}