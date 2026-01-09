import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middlewares/auth";

const route = Router();

route.get("/", auth(userRole.ADMIN), postController.getAllPost);
route.get("/getstats", postController.getStats);
route.get(
  "/my-post",
  auth(userRole.ADMIN, userRole.USER),
  postController.getMyPost
);
route.get("/:id", postController.getPostById);

route.patch(
  "/update/:postId",
  auth(userRole.ADMIN, userRole.USER),
  postController.updateMyPost
);
route.post(
  "/create",
  auth(userRole.ADMIN, userRole.USER),
  postController.createPost
);
route.delete(
  "/:postId",
  auth(userRole.ADMIN, userRole.USER),
  postController.deletePost
);

export const postRoute = route;
