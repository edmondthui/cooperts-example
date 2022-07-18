import KanbanDB from "kanbandb";
import Task from "taskarian";

export const connectToKanbanDB = async () => {
  const db = await KanbanDB.connect("testDB");
  return db;
};

export const getCards = (obj: any) => {
  return Task.fromPromise(() => obj.db.getCards());
};
