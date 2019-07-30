
var admin = require("firebase-admin");

var serviceAccount = require("gs://wordchain-bfb8b.appspot.com/wordchain-bfb8b-firebase-adminsdk-ldxik-24920f883a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordchain-bfb8b.firebaseio.com"
});


var db = admin.database();
var ref = db.ref("room1"); //room1要素への参照　ここなおす！

var input_word = something; //入ってきた文字列の予定 somethingにそのブツを入れる



//////////文字列の妥当性の確認//////////
if (!(input_word.match(/^[ぁ-んー　]+$/))) {    //"ー"の後ろの文字は全角スペースです。
    ; //ここでエラー処理　へんなん入力すんな！って行って返すPOSTリクエストで。
}
if () { //既出の文字列を格納するデータベースに接続して、既出文字列とかぶるところがあればアウト！って返す
  ;
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



////////////出力する文字列をデータベースから落としてくる////////
//データベースからlast_wordが先頭の文字列であるグループを落とす。で、落としたデータをリストに格納し、ランダムで出した数字のサフィックスの文字を出力として出力する。
//上の実装が遅すぎる場合、２文字目をランダムに出力し、その先頭２文字に合致している文字列のグループをデータとしておとしてくる。と落とすデータ量は捌ける。


/*　room1以下に対しての非同期コールバック */
ref.on("value", function(snapshot) {
    /* ここに取得したデータを用いた何らかの処理 */
    console.log(snapshot.val());
},
function(errorObject) {
    console.log("The read failed: " + errorObject.code);
} );
