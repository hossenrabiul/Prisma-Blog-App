import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

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

const getMyPost = async(authorId : string)=>{
  return await prisma.post.findMany({
    where : {
      authorId : authorId
    }
  })
}

// Export all the function
export const postServices = {
  getAllPost,
  createPost,
  getPostById,
  getMyPost,
};
