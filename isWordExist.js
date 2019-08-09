
var admin = require("firebase-admin");
var request = require('request'); //HTTP/HTTPS 通信を行うためのクライアント。

var serviceAccount = require("gs://wordchain-bfb8b.appspot.com/wordchain-bfb8b-firebase-adminsdk-ldxik-24920f883a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordchain-bfb8b.firebaseio.com"
});


var db = admin.database();
var input_word = req.body.text;
//入ってきた文字列の予定 somethingにそのブツを入れる HTTPのPOSTリクエストの形状によって違うのでささリュート相談
//GET POST取得：https://maku77.github.io/nodejs/express/handle-get-and-post-data.html

/*
//////////文字列の妥当性の確認//////////
if (!(input_word.match(/^[ぁ-んー　]+$/))) {    //"ー"の後ろの文字は全角スペース。なんかここのifオートインデントうまくいかんからコードミスってる可能性ある。
var headers = {
  'Content-Type':'application/json'
};

//オプションを定義
var replyword = "変な入力すんな";
var options = {
  url: 'https://wordchain-bfb8b.firebaseapp.com/word-chain.js',
  method: 'POST',
  headers: headers,
  json: true,
  form: {"reply":replyword}
};

//リクエスト送信
request(options, function (error, response, body) {
  //console.error('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
});//ここでエラー処理　へんなん入力すんな！って行って返すPOSTリクエストで。ひらがなの入力しか受け付けない。
}
*/



/*
//////////文字列の整形///////////////////
var last_word = input_word.trim().charAt(input_word.length -1); //trimは空白消す charAtは引数の番号の文字を返してくれる　最後の文字を格納
var semi_last_word = input_word.trim().charAt(input_word.length -2); //trimは空白消す charAtは引数の番号の文字を返してくれる　最後から２番目のもじをだす

if (last_word == 'ー' || last_word == 'っ'){ //===かも？？
  last_word = semi_last_word.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' );
}else{
  last_word = last_word.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' );
}
///////////////////////////////////////
*/


///////////入力文字列が辞書にあるかどうか調べる。線形探索で実装してるから遅そう。二分探索…////////////
//辞書にその単語があれば"YES",なければ"NO"を返す。
  var replyword;

  db.ref('/PDD_bot/'+ last_word +'/').once("value")
    .then(function(snapshot) {
      if(true == snapshot.child(input_word).exists()){
        replyword = "YES";
      }else{
        replyword = "NO";
      }
    });
//snapshot.val() !== NULLて書き方もできるみたい。参考:https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot.html#exists


//ヘッダーを定義　ここ参考https://qiita.com/penta515/items/074b5c7694b9bcec1043 https://maku77.github.io/nodejs/express/handle-get-and-post-data.html
var headers = {
  'Content-Type':'application/json'
};

//オプションを定義
var options = {
  url: 'https://wordchain-bfb8b.firebaseapp.com/word-chain.js',
  method: 'POST',
  headers: headers,
  json: true,
  form: {"reply":replyword}
};

//リクエスト送信
request(options, function (error, response, body) {
});
/////////////////////////////////
