import { UserDTO } from "./auth.interface";

export interface UserResponse {
    message: string;
    data: UserDTO;
  }

export interface ListUserResponse {
  message: string;
  data: UserDTO[];
  offset: number;
  limit: number;
  total: number;
}
  
  export interface ImageDTO {
    id: number;
    url: string;
  }
  
  export interface ImageResponse {
    message: string;
    data: ImageDTO[];
  }
  
  
  export interface UpdateUserRequest {
    username: string;
    email: string;
    imageProfile?: string;
  }

  export interface ListImgResponse {
    message: string;
    data: ImageDTO[];
    offset: number;
    limit: number;
    total: number;
  }

export interface UpdateUserRequest {
  username: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Interfaces para el admin
export interface UsersRequest {
  username?: string,
  email?: string,
  role?: string,
  offset?: number,
  limit?: number,
  enabled?: boolean | null
}