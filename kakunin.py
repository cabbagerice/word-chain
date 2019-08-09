import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from numpy import random as unko
import math


#認証ファイルPATH
certificate_json_path='secret.json'
#DBとアプリへの認証
if (not len(firebase_admin._apps)):
	cred = credentials.Certificate(certificate_json_path) 
	default_app = firebase_admin.initialize_app(cred, {
	'databaseURL': 'https://wordchain-bfb8b.firebaseio.com/'
	})
print(db.reference("/PDD_hum/あ/"+ str(math.floor(unko.rand()*1000))).get());exit()