const handleRegister = (req: any, res: any, bcrypt: any, DBpostgres: any) => {
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
};

module.exports = {
  handleRegister: handleRegister,
};
