const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: "122",
      name: "John",
      email: "johnEmail@gmail.com",
      password: "myPassowrd123",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sallyEmail@gmail.com",
      password: "SallyPassowrd123",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req: any, res: any) => {
  res.send(database.users);
});

app.post("/signin", (req: any, res: any) => {
  let userData = database.users.filter((el) => el.email === req.body.email);
  if (userData.length && userData[0].password === req.body.password) {
    res.json("sing in successfully!");
  } else {
    res.status(400).json("error to login");
  }
});

app.post("/register", (req: any, res: any) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "123",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req: any, res: any) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("not found");
  }
});

app.put("/image", (req: any, res: any) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    // can be moved in a function REPEAT
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("not found");
  }
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
