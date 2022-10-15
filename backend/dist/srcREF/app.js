import cors from "cors";
import morgan from "morgan";
import express from "express";
import { regcivRouter } from "./routes/regciv.router.js";
export const app = express();
const whitelist = ["http://localhost:4200"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS :o"));
        }
    }
};
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json());
app.use(regcivRouter);
