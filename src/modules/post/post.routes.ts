import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middlewares/auth";

const route = Router()

route.get('/', auth(userRole.ADMIN), postController.getAllPost)
route.get('/my-post', auth(userRole.ADMIN, userRole.USER), postController.getMyPost)
route.get('/:id', postController.getPostById)
route.post('/create',auth("ADMIN"), postController.createPost)


export const postRoute = route;