import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import authenticateJWT from "./middlewares/authenticateJWT.js";
import { register, login } from "./controllers/auth.js";
import {
  addEnquiry,
  claimEnquiries,
  getClaimedEnquiries,
  getUnclaimedEnquiries,
} from "./controllers/enquiries.js";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
config();

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;

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

// employee registration endpoint
app.post("/api/auth/register", register);

// employee login endpoint
app.post("/api/auth/login", login);

// add Enquiry
app.post("/api/enquiries", addEnquiry);

// unclaimed enquiries endpoint
app.get("/api/enquiries/unclaimed", authenticateJWT, getUnclaimedEnquiries);

// claimed enquiries endpoint
app.get("/api/enquiries/claimed", authenticateJWT, getClaimedEnquiries);

// claim enquiry endpoint
app.put("/api/enquiries/:id/claim", authenticateJWT, claimEnquiries);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
