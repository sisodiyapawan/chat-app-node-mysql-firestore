const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

const errorResponse = (res, statusCode = 500, message = 'Error') => {
    return res.status(statusCode).json({
        status: 'failed',
        message
    });
} 

module.exports = {
    successResponse,
    errorResponse
};