/*
使用: https://github.com/botui/botui
参考: https://github.com/webhacck/botui-sample/tree/master/docs

*/


(function() {

    var msgIndex, key, curword, preend;
    var botui = new BotUI('search-repo');
    
    //初期メッセージ
    botui.message.bot({
      content: 'こんにちは！'
    }).then(init);
  
  
    function init() {
      botui.message.bot({
        delay: 1500,  //メッセージの表示タイミングをずらす
        content: 'しりとりしましょう'
      }).then(function() {
          botui.message.bot({
              delay: 500,
              content: 'はじめは「しりとり」の「り」です'
          })
  
        //キーワードの入力
        //「return」を記述して、ユーザーからの入力待ち状態にする
        return botui.action.text({
          delay: 1000,
          action: {
            placeholder: 'り'
          }
        });
      }).then(function(res) {
  
        //入力されたキーワードを取得する
        curword = res.value;
        checkinput(curword, 'り');        

      });
    }

    //入力された語がしりとりとして成立しているかを判別し、繰り返し入力を促すver.
        //小文字を処理するようにする(日本語の小文字大文字を変換する機能はない)
    function word_chain(curword) {
        console.log("in: word_chain w/" + curword);
        preend = curword.slice(-1);
        /*ここで西田の作ったプログラムを呼んで返答を取得 */
        
        botui.message.bot({
            content: preend
        }).then(function() {
            return botui.action.text({
                delay: 500,
                action: {
                    placeholder: preend
                }
            });
            
        }).then(function(res){
            curword = res.value;
            console.log(key + "が入力されました");
            //「しり」から始まっているかをチェックする
            checkinput(curword, preend);
        });
    }

    
    //入力をチェックし、入力に応じたメッセージの表示, 入力に応じた引数でword_chainを呼び出す

    function checkinput(curword, preend){
        console.log("in: checkinput");
        var curhead = curword.slice(0,1);
        var curend = curword.slice(-1);

        var err_message;
        let collectness = false;
        if(!isHiragana(curword)){
            err_message = 'ひらがなで入力してください';
        }else if(curhead !== preend){
            err_message = preend + ' から始まる語を入力してください'
        }else {
            collectness = true;
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
  
  })();