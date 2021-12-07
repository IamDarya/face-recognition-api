const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/getProfile");
const image = require("./controllers/image");
const cors = require("cors");
const hash = require("bcrypt-nodejs");
const bcrypt = require("bcrypt-nodejs");
const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex");

const DBpostgres = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req: any, res: any) => {
  res.send("success");
});

app.post("/signIn", (req: any, res: any) => {
  signIn.handleSignIn(req, res, bcrypt, DBpostgres);
});

app.post("/register", (req: any, res: any) => {
  register.handleRegister(req, res, bcrypt, DBpostgres);
});

app.get("/profile/:id", (req: any, res: any) => {
  profile.getProfileById(req, res, DBpostgres);
});

app.put("/image", (req: any, res: any) => {
  image.handleImage(req, res, DBpostgres);
});

app.post("/imageURL", (req: any, res: any) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

/*
--> res = this is working
/signIn --> POST = success/fail
/register --> POST = newUser
/profile/:userId --> GET = user
/image --> PUT --> updatedUser
*/
