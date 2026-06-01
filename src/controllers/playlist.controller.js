import Playlist from "../models/playlist.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import User from "../models/user.models.js"
import Video from "../models/video.models.js"

const createPlaylist = async (req, res, next) => {
    const { name, description } = req.body

    try {
        if (
            !name ||
            !description ||
            typeof name !== "string" ||
            typeof description !== "string" ||
            name.trim() === "" ||
            description.trim() === ""
        ) {
            throw new ApiError(400, "Fields are missing")
        }
        const playlist = await Playlist.create({
            name: name.trim(),
            description: description.trim(),
            owner: req.user._id
        })

        return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"))

    } catch (error) {
        next(error)
    }

}

const getUserPlaylists = async (req, res, next) => {

    const { userId } = req.params
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const playlists = await Playlist.find({
            owner: userId
        })

        return res.status(200).json(new ApiResponse(200, playlists, "playlists fetched successfully"))
    } catch (error) {
        next(error)
    }
}

const getPlaylistById = async (req, res, next) => {
    const { playlistId } = req.params

    try {
        const playlist = await Playlist.findById(playlistId).populate("videos")

        if (!playlist) {
            throw new ApiError(404, "Playlist does not exist")
        }
        return res.status(200).json(new ApiResponse(200, playlist, "playlist fetched successfully"))
    } catch (error) {
        next(error)
    }
}

const addVideoToPlaylist = async (req, res, next) => {
    const { playlistId, videoId } = req.params

    try {
        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "Playlist does not exist")
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "unauthorized access")
        }

        if (playlist.videos.some((video) => video.toString() === videoId)) {
            throw new ApiError(400, "Video already exist in playlist")
        }

        const video = await Video.findById(videoId)

        if (!video) {
            throw new ApiError(404, "Video not found")
        }
        playlist.videos.push(videoId)
        await playlist.save({ validateBeforeSave: false })

        return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"))

    } catch (error) {
        next(error)
    }
}

const removeVideoFromPlaylist = async (req, res, next) => {
    const { playlistId, videoId } = req.params

    try {
        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "Playlist does not exist")
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "unauthorized access")
        }

        if (!playlist.videos.some((video) => video.toString() === videoId)) {
            throw new ApiError(404, "Video does not exist in playlist")
        }

        const remove = playlist.videos.filter((video) => video.toString() !== videoId)
        playlist.videos = remove
        await playlist.save({ validateBeforeSave: false })

        return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"))

    } catch (error) {
        next(error)
    }
}

const deletePlaylist = async (req, res, next) => {
    const { playlistId } = req.params

    try {
        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        if (playlist.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "unauthorized access")
        }

        const deletedPlaylist = await Playlist.findByIdAndDelete(playlist._id)

        return res.status(200).json(new ApiResponse(200, deletedPlaylist, "playlist deleted successfully"))
    } catch (error) {
        next(error)
    }
}

const updatePlaylist = async (req, res, next) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    try {
       
        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "Playlist does not exist")
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "unauthorized access")
        }

         if (name === undefined && description === undefined) {
            throw new ApiError(400, "At least one field is required")
        }

         if (name !== undefined) {

            if (typeof name !== "string" || !name.trim()) {
                throw new ApiError(400, "Invalid name")
            }

            playlist.name = name.trim()
        }

         if (description !== undefined) {

            if (typeof description !== "string" || !description.trim()) {
                throw new ApiError(400, "Invalid description")
            }

            playlist.description = description.trim()
        }
        
        await playlist.save({ validateBeforeSave: false })

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"))

    } catch (error) {
        next(error)
    }
}

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
