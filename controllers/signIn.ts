const handleSignIn = (req: any, res: any, bcrypt: any, DBpostgres: any) => {
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
};

module.exports = {
  handleSignIn: handleSignIn,
};
