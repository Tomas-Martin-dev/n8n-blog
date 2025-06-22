export interface IncomingPostData {
  title: string;
  description: string;
  recipes: {
    id: string;
    recipeText: string;
    img: string;
  }[];
}

export interface BlogPost {
  id?: string; 
  title: string;
  description: string;
  recipes: {
    id: string;
    recipeText: string;
    img: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  slug: string; 
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 