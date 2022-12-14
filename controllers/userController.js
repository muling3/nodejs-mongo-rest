const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

const jwt = require("jsonwebtoken");

//Returns a list of all the users from the database
const getUsers = asyncHandler(async (req, res) => {
  //getting all the users
  const users = await User.find().sort({ _id: -1 });

  return res.status(200).json({ users, ok: true });
});

//Returns an object of the requested user
//Search by username in query params
const getUser = asyncHandler(async (req, res) => {
  const { username } = req.query;
  if (!username) {
    res.status(400);
    throw new Error("Invalid username");
  }

  const user = await User.findOne({ username });

  //confirm whether user exists
  if (!user) {
    res.status(400);
    throw new Error("Invalid username");
  }

  return res.status(200).json({ user, ok: true });
});

// returns the reguistered user
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  //return a bad request if all the fields  have not been provided
  if (!username && !password) {
    res.status(400);
    throw new Error("Please ensure all fields");
  }

  //check from the database whether a user exists with such username and email
  const user = await User.findOne({ username, password });

  if (!user) {
    res.status(400);
    throw new Error("Invalid login details");
  }

  //create an accessToken ::  expires in 10 minutes
  const accessToken = jwt.sign(
    { username, roles: user.roles },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "600s",
    }
  );

  //create an refreshToken :: expires in 1 day
  const refreshToken = jwt.sign({ username }, process.env.REFRESH_SECRET, {
    expiresIn: "1d",
  });

  //add refreshToken in cookies
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  //update the refresh token value in the database
  await User.findOneAndUpdate(
    { refreshToken: user.refreshToken },
    { $set: { refreshToken } },
    { new: true }
  );

  //send the accessToken to the user
  return res.status(200).json({ accessToken, ok: true });
});

// returns the reguistered user
const registerUser = asyncHandler(async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  //return a bad request if all the fields  have not been provided
  if (!username && !firstname && !lastname && !email && !password) {
    res.status(400);
    throw new Error("Please ensure all fields");
  }

  //check from the database whether a user exists with such username and email
  const user = await User.findOne({ username });

  if (user) {
    if (user.username == username) {
      res.status(409);
      throw new Error("Username already taken");
    }

    if (user.email == email) {
      res.status(409);
      throw new Error("Email already exists");
    }
  }

  //TODO: Encrypt password

  //proceed with saving the user in the db
  const newUser = await User.create(req.body);

  return res.status(201).json({ newUser, ok: true });
});

//referesh accessToken
const refresh = asyncHandler(async (req, res) => {
  //get cookies from the request object
  const cookies = req.cookies;
  const refreshToken = cookies.jwt;

  //check if jwt is present
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Not authorised", ok: false });
  }

  //check from the database whether there is such refresh token
  const user = await User.findOne({ refreshToken });

  //verify the refresh token
  jwt.verify(cookies.jwt, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token", ok: false });
    }
    
    //create another accessToken ::  expires in 10 minutes
    const accessToken = jwt.sign(
      { username: decoded.username, roles: user.roles },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "600s",
      }
    );

    return res.status(200).json({ accessToken, ok: true });
  });
});

//logout to clear cookies
const logout = asyncHandler(async (req, res) => {
  //get cookies from the request object
  const cookies = req.cookies;

  //check if jwt is present
  if (!cookies?.jwt) {
    res.status(401);
    throw new Error("Not authorised");
  }

  const refreshToken = cookies.jwt;

  //find the user with the same username in the database

  await User.findOneAndUpdate(
    { refreshToken },
    { $set: { refreshToken: "" } },
    { new: true }
  );

  //clear cookies and delete the refresh token from the databse
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: 'none',
  });

  res.status(200).json({ message: "successful" });
});

// returns the user with the new updated password
const changePass = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  //return a bad request if all the fields  have not been provided
  if (!username && !password) {
    res.status(400);
    throw new Error("Please ensure all fields");
  }

  //get the user from the database
  const user = await User.findOne({ username });

  //ensure that the user is found
  if (!user) {
    res.status(400);
    throw new Error("Invalid username");
  }

  //change the password
  const userUpdatedPass = await User.findOneAndUpdate(
    {
      username,
    },
    { $set: { password } },
    { new: true }
  );

  return res.status(201).json({ userUpdatedPass, ok: true });
});

// returns the user object which has been deleted
const deleteUser = asyncHandler(async (req, res) => {
  if (!req.query.username) {
    res.status(403);
    throw new Error("No username provided");
  }

  //fetch the user with such username
  const user = await User.findOne({ username: req.query.username });

  //confirm if user exxists else throw an error
  if (!user) {
    res.status(400);
    throw new Error("Invalid username");
  }

  const deletedUser = await User.deleteOne({ username: user.username });
  return res.status(200).json({ deletedUser: `${user.username}`, ok: true });
});

// returns the user object which has been added a new role
const addUserRole = asyncHandler(async (req, res) => {
  if (!req.query.username || !req.query.role) {
    res.status(403);
    throw new Error("Please provide username and role");
  }

  //fetch the user with such username
  const user = await User.findOne({ username: req.query.username });

  //confirm if user exxists else throw an error
  if (!user) {
    res.status(400);
    throw new Error("Invalid username");
  }

  //add role to user
  const userUpdatedRole = await User.findOneAndUpdate(
    {
      username: req.query.username,
    },
    { $set: { roles: [...user.roles, req.query.role] } },
    { new: true }
  );

  return res.status(201).json({ userUpdatedRole, ok: true });
});

// returns the user object which has been stripped a role
const removeUserRole = asyncHandler(async (req, res) => {
  if (!req.query.username || !req.query.role) {
    res.status(403);
    throw new Error("Please provide username and role");
  }

  //fetch the user with such username
  const user = await User.findOne({ username: req.query.username });

  //confirm if user exxists else throw an error
  if (!user) {
    res.status(400);
    throw new Error("Invalid username");
  }

  //create new user roles
  let roles = user.roles.filter((role) => role != req.query.role);

  //add role to user
  const userUpdatedRole = await User.findOneAndUpdate(
    {
      username: req.query.username,
    },
    { $set: { roles } },
    { new: true }
  );

  return res.status(201).json({ userUpdatedRole, ok: true });
});

module.exports = {
  getUser,
  getUsers,
  registerUser,
  changePass,
  deleteUser,
  refresh,
  logout,
  login,
  addUserRole,
  removeUserRole,
};
