const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
const PORT = 5000;

connectDB();
app.use(express.json()); // Needed for POST request parsing

// 🔥 This line connects /api/users to the router
app.use("/api", userRoutes);

app.get('/', (req, res) => {
  res.send("COOL ITS FITBUDDY!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
