import { Router } from "../deps.ts";
import noteController from "../controllers/note.controller.ts";
import { createNoteSchema, updateNoteSchema } from "../schema/note.schema.ts";
import validate from "../validate.ts";

const router = new Router();

router.get<string>("/", noteController.findAllNotesController);
router.post<string>(
  "/",
  validate(createNoteSchema),
  noteController.createNoteController
);
router.patch<string>(
  "/:noteId",
  validate(updateNoteSchema),
  noteController.updateNoteController
);
router.get<string>("/:noteId", noteController.findNoteController);
router.delete<string>("/:noteId", noteController.deleteNoteController);

export default router;
