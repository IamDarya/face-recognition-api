const cors = require("cors");
const hash = require("bcrypt-nodejs");
const bcrypt = require("bcrypt-nodejs");
const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex");

const DBpostgres = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    port: 5432,
    database: "facerec",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req: any, res: any) => {
  res.send("success");
});

app.post("/signIn", (req: any, res: any) => {
  DBpostgres.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data: any) => {
      const validLogin = bcrypt.compareSync(req.body.password, data[0].hash);
      if (validLogin) {
        return DBpostgres.select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user: any) => {
            res.json(user[0]);
          })
          .catch((err: Error) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong login data");
      }
    })
    .catch((err: Error) => res.status(400).json("wrong login data"));
});

app.post("/register", (req: any, res: any) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  DBpostgres.transaction((trx: any) => {
    trx
      .insert({ hash: hash, email: email })
      .into("login")
      .returning("email")
      .then((loginEmail: any) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user: any) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err: Error) => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req: any, res: any) => {
  const { id } = req.params;
  DBpostgres.select("*")
    .from("users")
    .where({ id })
    .then((user: any) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("user not found");
      }
    });
});

app.put("/image", (req: any, res: any) => {
  const { id } = req.body;
  DBpostgres("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries: any) => {
      if (entries.length) {
        res.json(entries);
      } else {
        res.status(400).json("entries not found");
      }
    });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
--> res = this is working
/signIn --> POST = success/fail
/register --> POST = newUser
/profile/:userId --> GET = user
/image --> PUT --> updatedUser
*/
