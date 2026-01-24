export const verifySession = (req, res, next) => {
  console.log('Cookies:', req.cookies);
  console.log('SessionID:', req.sessionID);
  console.log('Session object:', req.session);
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};