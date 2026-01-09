import { Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { postServices } from "./post.service";
import { userRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response) => {
  try {
    const id = req?.user?.id;
    const result = await postServices.createPost(req.body, id as string);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get post by filtering
const getAllPost = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    // searchTYpe
    const searchType = typeof search === "string" ? search : undefined;
    // split all tags
    const tags = req.query.tag ? (req.query.tag as string).split(",") : [];
    // console.log(tags)
    // tagsTYpe
    const tagsType = typeof tags === "string" ? tags : [];
    // console.log(typeof tags)
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status
      ? (req.query.status as PostStatus)
      : undefined;

    const authorId = req.query.authorId
      ? (req.query.authorId as string)
      : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    // Callng the service
    const result = await postServices.getAllPost({
      search: searchType,
      tags: tagsType,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      success: true,
      message: "Retrived all posts successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postServices.getPostById(id!);
    res.status(200).json({
      success: true,
      message: "Post retrived successfully.",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const id = req?.user?.id;
    console.log(req.user);
    const result = await postServices.getMyPost(id as string);
    res.status(200).json({
      success: true,
      message: "Post retrived successfully.",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateMyPost = async (req: Request, res: Response) => {
  try {
    const isAdmin = req?.user?.role === userRole.ADMIN;
    const authorId = req?.user?.id;
    const postId = req.params.postId;
    const result = await postServices.updateMyPost(
      isAdmin,
      authorId as string,
      req.body,
      postId as string
    );
    res.status(200).json({
      success: true,
      message: "Post Updated Successfully.",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update post!",
      error: error.message,
    });
  }
};
// Export all the function
export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updateMyPost,
};
