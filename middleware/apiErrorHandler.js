function errorHanlder(err, req, res, next) {
  if (err.isApiError) {
    return res.status(err.responseCode).json({
      responseCode: err.responseCode,
      responseMessage: err.responseMessage,
    });
  }

  res.status(500).json({
    responseCode: 500,
    responseMessage: err.message,
  });
}
function unhandledRequest(req, res, next) {
  if (!res.headersSent) {
    // Handle unhandled requests
    return res.status(501).json({
      responseCode: 501,
      responseMessage: "Request is not handled",
    });
  }
}

module.exports = { errorHanlder, unhandledRequest };
