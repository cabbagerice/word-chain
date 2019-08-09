import sqlite3
from contextlib import closing

dbname = 'database.db'
#https://qiita.com/mas9612/items/a881e9f14d20ee1c0703をバチコリと参考にした
#input_wordは日本語のひらがなという前提でいっていて、エラー処理まだ
#入力文字列に続くしりとりの文字列を列挙してくれる
def getSiritoriResponse(input_word: str)->str:
    with closing(sqlite3.connect(dbname)) as conn:
        c = conn.cursor()
        lastword = input_word[len(input_word)-1]


        select_sql = 'SELECT word FROM vocabulary WHERE word LIKE \'?%\' ;' #word is a column, vocabulary is a table name
        for row in c.execute(select_sql,lastword):
            print(row)
