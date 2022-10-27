const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //get authorization header
  const authorization = req.headers.authorization || req.headers.Authorization;

  if (authorization && authorization.startsWith("Bearer")) {
    //split and get index 1
    let token = authorization.split(" ")[1];

    //verify the token
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid token", ok: false });

      req.username = decoded.username;
      console.log("Username -> " + req.username);
      next();
    });
  } else {
    return res.status(401).json({ message: "Not Authorized", ok: false });
  }
};
