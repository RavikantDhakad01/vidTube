import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import User from "../models/user.models.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudnary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {

    try {

        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User does not exist")
        }

        const accessToken = await user.genrateAccessToken()
        const refreshToken = await user.genrateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while genrating tokens")
    }

}

const registerUser = async (req, res, next) => {
    try {

        const { username, email, password, fullName } = req.body

        if ([username, email, password, fullName].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists")
        }
        const avatarLocalPath = req.files?.avatar[0]?.path

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
        }

        let coverImageLocalPath

        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files?.coverImage[0]?.path
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required")
        }
        try {

            const user = await User.create({
                fullName,
                avatar: avatar.url,
                coverImage: coverImage?.url || "",
                username: username.toLowerCase(),
                email,
                password
            })

            const createdUser = await User.findById(user._id).select("-password -refreshToken")

            if (!createdUser) {
                throw new ApiError(500, "Something went wrong while registering the user")
            }

            return res.status(201).json(new ApiResponse(201, createdUser, "user registered successfully"))

        } catch (error) {

            console.log("user creation failed", error)

            if (avatar?.public_id) {
                await deleteFromCloudinary(avatar.public_id)
            }
            if (coverImage?.public_id) {
                await deleteFromCloudinary(coverImage.public_id)
            }
            throw new ApiError(500, "user creation failed")
        }

    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            throw new ApiError(400, "Email or Password is required")
        }

        const user = await User.findOne({
            email
        })

        if (!user) {
            throw new ApiError(404, "user not found")
        }

        if (!await user.isPasswordCorrect(password)) {
            throw new ApiError(401, "invaild credantials")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, createdUser, "User logged in succesfully"))

    } catch (error) {
        next(error)
    }
}

const refreshAccessToken = async (req, res, next) => {

    try {

        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized access")
        }

        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        } catch (error) {
            throw new ApiError(401, "invaild RefreshToken")
        }

        const user = await User.findById(decoded._id)

        if (!user) {
            throw new ApiError(401, "invaild RefreshToken")
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "RefreshToken is invaild or expired")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Tokens are refreshed"))

    } catch (error) {
        next(error)
    }
}

const logoutUser = async (req, res, next) => {
    try {

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
        )
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "user is logged out successfully"))

    } catch (error) {
        next(error)
    }
}

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}