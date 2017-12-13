# coding: utf-8
import csv
import math

# f = open('dataset.csv', 'r', encoding='utf-8')
f = open('dataset.csv', 'r')
input_data = csv.reader(f)
region = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'];
# region = [[1, 1], [2, 7], [8, 14], [15, 23], [24, 30], [31, 35], [36, 39], [40, 47]]
lastID = [1, 7, 14, 23, 30, 35, 39, 47]
index = 0
# s = region[index][0]
# e = region[index][1]

output = 'var dataset_todofuken = ['
header = next(input_data)
for d in input_data:
    print(d)
    output = output + '{' \
        + '"areaCode":"' + d[0].rjust(2, '0') + '",' \
        + '"areaName":"' + d[1] + '",' \
        + '"areaFee":' + d[2] + ',' \
        + '"popDencity":' + d[3] + ',' \
        + '"tempAverage":' + d[4] + ',' \
        + '"salary":' + d[5] + ',' \
        + '"jobOffers":' + d[6] \
        + '},'
f.close()

output = output[:-1] + ']'

f = open('dataset.json', 'w', encoding='utf-8')
f.write(output)
f.close()
