require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  city: String,
  gender: String,
  address: String,
  mobile: String,
  salary: Number,
});

const Employee = mongoose.model("Employee", employeeSchema);

// CREATE
app.post("/addEmployee", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const result = await employee.save();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// READ
app.get("/getEmployees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// UPDATE
app.put("/updateEmployee/:id", async (req, res) => {
  const result = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(result);
});

// DELETE
app.delete("/deleteEmployee/:id", async (req, res) => {
  const result = await Employee.findByIdAndDelete(req.params.id);
  res.json(result);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
