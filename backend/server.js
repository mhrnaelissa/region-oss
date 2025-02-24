import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import regionRoutes from "./routes/regionRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", regionRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}/api/regions`);
});
