import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import objectRoutes from "./routes/objectRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/objects", objectRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: "File is too large. Maximum size is 5MB.",
      LIMIT_FILE_COUNT: "Maximum 5 files allowed.",
    };
    return res.status(400).json({ message: messages[err.code] || `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
  next();
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    process.exit(1);
  });
