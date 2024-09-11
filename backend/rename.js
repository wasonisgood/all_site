const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const uri = 'mongodb+srv://admin:admin@tanknews.2mhsoff.mongodb.net/?retryWrites=true&w=majority&appName=tanknews';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // 连接到 MongoDB 数据库
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db('tanknews');
        const collection = database.collection('justices');

        // 取得所有的資料
        const allJustices = await collection.find({}).toArray();

        // 用來追蹤處理過的 _id
        const seenIds = new Set();

        for (let justice of allJustices) {
            let id = justice._id.toString();

            // 如果 _id 已經存在
            if (seenIds.has(id)) {
                const newId = new ObjectId();

                // 刪除舊的文檔，插入新的文檔
                const { _id, ...justiceWithoutId } = justice;
                await collection.deleteOne({ _id: justice._id });
                await collection.insertOne({ _id: newId, ...justiceWithoutId });
                
                console.log(`Duplicate _id found. Replaced ${id} with new ObjectId ${newId}`);
            } else {
                // 如果 _id 不是有效的 ObjectId，則生成一個新的
                if (!ObjectId.isValid(id)) {
                    let newId = new ObjectId(id);

                    // 确保新生成的 ObjectId 不會與現有的重複
                    while (await collection.findOne({ _id: newId })) {
                        newId = new ObjectId();
                    }

                    // 刪除舊的文檔，插入新的文檔
                    const { _id, ...justiceWithoutId } = justice;
                    await collection.deleteOne({ _id: justice._id });
                    await collection.insertOne({ _id: newId, ...justiceWithoutId });

                    console.log(`Converted and replaced ${id} with new ObjectId ${newId}`);
                } else {
                    // 如果 _id 有效且唯一，則直接添加到 set 中
                    seenIds.add(id);
                }
            }
        }

        console.log("Duplicate IDs fixed and converted to ObjectId format.");
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        // 关闭数据库连接
        await client.close();
        console.log("MongoDB connection closed.");
    }
}

main();
