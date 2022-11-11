const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8xqwoju.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const serviceCollection = client.db('rainbowPhotography').collection('services');
        const reviewCollection = client.db('rainbowPhotography').collection('reviews');

        app.get('/services', async (req, res) => {
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(size).toArray();
            const count = await serviceCollection.estimatedDocumentCount();
            res.send({ count, services });
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // reviews api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        app.get('/reviewsbyserviceid', async (req, res) => {
            const serviceId = req.query.serviceId;
            const query = { serviceId: serviceId }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/myreviews', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // add service api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })
    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Rainbow photography server is running')
})

app.listen(port, () => {
    console.log(`Rainbow photography server is running on ${port}`);
})