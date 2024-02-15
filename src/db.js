import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(1).stores({
  person: "++id, name, class, school, state", // Primary key and indexed props
});

export function getColumnNames() {
  try {
    const table = db.table("person");
    const schema = table.schema;
    const columns = schema.indexes.map((idx) => idx.name);
    return columns;
  } catch (error) {
    console.error("Error getting column names: ", error);
  }
}

export const saveToDb = async (data) => {
  try {
    await db.transaction("rw", db.person, async () => {
      // Clear the existing entries in the table
      await db.person.clear();

      await db.person.bulkAdd(data);
    });
    console.log("Data successfully saved to Db!");
    return true;
  } catch (error) {
    console.error("Failed to save data to Db:", error);
    return false;
  }
};

export const fetchDataFromDb = async () => {
  try {
    const data = await db.person.toArray();
    return data;
  } catch (error) {
    console.error("Failed to fetch data from Db:", error);
    return [];
  }
};
