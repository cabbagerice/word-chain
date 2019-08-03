
var admin = require("firebase-admin");
var request = require('request'); //HTTP/HTTPS 通信を行うためのクライアント。

var serviceAccount = require("gs://wordchain-bfb8b.appspot.com/wordchain-bfb8b-firebase-adminsdk-ldxik-24920f883a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordchain-bfb8b.firebaseio.com"
});


var db = admin.database();
var input_word = something; //入ってきた文字列の予定 somethingにそのブツを入れる HTTPのPOSTリクエストの形状によって違うのでささリュート相談
var AlreadySaid = db.ref("AlreadySaid");






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
/*
if () { //既出の文字列を格納するデータベースに接続して、既出文字列とかぶるところがあればアウト！って返す->データベースに追加したらハッシュっぽくなる。全件取得するのもめんどくさい。。フロント側で配列に格納してもらったほうがいいかも。
  var headers = {
    'Content-Type':'application/json'
  };

  //オプションを定義
  var replyword = "既出やんそれ";
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
  });
}*/






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




////////////////////



var path = "/PDD_hum/" + last_word +'/'+ num_of_words;
var ref = db.ref(path); //PDD_hum要素への参照.PDD_hum/あ/みたいなxpath使える。　既出文字列を格納するディレクトリはどうしようかな…
var replyword; //返す用の文字列

////////////出力する文字列をデータベースから落としてくる////////
//データベースからlast_wordが先頭の文字列であるグループを落とす。で、落としたデータをリストに格納し、ランダムで出した数字のサフィックスの文字を出力として出力する。
//上の実装が遅すぎる場合、２文字目をランダムに出力し、その先頭２文字に合致している文字列のグループをデータとしておとしてくる。と落とすデータ量は捌ける。

/*　PDD_hum以下に対しての非同期コールバック、refを使いたいときに*/

ref.on("value", function(snapshot) {
  //console.log(snapshot.val());
  replyword = snapshot.val();
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
    //console.error('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
  });
},
function(errorObject) {
  console.log("The read failed: " + errorObject.code);
} );
