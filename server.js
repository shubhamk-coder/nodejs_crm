import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Enquiry from "./models/enquiry.js";
import Employee from "./models/employee.js";
import { config } from "dotenv";

const app = express();
config();

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET;

// connect to MongoDB database
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB database:", err.message);
  });

// middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Authentication failed" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// employee registration endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const employee = new Employee({ name, email, password });
    await employee.save();
    res.json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// employee login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee || employee.password !== password) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ email: employee.email }, jwtSecret);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// public enquiries endpoint
app.get("/api/enquiries/public", async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimed_by: null });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// unclaimed enquiries endpoint
app.get("/api/enquiries/unclaimed", authenticateJWT, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimed_by: null });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// claimed enquiries endpoint
app.get("/api/enquiries/claimed", authenticateJWT, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimed_by: req.user._id });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// claim enquiry endpoint
app.put("/api/enquiries/:id/claim", authenticateJWT, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    if (enquiry.claimed_by) {
      return res.status(400).json({ message: "Enquiry already claimed" });
    }
    enquiry.claimed_by = req.user._id;
    await enquiry.save();
    res.json({ message: "Enquiry claimed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.get("/", (req, res) => {
  res.send("Hello Server!");
});
// start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
