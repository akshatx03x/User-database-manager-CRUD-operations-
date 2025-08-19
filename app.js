const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const usermodel = require("./Models/user");


mongoose.connect("mongodb://127.0.0.1:27017/testapp1")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("xyz");
});

app.get("/read", async (req, res) => {
  let users = await usermodel.find();
  res.render("read", { users });
});
app.get("/delete/:id", async (req, res) => {
  try {
    await usermodel.findByIdAndDelete(req.params.id);
    res.redirect("/read");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Failed to delete user.");
  }
});


app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;
  const createduser = await usermodel.create({ name, email, image });
  res.redirect("/read");
});

app.get("/edit/:id", async (req, res) => {
  try {
    const user = await usermodel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("edit", { user });
  } catch (err) {
    console.error("Error fetching user for edit:", err);
    res.status(500).send("Failed to load edit form");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { name, email, image } = req.body;
    await usermodel.findByIdAndUpdate(req.params.id, { name, email, image });
    res.redirect("/read");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Failed to update user");
  }
});
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});