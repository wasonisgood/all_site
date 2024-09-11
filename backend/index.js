const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getJusticeById, updateJusticeById, getAllJustices } = require('./db');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// 獲取法官詳細資料
app.get('/api/justice/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const justice = await getJusticeById(id);
        if (!justice) {
            return res.status(404).send('Justice not found');
        }
        res.send(justice);
    } catch (err) {
        res.status(500).send('Error fetching justice data');
    }
});

// 更新法官資料
app.put('/api/justice/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await updateJusticeById(id, updatedData);
        if (result.matchedCount === 0) {
            return res.status(404).send('Justice not found');
        }
        res.send('Justice updated successfully');
    } catch (err) {
        res.status(500).send('Error updating justice data');
    }
});

// 獲取所有大法官資料
app.get('/api/justices', async (req, res) => {
    try {
        const justices = await getAllJustices();
        res.send(justices);
    } catch (err) {
        res.status(500).send('Error fetching justices data');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
