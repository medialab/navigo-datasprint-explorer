'''
    File name: pointcalls.py
    Author: Guillaume Brioudes (https://myllaume.fr/)
    Date created: 2022-02-23
    Date last modified: 2022-02-23
    Python Version: 3.10.1
    Description: Get all flows for matrix viz
'''

import csv
import json

JSON_PATH = '../src/json/navigo-flows-fields.json'
json_file = open(JSON_PATH, "r").read()
json_content = json.loads(json_file)

fields = set()
filters = {}

# Get filters and metas (column head) from the same JSON who display data controls
for filter in json_content['filters']:
    field = filter['field']
    value = filter['value']
    filters[field] = value

for key in json_content:
    items = json_content[key]
    for item in items:
        fields.add(item['field'])

fields = list(fields)

rows = []

CSV_FILE_OUTPUT = '../public/data/flows.csv'

for year in ['1787', '1789']:
    CSV_FILE_INPUT = '../data/navigo_all_flows_' + year + '.csv'

    with open(CSV_FILE_INPUT, newline='') as csvfile:
        reader = csv.DictReader(csvfile)

        for row_original in reader:
            row = dict.fromkeys(
                fields,
                '' # initial value for all fields
            )

            # If the line values does not match with any filter, the line is thrown
            filter_test = []
            for meta in filters.keys():
                filter_value = filters[meta]
                if row_original[meta] == filter_value:
                    filter_test.append(True)
                else:
                    filter_test.append(False)
            if any(filter_test) == False:
                continue

            for meta in row.keys():
                if meta == 'year': # add year to metas
                    row[meta] = year
                    continue
                if (
                    meta == 'departure_action' or
                    meta == 'destination_action'
                ): # lowercase to reconcile ex: 'In-out' and 'in-out' values 
                    row[meta] = row_original[meta].lower()
                    continue
                row[meta] = row_original[meta]

            rows.append(row)

with open(CSV_FILE_OUTPUT, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fields)

    writer.writeheader()
    for row in rows:
        writer.writerow(row)