import express from "express";
import journalRoute from "./journal";
import askRoute from "./ask";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/journal", journalRoute);
app.use("/ask", askRoute);

app.listen(PORT, () => {
  console.log(`Journal AI server is running on http://localhost:${PORT}`);
});
