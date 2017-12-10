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

output = 'var dataset_areaFee={"北海道":['
header = next(input_data)
for d in input_data:
    pref_code = math.floor(int(d[0])/1000)
    areaFee = d[2] if d[2] and d[2] != '#N/A' else 0
    popDen = d[3] if d[3] and d[3] != '#N/A' else 0

    if pref_code>lastID[index]:
        index += 1
        output = output[:-1] + '],' \
            + '"' + region[index] + '":['

    output = output + '{' \
        + '"cityCode":"' + d[0] + '",' \
        + '"cityName":"' + d[1] + '",' \
        + '"areaFee":"' + str(areaFee) + '",' \
        + '"populationDencity":' + str(popDen) \
        + '},'
f.close()

output = output[:-1] + ']}'

f = open('dataset.json', 'w', encoding='utf-8')
f.write(output)
f.close()
