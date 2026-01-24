import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import router from "./routes/indexRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sessionMiddleware from "./middleware/session.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(helmet());
app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type' ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log('Incoming Cookie Header:', req.headers.cookie);
  next();
});
app.use(sessionMiddleware);

app.use("/", router);
app.use(errorHandler);

export default app;