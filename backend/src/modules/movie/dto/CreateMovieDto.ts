import { z } from "zod";

export const CreateMovieSchema = z.object({
  title: z.string().min(1),
  year: z.string().optional(),
  type: z.string().optional(),     
  imdbID: z.string().optional(),
  posterUrl: z.string().optional(),
});

export type CreateMovieDto = z.infer<typeof CreateMovieSchema>;