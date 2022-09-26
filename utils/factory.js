const { asyncCatch } = require("./asyncCatch");
const GlobalError = require("../error/GlobalError");

const deleteOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    const deletedDocument = await Model.findOneAndRemove({
      _id: id,
      creator: req.user._id,
    });

    if (!deletedDocument) return next(new GlobalError("`Invalid ID`", 404));
    res.json({ success: true });
  });

const getOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    const tour = await Model.findById(id);

    if (!tour) return next(new GlobalError("`Invalid ID`", 404));

    res.json({ success: true, data: { tour } });
  });

const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports = { deleteOne, getOne, getMe };
