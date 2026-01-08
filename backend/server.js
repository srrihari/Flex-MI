const express = require("express");
const cors = require("cors");

const emiRoutes = require("./routes/emiRoutes");
const simulateRoutes = require("./routes/simulateRoutes");
const metaRoutes = require("./routes/meta");
const transactionRoutes = require("./routes/transaction");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/emi", emiRoutes);
app.use("/api/simulate", simulateRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/transaction", transactionRoutes);

app.get("/", (req, res) => {
  res.send("PulsePay Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
