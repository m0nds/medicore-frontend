import type { ApiResponse } from "@/types";
import type { UpdateUserModel, User } from "@/types/user.type";
import service from "./service"

export const userService = {
  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await service.get(`/users/me`);
    return response.data;
  },
  updateUser: async (data: UpdateUserModel): Promise<ApiResponse<User>> => {
    const response = await service.patch(`/users/me`, data);
    return response.data;
  },
}