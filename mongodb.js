const {MongoClient} = require('mongodb')
const url= 'mongodb+srv://asthasharmaextern123:fBIcvinzXfMLbxlv@cluster0.aaj3fzz.mongodb.net/';
const databaseName='e-commerse'
const client= new MongoClient(url);

async function dbConnect()
{
    let result = await client.connect();
    db= result.db(databaseName);
    return db.collection('users');
  
}
module.exports= dbConnect;


// const { MongoClient } = require('mongodb');

// const username = 'asthasharmaextern123';
// const password = '<cX2f9WhA5OpnR9PV>';
// const clusterName = 'cluster0';
// const dbName = 'e-commerce';

// const url = `mongodb+srv://${username}:${password}@${clusterName}.aaj3fzz.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// const client = new MongoClient(url);

// async function dbConnect() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     const db = client.db();
//     return db.collection('users');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error; // Rethrow the error for handling in the caller function
//   }
// }

// module.exports = dbConnect;

// mongodb+srv://asthasharmaextern123:<fBIcvinzXfMLbxlv>@cluster0.aaj3fzz.mongodb.net/
// mongodb+srv://asthasharmaextern123:fBIcvinzXfMLbxlv@cluster0.aaj3fzz.mongodb.net/
