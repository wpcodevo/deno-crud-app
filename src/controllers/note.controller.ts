import { RouterContext } from "../deps.ts";
import NoteModel from "../models/note.model.ts";
import type {
  CreateNoteInput,
  UpdateNoteInput,
} from "../schema/note.schema.ts";

// [...] CREATE Route Middleware
const createNoteController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { title, category, content }: CreateNoteInput = await request.body()
      .value;

    const createdAt = new Date();
    const updatedAt = createdAt;

    const payload = {
      title,
      content,
      category: category ? category : "",
      createdAt,
      updatedAt,
    };
    const { lastInsertId } = (await NoteModel.create(payload)) as unknown as {
      affectedRows: number;
      lastInsertId: number;
    };

    const note = await NoteModel.where("id", lastInsertId).first();

    response.status = 201;
    response.body = {
      status: "success",
      note,
    };
  } catch (error) {
    console.log(error);
    if ((error.message as string).includes("UNIQUE constraint failed")) {
      response.status = 409;
      response.body = {
        status: "fail",
        message: "Note with that title already exists",
      };
      return;
    }
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] UPDATE Route Middleware
const updateNoteController = async ({
  params,
  request,
  response,
}: RouterContext<string>) => {
  try {
    const payload: UpdateNoteInput["body"] = await request.body().value;

    const { affectedRows } = (await NoteModel.where("id", params.noteId).update(
      {
        ...payload,
        updatedAt: new Date(),
      }
    )) as unknown as { affectedRows: number };

    if (affectedRows === 0) {
      response.status = 404;
      response.body = {
        status: "fail",
        message: "No note with that Id exists",
      };
      return;
    }

    const note = await NoteModel.where("id", params.noteId).first();

    response.status = 200;
    response.body = {
      status: "success",
      note,
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] Single READ Route Middleware
const findNoteController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const note = await NoteModel.where("id", params.noteId).first();

    if (!note) {
      response.status = 404;
      response.body = {
        status: "success",
        message: "No note with that Id exists",
      };
      return;
    }

    response.status = 200;
    response.body = {
      status: "success",
      note,
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] Multiple READ Route Middleware
const findAllNotesController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const page = request.url.searchParams.get("page");
    const limit = request.url.searchParams.get("limit");
    const intPage = page ? parseInt(page) : 1;
    const intLimit = limit ? parseInt(limit) : 10;
    const skip = (intPage - 1) * intLimit;

    const notes = await NoteModel.offset(skip).limit(intLimit).get();

    response.status = 200;
    response.body = {
      status: "success",
      results: notes.length,
      notes,
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] DELETE Route Middleware
const deleteNoteController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const note = (await NoteModel.where(
      "id",
      params.noteId
    ).delete()) as unknown as { affectedRows: number };

    if (note.affectedRows === 0) {
      response.status = 404;
      response.body = {
        status: "fail",
        message: "No note with that Id exists",
      };
      return;
    }

    response.status = 204;
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

export default {
  createNoteController,
  updateNoteController,
  findNoteController,
  findAllNotesController,
  deleteNoteController,
};
