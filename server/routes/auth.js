import { Express  } from "express";
import {login} from "../controllers/auth"

const router = Express.router();

router.post("/login", login);

export default router