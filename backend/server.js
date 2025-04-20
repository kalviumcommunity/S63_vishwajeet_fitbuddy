const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

dotenv.config();
const app = express();
const PORT = 5000;

connectDB();
app.use(express.json()); // Needed for POST request parsing

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔥 This line connects /api/users to the router
app.use("/api", userRoutes);

app.get('/', (req, res) => {
  res.send("COOL ITS FITBUDDY!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
