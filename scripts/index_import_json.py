#!python3
import os

from algoliasearch.search_client import SearchClient
from dotenv import load_dotenv, find_dotenv
import json
import random
import random_name

load_dotenv(find_dotenv())

# Real address data from https://github.com/EthanRBrown/rrad
DATA_FILE = '../data/addresses-us-all.json'

def main():
  # read file
  with open(DATA_FILE, 'r') as f:
      data=f.read()

  # Build records from data
  json_data = json.loads(data)
  records = transform_records(json_data['addresses'])
  
  # Write the records to a file
  with open('../data/address-records.json', 'w') as outfile:
    json.dump(records, outfile)

  update_index(records)


def transform_records(addresses):
  address_records = []
  for address in addresses:
    record = {}
    record_geocode = {}
    # One in ten chance agency is preferred 
    record['preferred'] = 10 == random.randint(1,10)

    record['objectID'] = random_name.generate_name().title()
    if record['preferred']:
      record['name'] = f"{record['objectID']} Agency (Preferred)"
    else:
      record['name'] = f"{record['objectID']} Agency"
    record['address'] = address.get('address1')
    record['city'] = address.get('city')
    record['state'] = address.get('state')
    record['zip'] = address.get('postalCode')
    record_geocode['lat'] = address['coordinates']['lat']
    record_geocode['lng'] = address['coordinates']['lng']
    record['_geoloc'] = record_geocode
    address_records.append(record)
  return address_records


def update_index(covid_records):
  # Create the index
  client = SearchClient.create(os.getenv('APP_ID'), os.getenv('API_KEY'))
  index = client.init_index(os.getenv('ALGOLIA_INDEX_NAME'))
  index.clear_objects()
  index.save_objects(covid_records)


if __name__ == "__main__":
  main()
