#!/bin/sh -e
rm -f air_data*
python generate_random_data.py
sed -i -e 's/'\''/"/g' air_data.json
jsonlint -v -f air_data.json > air_data_format.json
gzip -c air_data.json > air_data.json.gz