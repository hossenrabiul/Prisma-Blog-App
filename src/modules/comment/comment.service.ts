import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  // Checking whether post exist or not
  const postData = await prisma.post.findUnique({
    where: {
      id: payload.postId,
    },
  });
  if (!postData) {
    throw new Error("Post does not exist with this ID");
  }
  // Checking whether parent comment exist or not
  if (payload.parentId) {
    const parentData = await prisma.comment.findUnique({
      where: {
        id: payload.parentId,
      },
    });
    if (!parentData) {
      throw new Error("Comment does not exist with this ID");
    }
  }
  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      replies: true,
    },
  });
  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId: authorId,
      parentId: null,
    },
    include: {
      replies: true,
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

const deleteCommentById = async (authorId: string, commentId: string) => {
  const commentData = await prisma.comment.findUnique({
    where: {
      id: commentId,
      authorId: authorId,
    },
  });
  if (!commentData) {
    throw new Error("The credentials you provided is invalid!");
  }
  const result = await prisma.comment.delete({
    where: {
      id: commentId,
      authorId: authorId,
    },
  });
  return result;
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string
) => {
  const commentData = await prisma.comment.findUnique({
    where: {
      id: commentId,
      authorId: authorId,
    },
  });
  if (!commentData) {
    throw new Error("The credentials you provided is invalid!");
  }

  const updateComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data,
  });
  return updateComment;
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if(commentData.status === data.status){
    return `Your comment is already ${data.status}`
  }
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
  });
};
export const commentServices = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteCommentById,
  updateComment,
  moderateComment
};
