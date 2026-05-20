import Playlist from "../models/playlist.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const createPlaylist = async (req, res, next) => {
    const { name, description } = req.body

    if (
        !name ||
        !description ||
        name.trim() === "" ||
        description.trim() === ""
    ) {
        throw new ApiError(400, "Fields are missing")
    }
    try {

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

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
