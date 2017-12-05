# coding:utf-8

# 各地域毎(北海道，東北，...)に市区町村コードをまとめ，
# 以下の形式で市区町村コードを city_code.js に出力する．
# var city_code = {
#   "地域名": {
#       "市区町村名": "市区町村コード",
#       ...
#   },
#   ...
# }

import requests
import json
from time import sleep
import codecs

# APIトークンの取得
f = open('X-API-KEY')
key = f.read()
f.close()
key = key.replace('\n','')

# RESASのAPIを実行し，jsonデータを取得
def RESAS_API(key, url):
    x = json.loads(requests.get(url, headers = {'X-API-KEY':key}).text)
    return (x)

# 取得したjsonデータの必要な部分を，1つの文字列データに変換
def json2string(json):
    json_str = ""
    for c in json:
        cityName = c['cityName']
        cityCode = c['cityCode']
        json_str = json_str + '"' + cityName + '":' \
            + '"' + cityCode + '",'
    return json_str

upper_url = 'https://opendata.resas-portal.go.jp/'
lower_url = 'api/v1/cities'

# ['地域名', 都道府県コード, 都道府県コード]
region = [
    ['北海道', 1, 1],
    ['東北', 2, 7],
    ['関東', 8, 14],
    ['中部', 15, 23],
    ['近畿', 24, 30],
    ['中国', 31, 35],
    ['四国', 36, 39],
    ['九州', 40, 47]
    ]

output = 'var city_code = {'

for r in region:
    # "地域名":{
    output = output + '"' + r[0] + '":{'
    for id in range(r[1], r[2]+1):
        query = 'prefCode=' + str(id)
        URL = upper_url + lower_url + '?' + query

        result = RESAS_API(key, URL)['result']
        # "市区町村名": "市区町村コード", ...
        output = output + json2string(result)
        sleep(0.25)
    output = output + '},'
print(output)

# 終端のカンマ(',')を消し，jsonの'}'で閉じる
output = output[:-1] + "}"

f = codecs.open('city_code.js', 'w', 'utf-8')
f.write(output)
f.close()
