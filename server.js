const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const errorHandler = require("./middleware/errorMiddleware");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const authMiddleware = require("./middleware/authorisationMidlleware");
const dbConn = require("./config/dbConn");

//db connection
dbConn();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//parsing cookies
app.use(cookieParser());

//custom loggerMiddleware
app.use(loggerMiddleware);

// register user router
app.use("/users", require("./routes/userRouter"));

//protecting blogs
app.use(authMiddleware);
app.use("/blogs", require("./routes/blogRouter"));

//errorMiddleware ::Custom
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Application running on port ${process.env.PORT}`)
);
