import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudnary.js"
import Video from "../models/video.models.js"
import User from "../models/user.models.js"

const publishVideo = async (req, res, next) => {

    try {
        const { description, title } = req.body

        if (!description?.trim() || !title?.trim()) {
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
                throw new ApiError(500, "Something went wrong while saving video")
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

const getAllVideos = async (req, res, next) => {
    try {

        let {
            page = 1,
            limit = 10,
            query,
            sortBy = "createdAt",
            sortType = "desc",
            userId
        } = req.query

        page = Number(page)
        limit = Number(limit)

        const skip = (page - 1) * limit

        const filter = {}

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        }
        if (userId) {
            filter.owner = userId
        }
        const sort = {}

        sort[sortBy] = sortType === "asc" ? 1 : -1

        const videos = await Video.find(filter).sort(sort).skip(skip).limit(limit)
        const totalVideos = await Video.countDocuments(filter)

        return res.status(200).json(new ApiResponse(200, { videos, totalVideos }, "videos fetched successfully"))

    } catch (error) {
        next(error)
    }
}

const getVideoById = async (req, res, next) => {
    try {

        const { id } = req.params

        const video = await Video.findByIdAndUpdate(id,
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!video) {
            throw new ApiError(404, "video not found")
        }

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: {
                    watchHistory: video._id
                }
            }
        )
        return res.status(200).json(new ApiResponse(200, video, "Video fetched succeffully"))

    } catch (error) {
        next(error)
    }
}

const deleteVideo = async (req, res, next) => {

    try {

        const { id } = req.params
        const video = await Video.findById(id)

        if (!video) {
            throw new ApiError(404, "video not found")
        }
        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized access")
        }
        const videoUrl = video.videoFile
        const thumbnailUrl = video.thumbnail

        const videoPublic_id = videoUrl?.split("/")?.pop()?.split(".")[0]
        const thumbnailPublic_id = thumbnailUrl?.split("/")?.pop()?.split(".")[0]

        await deleteFromCloudinary(videoPublic_id, "video")
        await deleteFromCloudinary(thumbnailPublic_id)

        await Video.findByIdAndDelete(id)

        return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"))

    } catch (error) {
        next(error)
    }
}

const togglePublishStatus = async (req, res, next) => {

    try {
        const { id } = req.params
        const video = await Video.findById(id)

        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized access")
        }

        video.isPublished = !video.isPublished
        await video.save({ validateBeforeSave: false })

        return res.status(200).json(new ApiResponse(200, video, "Publish status changed successfully"))

    } catch (error) {
        next(error)
    }
}


const updateVideo = async (req, res, next) => {

    try {

        const { id } = req.params
        const { title, description } = req.body || {}
        const thumbnail = req.file

        const video = await Video.findById(id)

        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        if (thumbnail) {
            const oldThumbnailUrl = video.thumbnail

            const newThumbnailFile = await uploadOnCloudinary(thumbnail?.path)

            if (!newThumbnailFile?.url) {
                throw new ApiError(500, "File upload failed")
            }

            video.thumbnail = newThumbnailFile?.url

            if (oldThumbnailUrl) {
                const public_id = oldThumbnailUrl?.split("/")?.pop()?.split(".")[0]
                await deleteFromCloudinary(public_id)
            }

        }

        if (title?.trim()) {
            video.title = title.trim()
        }

        if (description?.trim()) {
            video.description = description.trim()
        }

        if (!title?.trim() && !description?.trim() && !thumbnail) {
            throw new ApiError(400, "No data provided to update")
        }

        await video.save({ validateBeforeSave: false })

        return res.status(200).json(new ApiResponse(200, video, "Video details are changed successfully"))

    } catch (error) {
        next(error)
    }
}


export {
    publishVideo,
    getAllVideos,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
    updateVideo
}