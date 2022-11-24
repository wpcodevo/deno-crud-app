import { Application } from "../deps.ts";
import noteRouter from "./note.routes.ts";

function init(app: Application) {
  app.use(noteRouter.prefix("/api/notes/").routes());
}

export default {
  init,
};
