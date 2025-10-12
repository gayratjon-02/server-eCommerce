import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import cookieParser from "cookie-parser";

import router from "./router";
import routerAdmin from "./router-admin";
import { MORGAN_FORMAT } from "./libs/types/config";
import { T } from "./libs/types/common";

const app = express();

/** 1) STATIC */
app.use(express.static(path.join(__dirname, "public"))); // → /css, /js, /img (dist/public)
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // ← host: backend/uploads
app.use("/productsImg", express.static(path.join(__dirname, "../productsImg"))); // ← host: backend/productsImg

/** 2) CORE MWs */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT || "dev"));

/** 3) SESSION (Mongo store) */
const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});
app.use(
  session({
    secret: String(process.env.SESSION_SECRET || "secret"),
    cookie: { maxAge: 1000 * 3600 * 6 },
    store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  const s = req.session as T;
  res.locals.member = s?.member;
  next();
});

/** 4) VIEWS (EJS) */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 5) ROUTES */
app.use("/admin", routerAdmin); // SSR
app.use("/", router); // API/SPA

export default app;
