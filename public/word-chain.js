/*
使用: https://github.com/botui/botui
参考: https://github.com/webhacck/botui-sample/tree/master/docs

*/


(function() {

    var key, curword, preend;
    var botui = new BotUI('siritori');
    
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
        delay: 1000,
        action: {
            placeholder: 'り'
          }
      })
    }).then(res => {
      curword = res.value;
      checkinput(curword, 'り');
    })


    //入力された語がしりとりとして成立しているかを判別し、繰り返し入力を促すver.
    //小文字を処理するようにする(日本語の小文字大文字を変換する機能はない)
    function word_chain(curword) {
        console.log("in: word_chain w/" + curword);
        preend = curword.trim().charAt(curword.length -1); //最後の文字を返す
        //長音, っ かつ二文字以上の場合は１つ前の文字を
        if ( (preend === 'ー' || preend === 'っ' ) && (curword.length >= 2) ) { preend = curword.trim().charAt(curword.length -2); /*最後から２番目の文字を返す*/}
        //小文字を大文字に直す
        preend = preend.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' ).replace( 'ゃ', 'や').replace( 'ゅ', 'ゆ' ).replace( 'ょ', 'よ' ).replace( 'ゎ', 'わ' );

        /*ここで西田の作ったプログラムを呼んで返答を取得 */
        
        botui.message.bot({
            content: preend
        }).then( () => {
            return botui.action.text({
                delay: 500,
                action: {
                    placeholder: preend
                }
            })
        }).then( res => {
            curword = res.value;
            console.log(key + "が入力されました");
            //前の単語の末尾から始まっているかをチェックする
            checkinput(curword, preend);
        });
    }

    
    //入力をチェックし、入力に応じたメッセージの表示, 入力に応じた引数でword_chainを呼び出す

    function checkinput(curword, preend){
      //////////文字列の整形///////////////////

      console.log("in: checkinput");
      //trimで空白を除去, charAtで引数の番号の文字を得る
      var curhead = curword.trim().slice(0,1); //先頭の文字を返す

      var err_message;
      let collectness = false;
      if(!isHiragana(curword)){
          err_message = 'ひらがなで入力してください';
      }else if(curhead !== preend){
          err_message = preend + ' から始まる語を入力してください'
      }else {
        //ミスがないとき
        collectness = true;

        var curend = curword.trim().charAt(curword.length -1); //最後の文字を返す
        //長音, っ かつ二文字以上の場合は１つ前の文字を
        if ( (curend === 'ー' || curend === 'っ' ) && (curword.length >= 2) ) { 
          curend = curword.trim().charAt(curword.length -2); //最後から２番目の文字を返す
        }
        //小文字を大文字に直す
        curend = curend.replace( 'ぁ', 'あ' ).replace( 'ぃ', 'い' ).replace( 'ぅ', 'う' ).replace( 'ぇ', 'え' ).replace( 'ぉ', 'お' ).replace( 'ゃ', 'や').replace( 'ゅ', 'ゆ' ).replace( 'ょ', 'よ' ).replace( 'ゎ', 'わ' );
      }

      if(collectness === false){
          console.log("checkinput: false");
          botui.message.bot({
              content: err_message
          }).then(word_chain(preend));
      }else { 
          console.log("checkinput: true");
          if(curend === "ん"){
              botui.message.bot({
                content: '「ん」がつきました.'
              }).then(end);
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
    function end() {
      botui.message.bot({
        content: 'YOU LOSE\n俺の勝ち\nなんで負けたか、明日まで考えといてください'
        
      }).then(function(){
          botui.message.bot({
            content: 'ほないただきます'
          })

      });
    }

    function postForm(value) {

      var form = document.createElement('form');
      var request = document.createElement('input');
      
      form.method = 'POST';
      form.action = 'getSiritoriResponse.js';
      
      request.type = 'hidden'; //入力フォームが表示されないように
      request.name = 'text';
      request.value = value;
      
      form.appendChild(request);
      document.body.appendChild(form);
      
      form.submit();
      
      }
  
  })();