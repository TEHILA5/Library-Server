export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      fixMe: 'http://localhost:5000/index.html'
    }
  });
};


export const errorHandler = (err, req, res, next) => {
  const stat = err.status ?? 500;
  const { message = 'Server Error!' } = err;

  // תמיד מחזירים את אותה תבנית
  res.status(stat).json({
    error: {
      message: message,
      fixMe: 'http://localhost:5000/index.html'
    },
    type: 'server error'
  });
};
