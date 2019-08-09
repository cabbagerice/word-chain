/*
使用: https://github.com/botui/botui
参考: https://github.com/webhacck/botui-sample/tree/master/docs
*/
/*
ターン数はused[]の要素数(length?)を取れば行けそう
*/

{
/*
var admin = require("firebase-admin");
var request = require('request'); //HTTP/HTTPS 通信を行うためのクライアント。

var serviceAccount = require("gs://wordchain-bfb8b.appspot.com/wordchain-bfb8b-firebase-adminsdk-ldxik-24920f883a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordchain-bfb8b.firebaseio.com"
});


var db = admin.database();
*/
}


(function() {

    var curword, preend, reply;
    var used = ["しりとり"], turn = 1, endnum=1;
    var botui = new BotUI('siritori');
    
    init();


    function init(){
      //初期メッセージ
      botui.message.bot({ // show first message
        delay: 200,
        content: 'hello'
      }).then(() => {
        return botui.message.bot({ // second one
          delay: 1000, // wait 1 sec.
          content: 'Let\'s Shiritori'
        })
      }).then(() => {
        return botui.message.bot({ // second one
          delay: 1000, // wait 1 sec.
          content: 'First character is 「り」of 「しりとり」'
        })
      }).then(() => {
        return botui.action.text({ // let user do something
          delay: 500,
          action: {
            placeholder: 'り'
          }
        })
      }).then(res => {
        curword = res.value;
        checkinput(curword, 'り');
      });
    }

    //入力された語がしりとりとして成立しているかを判別し、繰り返し入力を促すver.
    //小文字を処理するようにする(日本語の小文字大文字を変換する機能はない)
    function word_chain(curword) {
        console.log("in: word_chain w/" + curword);

        /* 文字の整形 (伸ばし棒, 'っ'は無視, 小文字は大文字へ*/
        preend = curword.trim().charAt(curword.length -1); //最後の文字を返す
        if ( (preend === 'ー' || preend === 'っ' ) && (curword.length >= 2) ) { preend = curword.trim().charAt(curword.length -2); /*最後から２番目の文字を返す*/}
        preend = preend.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' ).replace( 'ゃ', 'や').replace( 'ゅ', 'ゆ' ).replace( 'ょ', 'よ' ).replace( 'ゎ', 'わ' );

        /*ここで西田の作ったプログラムを呼んで返答を取得 */
        //var reply = randompick(preend);
        var reply = "NUll";
        //reply = postForm(curword);



        botui.message.bot({
            content: preend
        }).then( () => {
            return botui.action.text({
                delay: 200,
                action: {
                    placeholder: reply
                }
            })
        }).then( res => {
            curword = res.value;
            console.log(curword + "が入力されました");
            //前の単語の末尾から始まっているかをチェックする
            checkinput(curword, preend);
        });
    }

    
    //入力をチェックし、入力に応じたメッセージの表示, 入力に応じた引数でword_chainを呼び出す
    function checkinput(curword, preend){

      console.log("in: checkinput");
      //trimで空白を除去, charAtで引数の番号の文字を得る
      var curhead = curword.trim().slice(0,1); //先頭の文字を返す
      var curend = curword.trim().charAt(curword.length -1); //最後の文字を返す

      var istwice = 0, isend = 1, isInDic = 1;

      for(let i=0; used[i] !== undefined; i++){
        if(used[i] === curword) {
          istwice = 1; 
          break;
        }
      }
      var err_message, endmessage;
      let collectness = false;
      if(!isHiragana(curword)){
          err_message = 'ひらがなで入力してください';
      }else if(curhead !== preend){
          err_message = preend + ' から始まる語を入力してください'
      }else {
        /*平仮名で「しり」をちゃんととってる場合*/
        /*ここで入力が辞書にあるかどうかを判別する、結果はisInDicとかに格納し, ifで場合分け*/
        isInDic = isWordExist(curword, curhead);
        if(isInDic === "NO"){
          err_message = "その言葉は辞書に登録されておりません"
        }else{
          collectness = true;
          used.push(curword);
          if(istwice){
            endmessage = "その言葉はもう使われました";
          }else if(curend === "ん"){
            endmessage = "「ん」がつきました";
          }else {
            isend = 0;
          }
        }
      }

      if(collectness === false){
          console.log("checkinput: false");
          botui.message.bot({
              content: err_message
          }).then(word_chain(preend));
      }else { 
          console.log("checkinput: true");
          if(isend){
            endnum += 1;
            botui.message.bot({
              content: endmessage
            }).then(end(preend));
          }else{
            word_chain(curword);
          }
      }
    }

    //入力がひらがなかどうかを判別する関数
    function isHiragana(str){
        str = (str==null)?"":str;
        if(str.match(/^[ぁ-んー　]*$/)){    //"ー"の後ろの文字は全角スペースです。
          return true;
        }else{
          return false;
        }
      }
  
  
    //プログラムを終了する処理
    function end(preend) {

      botui.message.bot({
        content: 'YOU LOSE\n\nなんで負けたか、明日まで考えといてください'
        
      }).then(function(){
          console.log(used);
          if(endnum <= 3){
            botui.message.bot({
              content: "続けますか"
            }).then( ()=> {
              return botui.action.button({
                delay: 100,
                action: [{
                    text: 'continue',
                    value: 'continue'
                  },{
                    text: 'finish',
                    value: 'finish'
                  }
                ]
              })
            }).then( res => {
              conti = res.value;
              if(conti === "continue"){
                word_chain(preend);
              }else{
                botui.message.bot({
                  delay: 100,
                  content: "ありがとうございました"
                })
              }
            })
          }else{
            botui.message.bot({
              content: "ありがとうございました"
            })
          }
        });
    }

    

    function isWordExist(word, initial){
      console.log(word + initial);
      url = "https://us-central1-wordchain-bfb8b.cloudfunctions.net/isWordExist";
      //レスポンス
      var response = {};
      //リクエスト
      let data = {"text": "あんこ", 
                    "initial": "あ"};
  
      //ajax
      $.ajax({
        type        : "POST",
        url         : url,
        data        : JSON.stringify(data),  //object -> json
        async       : true,                    //true:非同期(デフォルト), false:同期
        dataType    : "json",
        contentType: 'application/json ;charset=utf-8' ,
        success     : function(data) {
          //data = JSON.parse(data);  //error
          response = data;
        },
        error       : function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("リクエスト時になんらかのエラーが発生しました\n" + url + "\n" + textStatus +":\n" + errorThrown);
        }
      });
  
      //表示
      console.log(response);
      return response;
    }


    /*db, post関係のコード*/
    {
    function postForm(value) {

      var form = document.createElement('form');
      var request = document.createElement('input');
      
      form.method = 'POST';
      form.action = 'https://us-central1-wordchain-bfb8b.cloudfunctions.net/isWordExist';
      
      request.type = 'hidden'; //入力フォームが表示されないように
      request.name = 'text';
      request.value = value;
      
      form.appendChild(request);
      document.body.appendChild(form);
      
      form.submit();
      
    }
    function getForm(value){

    }

    function randompick(last_word){
      {
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
      }
      var num_random = Math.floor( Math.random() * num_of_words ); //importとか要らないのかな
        
        ////////////////////

      var path = "/PDD_hum/" + last_word +'/'+ num_random;
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
      return replyword;
    }
    }
      
  
})();