/*jshint esversion: 6 */

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

//var serviceAccount = require("gs://wordchain-bfb8b.appspot.com/wordchain-bfb8b-firebase-adminsdk-ldxik-24920f883a.json");
admin.initializeApp({
  //credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordchain-bfb8b.firebaseio.com"
});

//{"text":"文字列","initial":"文字列の頭文字"}の形のPOSTリクエストを受け付けて、データベースのPDD_botスキーマにアクセスし、ワードがあるかどうかをYESNOで返す.

exports.isWordExist = functions.https.onCall((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  var db = admin.database();

  db.ref('/PDD_bot/'+ req.body.initial +'/').once("value")
    .then((snapshot) =>{
      if(true === snapshot.child(req.body.text).exists()){
        isExist = "YES";
      }else{
        isExist = "NO";
      }
      res.status(200).send(isExist);
      return isExist;
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });

});



/////////でたべから単語を引っ張り出してくる.リクエストの送り方はPOSTで{"lastword":"文字列のけつ","random_num":数字}////////////
exports.WordResponse = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  var db = admin.database();

  db.ref('/PDD_hum/'+ req.body.lastword +'/' + req.body.random_num).once("value")
    .then((snapshot) =>{
      replyword = snapshot.val();
      res.status(200).send(replyword);
      return replyword;
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

///////データに保存！！JSON形式で飛んできたデータを配列形式に直して格納。配列⇆JSONは参考:https://www.sejuku.net/blog/47716//////////
exports.StoreData = functions.https.onCall((req, res) => {

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  var db = admin.database();

  db.ref('/GAME/'+ req.body.lastword +'/' + req.body.random_num).once("value")
    .then((snapshot) =>{
      replyword = snapshot.val();
      res.status(200).send(replyword);
      return replyword;
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});




/*
exports.makeUppercase = functions.database.ref('/PDD_hum/{pushId}/')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
*/


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
