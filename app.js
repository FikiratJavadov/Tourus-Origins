const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const tours = JSON.parse(fs.readFileSync("./tours-data.json"));

app.get("/tour", (req, res) => {
  res.json({
    success: true,
    data: {
      tours,
    },
  });
});

app.get("/tour/:id", (req, res) => {
  const id = req.params.id;

  const tour = tours.find((t) => t.id == id);

  if (!tour) return res.send({ success: false, message: "Invalid ID" });

  res.json({ success: true, data: { tour } });
});

app.post("/tour", (req, res) => {
  const id = tours[tours.length - 1].id + 1;

  const newTour = { ...req.body, id: id };
  const newTours = [...tours, newTour];

  fs.writeFileSync("./tours-data.json", JSON.stringify(newTours));

  res.json({
    success: true,
    data: {
      newTour,
    },
  });
});

app.get("/tour/id", () => {});
app.get("/tour/id", () => {});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
