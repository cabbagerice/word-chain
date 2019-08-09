import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('test-1bbc0-firebase-adminsdk-r5q1a-fa69d57cf8.json') #歯車→サービスアカウントから秘密鍵をjsonファイルで取ってくる。

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://test-1bbc0.firebaseio.com/', #データベースのURL。Realtime Database とFireStoreと違うので注意！！
    'databaseAuthVariableOverride': {
        'uid': 'my-service-worker'
    }
})

##databaseに初期データを追加する
users_ref = db.reference('/users') #テーブル名

users_ref.set({
    'user001': { #フィールド？？
        'date_of_birth': 'June 23, 1984',
        'full_name': 'Sazae Isono'
        },
    'user002': {
        'date_of_birth': 'December 9, 1995',
        'full_name': 'Tama Isono'
        }
    })

# databaseにデータを追加する
users_ref.child('user003').set({
    'date_of_birth': 'Aug 23, 1980',
    'full_name': 'Masuo Isono'
    })

##データを更新する
updates = {}
updates['/user001/full_name'] = 'Sazae Fuguta'
users_ref.update(updates)



##データを取得する
#print(ref.get()) これは全取得

#https://ja.stackoverflow.com/questions/51059/firebase%E3%81%A7%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E7%B5%9E%E3%82%8B%E3%81%AB%E3%81%AF-python%E7%94%A8
#これが階層構造のうまいWhereの取り方
