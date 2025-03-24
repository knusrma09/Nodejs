const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Dummy Users Data
const users = [];

// Routes
app.get("/", (req, res) => res.render("home"));

app.get("/login", (req, res) => res.render("login", { error: "" }));
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

app.get("/signup", (req, res) => res.render("signup", { error: "" }));
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.render("signup", { error: "User already exists!" });
  }

  users.push({ email, password });
  res.redirect("/login");
});

// Protected Route
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

app.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("profile", { user: req.session.user });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
