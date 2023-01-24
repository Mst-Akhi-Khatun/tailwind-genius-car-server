const express = require("express");
const cors = require("cors");
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oxzfl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db("geniusCar").collection("services");
        const orderCollection = client.db("geniusCar").collection("orders");

        app.post("/jwt", async (req, res) => {
            const user = req.body;
            var token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
            console.log(user);
            res.send({token})
        });

        // get mane read oparetion load all services
        app.get("/service", async (req, res) => {
            const result = await serviceCollection.find({}).toArray();
            res.send(result);
        });

        // load one service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const result = await serviceCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
        })

//    post mane create oparetion
app.post("/order", async (req, res) => {
    const order = req.body;
    console.log("From client:", order);
    const result = await orderCollection.insertOne(order);
    res.send(result);
});

// get all order
    app.get("/order", async (req, res) => {
    let query = {};
    if (req.query.email) {
        query = {
            email: req.query.email
        }
    }
    const result = await orderCollection.find(query).toArray();
    res.send(result);
    });
        
        // delete paretion
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const result = await orderCollection.deleteOne({ _id: ObjectId(id) });
            console.log(result);
            res.send(result);
        })


        //  update status
    app.patch("/order/:id", async (req, res) => {
        const id = req.params.id;
        const updateStatus = req.body;
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
            $set: {
                status: updateStatus.status,
            },
        };
        const result = await orderCollection.updateOne(
            filter,
            updateDoc,
        );
        res.json(result);
    });
        
        
    }
    finally{

    }
}
run().catch(err => console.log(err));



app.get("/", (req, res) => {
    res.send("Getting successfully");
});

app.listen(port, () => {
    console.log("listening on port", port);
});