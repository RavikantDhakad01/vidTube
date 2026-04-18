import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudnary.js"
import Video from "../models/video.models.js"

const publishVideo = async (req, res, next) => {

    try {

        const { description, title } = req.body

        if (!description && !title) {
            throw new ApiError(401, "Both Title and description are required")
        }

        const videoFileLocalPath = req.files?.videoFile[0]?.path
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path

        if (!videoFileLocalPath) {
            throw new ApiError(401, "Video file is missing")
        }
        if (!thumbnailLocalPath) {
            throw new ApiError(401, "Video file is missing")
        }

        const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

        if (!videoFile?.url) {
            throw new ApiError(404, "Something went wrong while uploading video")
        }
        if (!thumbnailFile?.url) {
            throw new ApiError(404, "Something went wrong while uploading Thumbnail")
        }

        try {
            const video = await Video.create({
                videoFile: videoFile?.url,
                thumbnail: thumbnailFile?.url,
                title,
                description,
                owner: new mongoose.Types.ObjectId(req.user?._id)
            })

            const uploadedVideo = await Video.findById(video._id)

            if (!uploadedVideo) {
                throw new ApiError("404", "Something went wrong while saving video")
            }

            return res.status(200).json(new ApiResponse(200, uploadedVideo, "Video uploaded successfully"))

        } catch (error) {

            console.log("Something went wrong while saving video", error);

            if (videoFile?.url) {
                await deleteFromCloudinary(videoFile.public_id)
            }

            if (videoFile?.url) {
                await deleteFromCloudinary(videoFile.public_id)
            }

            throw new ApiError(404, "Something went wrong while saving video")
        }

    }

    catch (error) {
        next(error)
    }
}

export {
    publishVideo
}