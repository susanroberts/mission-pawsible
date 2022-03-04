import express from "express";
import userSessionsRouter from "./api/v1/userSessionsRouter.js";
import usersRouter from "./api/v1/usersRouter.js";
import clientRouter from "./clientRouter.js";
import missionsRouter from "./api/v1/missionsRouter.js";
import presetsRouter from "./api/v1/presetsRouter.js";

const rootRouter = new express.Router();
rootRouter.use("/", clientRouter);

rootRouter.use("/api/v1/user-sessions", userSessionsRouter);
rootRouter.use("/api/v1/users", usersRouter);
rootRouter.use("/api/v1/:userId/presets", presetsRouter);
rootRouter.use("/api/v1/:userId/missions", missionsRouter);

export default rootRouter;
