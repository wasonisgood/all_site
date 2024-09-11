const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient('mongodb+srv://admin:admin@tanknews.2mhsoff.mongodb.net/?retryWrites=true&w=majority&appName=tanknews');
const dbName = 'tanknews';
let db;

async function connectToDatabase() {
    if (!db) {
        try {
            await client.connect();
            db = client.db(dbName);
            console.log(`Connected to database: ${dbName}`);
        } catch (err) {
            console.error('Failed to connect to MongoDB:', err);
            throw err; // Re-throw the error after logging it
        }
    }
    return db;
}

async function getJusticeById(id) {
    try {
        const database = await connectToDatabase();
        const objectId = new ObjectId(id);  // 确保将 id 转换为 ObjectId
        return await database.collection('justices').findOne({ _id: objectId });
    } catch (err) {
        console.error('Error fetching justice by ID:', err);
        throw err;
    }
}

async function updateJusticeById(id, updatedData) {
    try {
        const database = await connectToDatabase();
        return await database.collection('justices').updateOne(
            { _id: ObjectId(id) },
            { $set: updatedData }
        );
    } catch (err) {
        console.error('Error updating justice by ID:', err);
        throw err;
    }
}

async function getAllJustices() {
    try {
        const database = await connectToDatabase();
        return await database.collection('justices').find({}).toArray();
    } catch (err) {
        console.error('Error fetching all justices:', err);
        throw err;
    }
}

module.exports = {
    connectToDatabase,
    getJusticeById,
    updateJusticeById,
    getAllJustices,
};
