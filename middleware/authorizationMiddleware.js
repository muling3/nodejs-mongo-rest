
/**
 * ALLOWED USER ROLES ARE AS BELOW
 *      - ROLE_USER  - can only read
 *      - ROLE_ADMIN - can read and update
 *      - ROLE_SUPER_ADMIN - can read, update, delete and assign or remove roles
 */

module.exports = (req, res, next) => {
  let rolesArray = [];

  let roles = String(req.roles).split(",");
  roles.forEach((element) => {
    rolesArray.push(element);
  });

  if (
    req.method == "DELETE" ||
    (req.method == "PATCH" &&
      req.query.username != null &&
      req.query.role != null)
  ) {
    //require ROLE_SUPER_ADMIN
    console.log("Username: " + req.user + "User roles => " + rolesArray);

    if (
      rolesArray.find((role) => String(role) == "ROLE_SUPER_ADMIN") == undefined
    ) {
      return res.status(401).json({ message: "Not Authorized", ok: false });
    }
  } else if (req.method == "PATCH") {
    //require ROLE_ADMIN
    console.log("Username: " + req.user + "User roles => " + rolesArray);

    if (rolesArray.find((role) => String(role) == "ROLE_ADMIN") == undefined) {
      return res.status(401).json({ message: "Not Authorized", ok: false });
    }
  } else if (req.method == "POST" && req.originalUrl == "/users/login") {
    //require NO ROLE
    console.log("No roles required");
  } else if (
    req.method == "GET" &&
    (req.originalUrl == "/users/logout" || req.originalUrl == "/users/refresh")
  ) {
    //require NO ROLE
    console.log("No roles required");
  } else {
    //require ROLE_USER
    console.log("Username: " + req.user + "User roles => " + rolesArray);

    if (rolesArray.find((role) => String(role) == "ROLE_USER") == undefined) {
      return res.status(401).json({ message: "Not Authorized", ok: false });
    }
  }

  next();
};
