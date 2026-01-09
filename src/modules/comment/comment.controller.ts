import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    req.body.authorId = req?.user?.id;
    const result = await commentServices.createComment(req.body);
    // Return client response
    res.status(201).json({
      success: true,
      message: "Comment created successfully !",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failded to create comment",
      error: error.message,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const result = await commentServices.getCommentById(
      req.params.id as string
    );
    res.status(200).json({
      success: true,
      message: "Comment retrived successfully !",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failded to retrived comment",
      error: error.message,
    });
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentServices.getCommentByAuthorId(
      authorId as string
    );
    res.status(200).json({
      success: true,
      message: "Comment retrived successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failded to get comment",
      error: error.message,
    });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authorId = req?.user?.id;
    const result = await commentServices.deleteCommentById(
      authorId as string,
      id as string
    );
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failded to delete comment",
      error: error.message,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authorId = req?.user?.id;
    const result = await commentServices.updateComment(
      id as string,
      req.body,
      authorId as string
    );
    res.status(200).json({
      success: true,
      message: "Comment updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failded to update comment",
      error: error.message,
    });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Comment status updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: (error instanceof Error) ? error.message : "Failded to update comment status",
      error: error.message,
    });
  }
};
export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteCommentById,
  updateComment,
  moderateComment
};
