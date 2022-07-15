import KanbanDB from "kanbandb";


export const connectToKanbanDB = async () => {
    const db = await KanbanDB.connect("testDB");
    return db
}