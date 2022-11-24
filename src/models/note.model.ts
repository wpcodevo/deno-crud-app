import { Model, DataTypes } from "../deps.ts";

class NoteModel extends Model {
  static table = "notes";

  static fields = {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: { type: DataTypes.STRING, unique: true },
    content: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATETIME, allowNull: true },
    updatedAt: { type: DataTypes.DATETIME, allowNull: true },
  };
}

export default NoteModel;
