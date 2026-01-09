import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, userRole } from "../../middlewares/auth";

const route = Router();

route.get(
  "/:id",
  auth(userRole.USER, userRole.ADMIN),
  commentController.getCommentById
);
route.get(
  "/author/:authorId",
  auth(userRole.USER, userRole.ADMIN),
  commentController.getCommentByAuthorId
);
route.patch(
  "/:id",
  auth(userRole.USER, userRole.ADMIN),
  commentController.updateComment
);
route.patch(
  "/:commentId/moderate",
  auth(userRole.ADMIN),
  commentController.moderateComment
);
route.post(
  "/",
  auth(userRole.USER, userRole.ADMIN),
  commentController.createComment
);

route.delete(
  "/:id",
  auth(userRole.USER, userRole.ADMIN),
  commentController.deleteCommentById
);

export const commentRoute: Router = route;
