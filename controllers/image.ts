const handleImage = (req: any, res: any, DBpostgres: any) => {
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
};

module.exports = {
  handleImage: handleImage,
};
