const express = require("express")
const app = express()
const { MongoClient, ObjectId } = require('mongodb');
app.use(express.json())


const mongoURL = 'mongodb://localhost:27017';
const dbName = "task1"

// ..............................

app.get('/api/v3/app/events/:id', async (req, res) => {
  try {

    const Id = req.params.id;
    const mongo = new MongoClient(mongoURL);
    await mongo.connect();
    const db = mongo.db(dbName);
    const collection = db.collection('data');

    const newdata = await collection.findOne({ _id: ObjectId(Id) });
    res.JSON(newdata)
    mongo.close();
  } catch (e) {
    console.log(e);
  }
});

//........................................

app.get('/api/v3/app/events', async (req, res) => {
  try {
    
    const { type, limit, page } = req.query;
    const mongo = new MongoClient(mongoURL);
    await mongo.connect();
    const db = mongo.db(dbName);
    const collection = db.collection('data');

    const newdata = await collection
      .find({ type: type })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .toArray();

    res.JSON(newdata)

    mongo.close();
  } catch (e) {
    console.log(e);  }
});

//...............................

app.post('/api/v3/app/events', async (req, res) => {
  try {

    const { type, uid, name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
    const mongo = new MongoClient(mongoURL);
    await mongo.connect();
    const db = mongo.db(dbName);
    const collection = db.collection('data');

    const newdata = {
      type,
      uid,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      attendees
    };

    const result = await collection.insertOne(newdata);


    mongo.close();
  } catch (e) {
    console.log(e)
  }
});

//...........................


app.put('/api/v3/app/events/:id', async (req, res) => {
  try {
    const Id = req.params.id;
    const { type, uid, name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
    const mongo = new MongoClient(mongoURL);
    await mongo.connect();
    const db = mongo.db(dbName);
    const collection = db.collection('data');

    const newdata = {
      type,
      uid,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      attendees: JSON.parse(attendees)
    };

    await collection.updateOne({ _id: ObjectId(Id) }, { $set: newdata });

    res.status(200).send('Event updated successfully');

    mongo.close();
  } catch (e) {
    console.log(e)
    res.status(500).send('An error occurred');
  }
});

//..........................

app.delete('/api/v3/app/events/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const mongo = new MongoClient(mongoURL);

    await mongo.connect();

    const db = mongo.db(dbName);
    const collection = db.collection('data');

    await collection.deleteOne({ _id: ObjectId(Id) });

    res.status(200).send('Event deleted successfully');

    mongo.close();
  } catch (e) {
    console.log(e)
    res.status(500).send('An error occurred');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});