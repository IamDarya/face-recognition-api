const Clarifai = require("clarifai");

const appClarifai = new Clarifai.App({
  apiKey: "5228c4b5259e489183b3b39d2ac2dd40",
});

const handleApiCall = (req: any, res: any) => {
  appClarifai.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data: any) => {
      res.json(data);
    })
    .catch((err: Error) => res.status(400).json("unable response with data"));
};

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
  handleApiCall: handleApiCall,
};
