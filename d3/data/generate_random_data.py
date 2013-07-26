__author__ = 'jalie'

from domain import Substance, Source, Municipality
import random

data = []

runner = 1
for municipality in Municipality:
	for year in range(2009, 2012):
		for source in Source:
			for substance in Substance:
				entry = {"_id": runner, "m": municipality.name, "s": source.name,
						 "sub": substance.name, "y": year,
						 "a": random.randint(0, 200)}
				data.append(entry)
				runner += 1
f = open('air_data.json', 'w')
f.write('{ "data":' + str(data) + '}')
