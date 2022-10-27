# NodeJs application connecting to a Mongodb database
This application connects to a mongodb instance and performs `CRUD` operations on the selected database collection.


## Implemented
1. JWT Authentication
2. MVC architecture
3. Custom middewares
   - Error middleware
   - Logger middleware
   - Authentication middleware

## Environment variables
1. PORT
2. MONGO_URL
3. ACCESS_SECRET
4. REFRESH_SECRET

### How it works
- There  are two schemas defined in the `model` folder; `blogSchema` and `userModel`.
- A blog has to have a specific user attached to it thus in `blogSchema` you have to define a reference field to the `user schema` and set it as the `default ObjectId` of the blog.
- A user can fetch all blogs or a single blog by providing a `bearer token(access token)` and the `id` for a single blog.
A user can not edit or delete a blog which does not belong to him.

- `REMEMBER` for all the operations to be performed effectively a client has to provide an `access token`.

- In a case where an `access token` has expired there is a `refresh token` route handler where one can refresh to get a new `access token`.

- Also there is a `logout` handler to handle logout.
  
- The `access token` is stored in `httpOnly` `cookies` which makes it `secure` from any form of malpractises.

### Running
1. You can either `git clone` the repo or `download` the source code 
2. After step one above run `npm install` in the root directory.
3. Create a `.env` file and paste the above environment variables.
4. Run a `mongodb instance`.
5. In the project root directory run `npm run start` and see the magic.


---
Authorisation middleware to be implemented soon...# nodejs-mongo-rest
