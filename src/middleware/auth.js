const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // In a real app, verify the token here
  next();
};

module.exports = auth;
