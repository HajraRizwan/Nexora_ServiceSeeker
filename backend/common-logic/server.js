
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const loginRoutes = require("./login");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection (shared auth DB)
mongoose.connect("mongodb://127.0.0.1:27017/nexora_auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Common Login MongoDB Connected"))
.catch((err) => console.error(err));

// Common login route
const loginRoute = require("./login");
app.use("/login", loginRoute);

app.listen(4000, () => console.log("🚀 Common Login Service running on port 4000"));
