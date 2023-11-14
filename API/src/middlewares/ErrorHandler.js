class ErrorHandler extends Error {
  constructor(errorType) {
    super(errorType.message);
    this.statusCode = errorType.statusCode;
  }
}
module.exports = ErrorHandler;