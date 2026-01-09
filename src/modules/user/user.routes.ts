import { Router } from "express";

import { userController } from "./user.controller";
import { auth, userRole } from "../../middlewares/auth";

const route = Router();

route.patch(
  "/update",
  auth(userRole.ADMIN, userRole.USER),
  userController.updateUser
);

export const userRoute = route;
