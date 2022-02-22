'''
    File name: pointcalls.py
    Author: Guillaume Brioudes (https://myllaume.fr/)
    Date created: 2022-02-18
    Date last modified: 2022-02-07
    Python Version: 3.10.1
    Description: Get all pointcalls for matrix viz
'''

import csv
import json

JSON_PATH = '../src/navigo-pointcalls-fields.json'
json_file = open(JSON_PATH, "r").read()
json_content = json.loads(json_file)

fields = set()

for key in json_content:
    items = json_content[key]
    for item in items:
        fields.add(item['field'])

fields = list(fields)

rows = []

CSV_FILE_OUTPUT = '../public/data/matrix-pointcalls.csv'

for year in ['1787', '1789']:
    CSV_FILE_INPUT = '../data/navigo_all_pointcalls_' + year + '.csv'

    with open(CSV_FILE_INPUT, newline='') as csvfile:
        reader = csv.DictReader(csvfile)

        for row_original in reader:
            row = dict.fromkeys(
                fields,
                '' # initial value for all fields
            )

            # Prendre tous les filters du JSON et les passer dans un if || pour filter les données du CSV
    

            for meta in row.keys():
                if meta == 'year':
                    row[meta] = year
                    continue
                if meta == 'pointcall_action':
                    row[meta] = row_original[meta].lower()
                    continue
                row[meta] = row_original[meta]

            rows.append(row)

with open(CSV_FILE_OUTPUT, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fields)

    writer.writeheader()
    for row in rows:
        writer.writerow(row)