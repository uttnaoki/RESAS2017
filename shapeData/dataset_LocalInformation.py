# coding: utf-8
import csv
import math

# f = open('dataset.csv', 'r', encoding='utf-8')
f = open('dataset.csv', 'r')
input_data = csv.reader(f)

output = 'var dataset_LocalInformation = {'
header = next(input_data)

def checkNull(val):
    return val if val and val != '#N/A' else '" "'

for d in input_data:
    output = output + '"' + d[1] + '":{' \
        + '"areaFee":' + checkNull(d[2]) + ',' \
        + '"areaFee_rank":' + checkNull(d[3]) + ',' \
        + '"popDencity":' + checkNull(d[4]) + ',' \
        + '"popDencity_rank":' + checkNull(d[5]) + ',' \
        + '"hp":"' + d[8] + '"' \
        + '},'
f.close()

output = output[:-1] + '}'

f = open('dataset.json', 'w', encoding='utf-8')
f.write(output)
f.close()
