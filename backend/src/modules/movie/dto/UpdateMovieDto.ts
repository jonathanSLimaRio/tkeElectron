import { z } from "zod";

export const UpdateMovieSchema = z.object({
  title: z.string().optional(),
  year: z.string().optional(),
  type: z.string().optional(),
  imdbID: z.string().optional(),
  posterUrl: z.string().optional(),
});

export type UpdateMovieDto = z.infer<typeof UpdateMovieSchema>;
