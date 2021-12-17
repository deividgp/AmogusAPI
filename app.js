import dotenv from 'dotenv';
import express from 'express';
import mongodb from 'mongodb';
import getWords from './fetchWords.js';
dotenv.config();
const app = express();

const client = new mongodb.MongoClient(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(async (err, client) => {
    if (err) throw err;
    const db = client.db('amogusapi');
    // const words = await getWords();
    // db.collection("words").insertMany(words);
    app.get('/words', async (req, res) => {
        let num = Number(req.query.count) || 1;

        //num = num > 10 ? 10 : num;
        const cursor = db.collection('words').aggregate(
            [
                { $sample: { size: num } },
                {
                    $project: {
                        _id: 0,
                        word: 1,
                    },
                },
            ]);

        const documents = [];
        await cursor.forEach((document) => documents.push(document));
        res.setHeader('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );

        res.send(documents);
    });

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
}
)