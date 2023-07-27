import argparse
import urllib.request
import json
import urllib.parse

parser = argparse.ArgumentParser(description='Get the definition of a term from Urban Dictionary.')
parser.add_argument('term', metavar='TERM', type=str, nargs='+', help='the term to look up on Urban Dictionary')
args = parser.parse_args()

query = ' '.join(args.term)
query_encoded = urllib.parse.quote(query)
url = f'http://api.urbandictionary.com/v0/define?term={query_encoded}'

response = urllib.request.urlopen(url)
data = json.loads(response.read())

max_thumbs_up = 0
definition_with_most_thumbs_up = ""
example_with_most_thumbs_up=""
thumbs_down_for_top_def=""

for item in data["list"]:
    thumbs_up = item["thumbs_up"]
    definition = item["definition"]
    example = item["example"]
    thumbs_down = item["thumbs_down"]
    
    # Check if current definition has more thumbs up
    if thumbs_up > max_thumbs_up:
        max_thumbs_up = thumbs_up
        thumbs_down_for_top_def = thumbs_down
        definition_with_most_thumbs_up = definition
        example_with_most_thumbs_up = example

if len(definition) > 2000:
    definition = data['list'][1]['definition']
    example = data['list'][1]['definition']
else:
    definition = definition_with_most_thumbs_up 
    example = example

print(f"{definition}|{example_with_most_thumbs_up}|{max_thumbs_up}|{thumbs_down_for_top_def}")