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
  
        //キーワードの入力
        //「return」を記述して、ユーザーからの入力待ち状態にする
        return botui.action.text({
          delay: 1000,
          action: {
            placeholder: 'ふかかい'
          }
        });
      }).then(function(res) {
  
        //入力されたキーワードを取得する
        key = res.value;
        word_chain(key);

      });
    }

    //入力された語の最後の一文字を表示するだけ(独り言の最後の一文字を返してくれる)
    function word_chain1(keyword) {
        console.log("in: word_chain w/" + keyword);
        preend = getEndcharactor(keyword);

        botui.message.bot({
            content: preend
        }).then(function() {
            //返信
            return botui.action.text(
            {
                delay: 1000,
                action: {
                    placeholder: preend
                }
            }
            );
            
        }).then(function(res){
            curword = res.value;
            console.log(key + "が入力されました");
            word_chain(curword);
        });
    }
    //入力された語がしりとりとして成立しているかを判別し、繰り返し入力を促すver.
    function word_chain(keyword) {
        console.log("in: word_chain w/" + keyword);
        preend = getEndcharactor(keyword);

        botui.message.bot({
            content: preend
        }).then(function() {
            //返信
            return botui.action.text(
            {
                delay: 1000,
                action: {
                    placeholder: preend
                }
            }
            );
            
        }).then(function(res){
            curword = res.value;
            console.log(key + "が入力されました");
            //「しり」から始まっているかをチェックする
            checkinput(curword, preend);
        });
    }

    function getuserinput(preend){
        return botui.action.text({
            delay: 1500,
            action: {
            placeholder: preend
            }
        }).then(function(res) {
            curword = res.value;
            console.log("getuserinput:" + curword);
            return curword;
        });
    }

    function getEndcharactor(keyword) {
        var endchar = keyword.slice(-1);
        return endchar;
    }
    
    function checkinput(curword, preend){
        console.log("in: checkinput");
        var headchar = curword.slice(0,1);

        if(!isHiragana(curword)){
            var err_message = 'ひらがなで入力してください';
            botui.message.bot({
                content: err_message
            }).then(word_chain(preend));
        }else if(headchar === preend ){
            console.log("checkinput: true");
            word_chain(curword);
        }else if(headchar !== preend){
            console.log("checkinput: false");
            botui.message.bot({
                content: preend + 'から始まる語を入力してください'
            }).then(word_chain(preend));
        }else {
            console.log("checkinput: false");
            botui.message.bot({
                content: '不明なエラー:もう一度、ひらがなで入力してください'
            }).then(word_chain(preend));
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
        content: 'ご利用ありがとうございました！'
      })
    }
  
  })();