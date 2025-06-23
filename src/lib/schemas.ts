import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  recipeText: z.string(),
  img: z.string().url('La imagen debe ser una URL válida'),
});

export const IncomingPostSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  recipes: z.array(RecipeSchema).min(1, 'Debe haber al menos una receta'),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  recipes: z.array(RecipeSchema).min(1, 'Debe haber al menos una receta'),
  createdAt: z.date(), 
  updatedAt: z.date(),
  slug: z.string().min(1, 'El slug es requerido'),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const BlogPostArraySchema = z.array(BlogPostSchema);

export const PostsResponseSchema = ApiResponseSchema(BlogPostArraySchema);

export const PostResponseSchema = ApiResponseSchema(BlogPostSchema);

export type Recipe = z.infer<typeof RecipeSchema>;
export type IncomingPostData = z.infer<typeof IncomingPostSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type PostsResponse = z.infer<typeof PostsResponseSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>; 