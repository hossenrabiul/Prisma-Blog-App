import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { userRole } from "../../middlewares/auth";

const createPost = async (
  body: { title: string; content: string; tags: string[] },
  id: string
) => {
  const data = {
    title: body.title,
    content: body.content,
    tags: body.tags,
    authorId: id,
  };
  const result = await prisma.post.create({ data });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  // console.log(tags)
  const addConditions: PostWhereInput[] = [];
  if (search) {
    addConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }
  if (tags?.length > 0) {
    addConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (isFeatured != undefined) {
    addConditions.push({ isFeatured });
  }

  if (status) {
    addConditions.push({
      status,
    });
  }

  if (authorId) {
    addConditions.push({
      authorId,
    });
  }
  //   Callling the database
  const results = await prisma.post.findMany({
    take: limit,
    skip: skip,
    where: {
      AND: addConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      comments: {
        where: {
          parentId: null,
        },
        include: {
          replies: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: addConditions,
    },
  });

  return {
    data: results,
    total,
    currentPage: page,
    totalPage: Math.ceil(total / limit),
  };
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              include: {
                replies: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return post;
  });

  if (!result) {
    return "No post found with this ID!";
  }
  return result;
};

const getMyPost = async (authorId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
  });
  if (!user) {
    throw new Error("Your account is not active!");
  }
  const post = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    include: {
      comments: true,
      _count: true,
    },
  });

  const total = await prisma.post.count({
    where: {
      authorId: authorId,
    },
  });
  return {
    data: post,
    total,
  };
};

const updateMyPost = async (
  isAdmin: boolean,
  authorId: string,
  data: { content ?: string, isFeatured ?: boolean },
  postId: string
) => {
  const postData = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!postData) {
    throw new Error("Not post found!");
  }
  if(!isAdmin && (postData?.authorId !== authorId)){
    throw new Error("You are not the owner of the post")
  }
  if(!isAdmin){
    delete data.isFeatured
  }
  return await prisma.post.update({
    where: {
      id: postData.id,
    },
    data : data
  });
};
// Export all the function
export const postServices = {
  getAllPost,
  createPost,
  getPostById,
  getMyPost,
  updateMyPost,
};
