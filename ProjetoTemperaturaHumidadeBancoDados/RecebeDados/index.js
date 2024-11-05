const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// Conectar ao MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(bodyParser.json());

app.post("/sendData", async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data);

    await client.connect();
    const database = client.db("sensorData");
    const collection = database.collection("readings");

    const result = await collection.insertOne({
      temperatura: data[0].data1,
      humidade: data[0].data2,
      timestamp: new Date(),
    });

    res.status(200).send("Data saved successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
