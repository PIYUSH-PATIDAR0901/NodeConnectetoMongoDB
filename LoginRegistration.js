const Express = require("express");
const BodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const objId = require("mongodb").ObjectID;
const connectUrl = "mongodb://127.0.0.1:27017/";
const dataBaseName = "LoginRegistration";
const app = Express();
const cors = require("cors");
// const { ClientSession } = require("mongodb");
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
let database, collection;

app.listen(5000, () => {
  mongoClient.connect(
    connectUrl,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(dataBaseName);
      collection = database.collection("LoginRegistration");
      console.log("Connected to " + dataBaseName);
    }
  );
});

app.get("/getdata", (reqest, response) => {
  collection.find({}).toArray((err, result) => {
    if (err) {
      return response.status(500).send(err);
    }
    response.send(result);
  });
});

app.get("/getData:id", (request, response) => {
  collection.findOne({ "_id": new objId(request.params.id) }, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.post("/inserNew", (request, response) => {
  collection.insertOne(request.body, (err, result) => {
    if (err) {
      return response.status(500).send(err);
    }
    response.send(result.result);
  });
});

app.put("/updateData/:id", (request, response) => {
  collection.updateOne(
    { "_id": new objId(request.params.id) },
    { $set: request.body },
    (error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result.result);
    }
  );
});

app.delete("/deletData/:id", (request, response) => {
  collection.remove({ "_id": new objId(request.params.id) }, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.post("/loginCheck", async(request, response) => {

    try{
        const user = request.body.userID;
        const password1 = request.body.userPassword
        console.log(user);
        console.log(password1);
        const inputUser = await collection.findOne({Email:user});
        console.log(inputUser)

        if(inputUser.password === password1){
            response.status(201).send("login Successfully...!!!")
        } else{
            response.status(400).send("invalid Password details");
        }
    } catch(error){
        response.status(400).send("invalid User details");
    }
});