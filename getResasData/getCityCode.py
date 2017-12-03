# coding:utf-8
import requests
import json
from time import sleep
import codecs

# APIトークンの取得
f = open('X-API-KEY')
key = f.read()
f.close()
key = key.replace('\n','')

def RESAS_API(key, url):
    x = json.loads(requests.get(url, headers = {'X-API-KEY':key}).text)
    return (x)

upper_url = 'https://opendata.resas-portal.go.jp/'
lower_url = 'api/v1/cities'

output_NameCode = 'var cityNC = {'
output_CodeColor = 'var cityCC = {'
for prefCode in range(1, 48):
    query = 'prefCode=' + str(prefCode)
    URL = upper_url + lower_url + '?' + query

    result = RESAS_API(key, URL)['result']

    for c in result:
        cityName = c['cityName']
        cityCode = c['cityCode']
        output_NameCode = output_NameCode + '"' + cityName \
            + '":' + '"' + cityCode + '",'
        output_CodeColor = output_CodeColor + '"' + cityCode \
            + '":' + '"fff",'

    sleep(0.25)

# 終端のカンマ(',')を消し，jsonの'}'で閉じる
output_NameCode = output_NameCode[:-1] + "}"
output_CodeColor = output_CodeColor[:-1] + "}"

fnc = codecs.open('city_NameCode.js', 'w', 'utf-8')
fcc = codecs.open('city_CodeColor.js', 'w', 'utf-8')
fnc.write(output_NameCode)
fcc.write(output_CodeColor)
fnc.close()
fcc.close()
