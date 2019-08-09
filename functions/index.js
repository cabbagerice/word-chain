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
exports.isWordExist = functions.https.onRequest((req, res) => {
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


/*
/////////でたべに既出単語を書き込む////////////
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.isWordExist = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.body.text; //GETリクエストでもらう。POSTにするならreq.body.~~
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/messages').push({original: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});
exports.isWordExit = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const original = req.body.text;




  res.status(200).send(req.body);
});
*/
//////////でたべの既出単語チェック。チュートリアルのUpperCaseに対応。実装するかは…////////
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
/*
exports.makeSure = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      //console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
*/

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
