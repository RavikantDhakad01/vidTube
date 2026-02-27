import { ApiResponse } from "../utils/ApiResponse.js"
const HealthCheck = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "server is running..."))
    } catch (error) {
        return next(error)
    }
}
export default HealthCheck