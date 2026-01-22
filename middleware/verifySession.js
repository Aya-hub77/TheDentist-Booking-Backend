export const verifySession = (req, res, next) => {
    console.log("Session object on request:", req.session);
  if (req.session && req.session.user) {
    console.log("User found:", req.session.user);
    next();
  } else {
    console.log("No user in session");
    res.status(401).json({ message: "Unauthorized" });
  }
};