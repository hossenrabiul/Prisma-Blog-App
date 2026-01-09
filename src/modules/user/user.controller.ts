import { Request, Response } from "express";
import { userServices } from "./user.service";

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req?.user?.id;

    const result = await userServices.updateUser(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "User status updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

export const userController = {
    updateUser
}
