const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode !== 200 ? res.statusCode : 500
  
    res.status(statusCode).json({
      success: false,
      error: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : null
    })
  }
  
  module.exports = errorHandler