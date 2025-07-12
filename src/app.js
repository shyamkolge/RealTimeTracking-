import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Get __dirname safely in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS view engine
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req, res) => {
  console.log(__dirname);
  res.render("index"); // Ensure `views/index.ejs` exists
});

export default app;
