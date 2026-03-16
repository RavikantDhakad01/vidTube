import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import User from "../models/user.models.js"

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ","")

        if (!token) {
            throw new ApiError(401, "Unauthorized Access")

        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACESSS_TOKEN_SECRET)
        } catch (error) {
            throw new ApiError(401, "Token is invalid")
        }

        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new ApiError(401, "Token is invalid")
        }

        req.user = user
        next()

    } catch (error) {
        next(error)
    }
}

export { verifyJwt }