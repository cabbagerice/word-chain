import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from pykakasi import kakasi
import re
import json
#なんかfirebaseのライブラリに使われてるurllib3くんが旧来化したので
#_http_clients_.pyをいじる必要があった
#https://stackoverflow.com/questions/56212844/how-to-fix-firebase-admin-error-typeerror-init-got-an-unexpected-keyword/56215539

def insertData(parent,dict):
	#parent作成("JPLT"か"PDD"?)
	users_ref = db.reference(parent)
	#一応トランザクション失敗した例外処理しとく
	try:
		#tableに突っ込むjsonくん(tablenameのしたにネストする)
		users_ref.set(dict)
	except firebase_admin.db.TransactionError:
		print("insertFailed!!!")

def appendData(parent,child,dict):
	#parent指定("JPLT"か"PDD")
	users_ref = db.reference(parent)
	#既存のtableに突っ込む("あ"とか？)
	users_ref.child(child).set(dict)

def pushData(parent,dict):
	users_ref = db.reference(parent).push()
	users_ref.set(dict)
"""main()"""
#認証ファイルPATH
certificate_json_path='/home/eggplant/Downloads/diction_hack/wordchain-bfb8b-firebase-adminsdk-ldxik-065ed5d647.json'
#DBとアプリへの認証
if (not len(firebase_admin._apps)):
	cred = credentials.Certificate(certificate_json_path) 
	default_app = firebase_admin.initialize_app(cred, {
	'databaseURL': 'https://wordchain-bfb8b.firebaseio.com/'
	})

#各データ
WORD=""
ROME=""
DIFFICULTY=""
MEAN=[]
LINKS={}

#########
#  PDD  #
#########
dicdata=[]
words=[]
means=[]
PDD_PATH="/home/eggplant/Downloads/diction_hack/dic_data_ja_romaji/all/dic_head/ALL.txt"
#カカシ(Hiragana_To_Rome)
kakasi = kakasi()
kakasi.setMode('H', 'a')
conv = kakasi.getConverter()
#可変
head,id,word_p="き",0,"き"
with open(PDD_PATH) as f:
	for l in f:
		l=l.rstrip()
		if not l:
			if word_p != words[0]:
				id+=1
			means.append("\n".join(means))
			json={words[0][0] : {
				words[0] : str(id)
				}
			}
			dicdata.append(json)
			word_p = words[0]
			words,means=[],[]
		elif l[0]=="＠":
			if not l[1:2] == head:
				head=l[1:2]
				id=-1
			words.append(l[1:])
		elif l[0]=="【":
			words.append(l[1:-1])
		else:
			means.append(l)
#botdata作成用
for query in dicdata:
	print(query)
	head=list(query)[0]
	word=list(query[head])[0]
	#print(query[head][num])
	json=db.reference("/PDD_bot").get()
	if head in list(json):
		#DBに頭文字がおる>単語がいない
		if not word in json[head].keys():
			appendData("/PDD_bot/"+head,word,query[head][word])
	#DBに頭文字がおらない
	else:
		appendData("/PDD_bot",head,query[head])


