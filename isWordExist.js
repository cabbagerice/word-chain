
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





//////////文字列の整形///////////////////
var last_word = input_word.trim().charAt(input_word.length -1); //trimは空白消す charAtは引数の番号の文字を返してくれる　最後の文字を格納
var semi_last_word = input_word.trim().charAt(input_word.length -2); //trimは空白消す charAtは引数の番号の文字を返してくれる　最後から２番目のもじをだす

if (last_word == 'ー' || last_word == 'っ'){ //===かも？？
  last_word = semi_last_word.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' );
}else{
  last_word = last_word.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' );
}
///////////////////////////////////////


////////last_word以下のデータ(レコード)数に合わせてランダムな数字を出す。num_of_wordsに格納.str型で//////////////////
//レコード数を抜き出す方法がわからなかったので(例えばlenとかsizeみたいなもん)手打ち。辞書式とかテーブル使って工夫したら楽になったんでしょうね
var num_of_words;
if(last_word == "あ"){
  num_of_words = "1639";
}else if(last_word == "い"){
  num_of_words = "673";
}else if(last_word == "う"){
  num_of_words = "281";
}else if(last_word == "え"){
  num_of_words = "902";
}else if(last_word == "お"){
  num_of_words = "787";
}else if(last_word == "か"){
  num_of_words = "467";
}else if(last_word == "が"){
  num_of_words = "85";
}else if(last_word == "き"){
  num_of_words = "876";
}else if(last_word == "ぎ"){
  num_of_words = "161";
}else if(last_word == "く"){
  num_of_words = "492";
}else if(last_word == "ぐ"){
  num_of_words = "223";
}else if(last_word == "け"){
  num_of_words = "355";
}else if(last_word == "げ"){
  num_of_words = "107";
}else if(last_word == "こ"){
  num_of_words = "924";
}else if(last_word == "ご"){
  num_of_words = "215";
}else if(last_word == "さ"){
  num_of_words = "543";
}else if(last_word == "ざ"){
  num_of_words = "58";
}else if(last_word == "し"){
  num_of_words = "1032";
}else if(last_word == "じ"){
  num_of_words = "548";
}else if(last_word == "す"){
  num_of_words = "338";
}else if(last_word == "ず"){
  num_of_words = "24";
}else if(last_word == "せ"){
  num_of_words = "500";
}else if(last_word == "ぜ"){
  num_of_words = "15";
}else if(last_word == "そ"){
  num_of_words = "351";
}else if(last_word == "ぞ"){
  num_of_words = "48";
}else if(last_word == "た"){
  num_of_words = "581";
}else if(last_word == "だ"){
  num_of_words = "227";
}else if(last_word == "ち"){
  num_of_words = "1045";
}else if(last_word == "ぢ"){
  num_of_words = "1";
}else if(last_word == "つ"){
  num_of_words = "235";
}else if(last_word == "づ"){
  num_of_words = "2";
}else if(last_word == "て"){
  num_of_words = "370";
}else if(last_word == "で"){
  num_of_words = "223";
}else if(last_word == "と"){
  num_of_words = "683";
}else if(last_word == "ど"){
  num_of_words = "241";
}else if(last_word == "な"){
  num_of_words = "483";
}else if(last_word == "に"){
  num_of_words = "746";
}else if(last_word == "ぬ"){
  num_of_words = "134";
}else if(last_word == "ね"){
  num_of_words = "140";
}else if(last_word == "の"){
  num_of_words = "281";
}else if(last_word == "は"){
  num_of_words = "810";
}else if(last_word == "ば"){
  num_of_words = "440";
}else if(last_word == "ぱ"){
  num_of_words = "240";
}else if(last_word == "ひ"){
  num_of_words = "500";
}else if(last_word == "び"){
  num_of_words = "290";
}else if(last_word == "ぴ"){
  num_of_words = "224";
}else if(last_word == "ふ"){
  num_of_words = "915";
}else if(last_word == "ぶ"){
  num_of_words = "453";
}else if(last_word == "ぷ"){
  num_of_words = "282";
}else if(last_word == "へ"){
  num_of_words = "214";
}else if(last_word == "べ"){
  num_of_words = "150";
}else if(last_word == "ぺ"){
  num_of_words = "90";
}else if(last_word == "ほ"){
  num_of_words = "245";
}else if(last_word == "ぼ"){
  num_of_words = "158";
}else if(last_word == "ぽ"){
  num_of_words = "78";
}else if(last_word == "ま"){
  num_of_words = "306";
}else if(last_word == "み"){
  num_of_words = "468";
}else if(last_word == "む"){
  num_of_words = "410";
}else if(last_word == "め"){
  num_of_words = "274";
}else if(last_word == "も"){
  num_of_words = "425";
}else if(last_word == "や"){
  num_of_words = "431";
}else if(last_word == "ゆ"){
  num_of_words = "283";
}else if(last_word == "よ"){
  num_of_words = "367";
}else if(last_word == "ら"){
  num_of_words = "294";
}else if(last_word == "り"){
  num_of_words = "541";
}else if(last_word == "る"){
  num_of_words = "333";
}else if(last_word == "れ"){
  num_of_words = "239";
}else if(last_word == "ろ"){
  num_of_words = "240";
}else if(last_word == "わ"){
  num_of_words = "218";
}else{
  num_of_words = NULL;　//なんかがおかしい時。
}

var num_random = Math.floor( Math.random() * num_of_words ); //importとか要らないのかな

////////////////////


///////////入力文字列が辞書にあるかどうか調べる。けど、キーで検索かけれないから厳しいかも…線形探索で実装してるから遅そう。二分探索…////////////
//辞書にその単語があれば"OK",なければ"NO"を返す。

for(var i=0;i<num_of_words;i++){
  var index = String(i);
  var replyword;
  db.ref('/PDD_hum/'+ last_word +'/'+ index +'/').on("value", function(snapshot) {
    //console.log(snapshot.val());
    replyword = snapshot.val();

    if(input_word == snapshot.val()){
      replyword = "OK";
    }else{
      replyword = "NO";
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  } );

  if(replyword == "OK") break;
}
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
