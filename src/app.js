import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

dotenv.config();
const app = express();

// Log
app.use(morgan("dev"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS
app.set("view engine", "ejs");
// Server side rendering

const __dirname =
  "E:\\Full Stack Web Development\\MERN\\Backend\\shreyanCodding";
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use("/", (req, res) => {
  res.render("index");
});

export default app;
