export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface OkResponse {
    message: string;
}

export interface VerificationRequest {
    code: string;
  }
  
  export interface ResendVerificationRequest {
    email: string;
  }
  
  export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface ResetPasswordRequest {
    code: string;
    password: string;
  }
  
  export interface VerificationResponse {
    message: string;
  }

export interface UserDTO {
    idUser: number;
    username: string;
    email: string;
    rol: string[];
    dateCreated: string;
    dateUpdated: string;
    imageProfile: string | null;
}

export interface LoginResponse {
    user: UserDTO;
    token: string;
    tokenType: string;
    roles : string[]
}

