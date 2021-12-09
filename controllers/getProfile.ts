const getProfileById = (req: any, res: any, DBpostgres: any) => {
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
};

module.exports = {
  getProfileById: getProfileById,
};
