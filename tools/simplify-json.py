import json
import argparse

def simplify_field(field):
    if 'N' in field:
        return int(field['N'])
    if 'S' in field:
        return field['S']
    if 'L' in field:
        return [simplify_field(value) for value in field['L']]
    if 'M' in field:
        return dict((key, simplify_field(value)) for key, value in field['M'].items())
    return field

def simplify_item(item):
    simplified = {}
    for key, value in item.items():
        if isinstance(value, dict):
            simplified[key] = simplify_field(value)
        elif isinstance(value, list):
            simplified[key] = value
        else:
            simplified[key] = value
    return simplified

def simplify_json(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)

    return [simplify_item(item) for item in data['Items']]

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Simplify JSON file')
    parser.add_argument('json_file', type=str, help='JSON file to simplify')
    args = parser.parse_args()
    data = simplify_json(args.json_file)
    print(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
