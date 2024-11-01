const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 9000;

const app = express();

// middleware 

const corsOptions = {
  origin:
    [
      'http://localhost:5173'
    ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH'], // Add methods you need
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// middle ware jwt token jwt verify 
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'unauthorized access' })
      }
      console.log(decoded);
      req.user = decoded;
      next()
    })
  }

}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jkraio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const jobsCollection = client.db('soloShare').collection('jobs');
    const bidsCollection = client.db('soloShare').collection('bids');

    //jwt genarate
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
      })
        .send({ success: true })
    })

    //clear cookie
    app.get('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 0
      })
        .send({ success: true })
    })

    // get all jobs data from db 

    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    })

    // send a single data from db using id 

    app.get('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });


    // save a bid data in db 

    app.post('/bids', async (req, res) => {
      const bidData = req.body;

      //cheak duplicate
      const alreadyApplied = await bidsCollection.findOne({
        email: bidData.email,
        jobId: bidData.jobId
      })

      if (alreadyApplied) {
        return res
          .status(400)
          .send('You have already applied this job')
      }

      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    })


    // save a job data in db 

    app.post('/job', async (req, res) => {
      const jobData = req.body;
      const result = await jobsCollection.insertOne(jobData);
      res.send(result);
    })

    // get all posted jobs by a specipic user 

    app.get('/jobs/:email', verifyToken, async (req, res) => {
      const tokenEmail = req.user?.email;

      const email = req.params.email;
      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      const query = { 'buyer.email': email };
      const result = await jobsCollection.find(query).toArray();
      res.send(result);

    })
    // delete a data from db

    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);

    })
    // update a data from db

    app.put('/job/:id', verifyToken, async (req, res) => {
      const jobData = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          ...jobData
        }
      }
      const result = await jobsCollection.updateOne(query, updatedDoc, options);
      res.send(result);

    })


    // get all bids using email by db

    app.get('/my-bids/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const tokenEmail = req.user?.email;

      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      const query = { email: email };
      const result = await bidsCollection.find(query).toArray();
      res.send(result);

    })

    //get all bid request for job owner 

    app.get('/bid-requests/:email', verifyToken, async (req, res) => {

      const email = req.params.email;
      const tokenEmail = req.user?.email;

      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' })
      }

      const query = { 'buyer.email': email };
      const result = await bidsCollection.find(query).toArray();
      res.send(result);

    })

    // update a bid status

    app.patch('/bid/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: status
      }
      const result = await bidsCollection.updateOne(query, updatedDoc);
      res.send(result)
    });


    // get all jobs data from db for pagination

    app.get('/all-jobs', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page) - 1;
      const filter = req.query.filter;
      const sort = req.query.sort;
      const search = req.query.search;
      let query = {
        job_title: { $regex: search, $options: 'i' }
      }
      if (filter) query.category = filter
      let option = {}
      if (sort) option = { sort: { deadline: sort === 'asc' ? 1 : -1 } }
      console.log(page, size)
      const result = await jobsCollection
        .find(query, option)
        .skip(page * size)
        .limit(size)
        .toArray()

      res.send(result);
    })


    // get all jobs data from db for count

    app.get('/jobs-count', async (req, res) => {

      const filter = req.query.filter;
      const search = req.query.search;
      let query = {
        job_title: { $regex: search, $options: 'i' }
      }
      if (filter) query.category = filter

      // countDocuments for count number of data for pagination 
      const count = await jobsCollection.countDocuments(query)
      res.send({ count });
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from soloSphare server ....')
})
app.listen(port, () => console.log(`server running on port : ${port}`))