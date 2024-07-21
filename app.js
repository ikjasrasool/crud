const express=require("express");
const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const port = 3000;


//npm i express pg body-parser ejs


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const mongoUrl = "mongodb://localhost:27017/";
const dbName = "crud";
let db;

MongoClient.connect(mongoUrl)
    .then((client) => {
        db = client.db(dbName);
        console.log(`Connected to MongoDB: ${dbName}`);
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

app.get("/", (req, res) => {
    res.render("index")
});

app.post("/submit",  (req, res) => {
    const { name, email } = req.body;
    try {
        db.collection("user").insertOne({ name,email });

        res.redirect("/display");
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Failed to insert data");
    }
});
app.get('/display', async (req, res) => {

    try {
        const items = await db.collection("user").find().toArray();
        res.render('dis', { results: items });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Failed to fetch data");
    }
});



//delete
app.post('/del',(req,res)=>{
    const { id } = req.body;
    try {
        db.collection("user").deleteOne({ _id: new ObjectId(id) });
        res.redirect("/display");
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Failed to delete data');
    }
})




//update
app.post("/update",async(req,res)=>{
    const { id } = req.body;
    try {
        const user = await db.collection("user").findOne({ _id: new ObjectId(id) });
       
        res.render('form', { results: user });

    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Failed to fetch user");
    }

})
app.post("/up",(req,res)=>{
    const{id,name,email}=req.body;
    try {
        db.collection("user").updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, email } }
        );
        res.redirect("/display");
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Failed to update user");
    }
})




//Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});