import { z } from "../deps.ts";

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    category: z.string().optional(),
  }),
});

const params = {
  params: z.object({
    noteId: z.string(),
  }),
};

export const getNoteSchema = z.object({
  ...params,
});

export const updateNoteSchema = z.object({
  ...params,
  body: z
    .object({
      title: z.string(),
      content: z.string(),
      category: z.string(),
    })
    .partial(),
});

export const deleteNoteSchema = z.object({
  ...params,
});

export type CreateNoteInput = z.TypeOf<typeof createNoteSchema>["body"];
export type GetNoteInput = z.TypeOf<typeof getNoteSchema>["params"];
export type UpdateNoteInput = z.TypeOf<typeof updateNoteSchema>;
export type DeleteNoteInput = z.TypeOf<typeof deleteNoteSchema>["params"];
