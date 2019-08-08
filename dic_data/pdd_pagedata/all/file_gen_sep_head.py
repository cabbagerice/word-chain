import re
def fi_le(head,source):
    pattern = re.compile(r'＠%s'%head)
    print(pattern)
    data,tmp,flag=[],[],False
    for l in source:
            if re.match(pattern,l):
                tmp.append(f"＠{l[1:]}")
                flag=True
            elif (not re.match(r"^\n",l)) and flag:
                tmp.append(l)
            elif re.match(r"^\n",l) and flag:
                tmp.append("\n")
                data.append(tmp)
                tmp,flag=[],False
    '''File書き込み'''
    with open(f'{head}.txt',mode="w") as f:
        for s in data:
            for ss in s:
                f.write(ss)
######
#main#
######

source=open("all_dic.txt")
fi_le("ゔ",source)
exit()
for i in [chr(i) for i in range(12353, 12436)]:
    source=open("all_dic.txt")
    if not i in ["ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","っ","ゎ"]:
        fi_le(i,source)