from flask import Flask, request
import json
import requests
import time


app = Flask(__name__)
api_data = None

with open('private.json', 'r') as f:
    api_data = json.loads(f.read())


@app.route('/api/reports')
def get_reports():
    url = '{}/reports/guild/decent/kromcrush/us?start=1591488682253&api_key={}'.format(api_data['host'], api_data['key'])
    return requests.get(url).text


@app.route('/api/buffs')
def get_buffs(raid_id = None):
    if raid_id:
        raid = raid_id
    else:
        raid = request.args.get('raid')

    url = '{}/report/tables/buffs/{}?end=10000000&api_key={}'.format(api_data['host'], raid, api_data['key'])
    return requests.get(url).text


@app.route('/api/buffActive')
def buff_active(raid_id = None, buff_id = None):
    if raid_id and buff_id:
        raid = raid_id
        buff = buff_id
    else:
        raid = request.args.get('raid')
        buff = request.args.get('buff')

    url = '{}/report/tables/buffs/{}?end=10000000&abilityid={}&api_key={}'.format(api_data['host'], raid, buff, api_data['key'])
    r = requests.get(url).json()
    return json.dumps(r['auras'])


@app.route('/api/buffReport')
def buff_report():
    zone = int(request.args.get('zone'))
    reports = json.loads(get_reports())
    final_report = get_reports_data(reports, zone)
    return json.dumps(final_report)


def get_attendance(raid):
    url = '{}/report/fights/{}?api_key={}'.format(api_data['host'], raid, api_data['key'])
    return requests.get(url).json()['exportedCharacters']


def get_reports_data(reports, zone):
    data = []
    for report in reports:
        if report['zone'] != zone:
            continue

        report_data = {
            "id": report['id'],
            "title": report['title'],
            "datetime": report['start'],
            "buffs": [],
            "attendance": get_attendance(report['id'])
        }

        buffs = json.loads(get_buffs(report['id']))
        report_data['buffs'] = get_buffs_data(report['id'], buffs['auras'])

        data.append(report_data)

    return data


def get_buffs_data(raid, buffs):
    data = []
    world_buffs = [
        "Warchief's Blessing",
        "Rallying Cry of the Dragonslayer",
        "Spirit of Zandalar",
        "Sayge's Dark Fortune of Damage",
        "Sayge's Dark Fortune of Resistance",
        "Sayge's Dark Fortune of Armor",
        "Sayge's Dark Fortune of Intelligence",
        "Sayge's Dark Fortune of Spirit",
        "Sayge's Dark Fortune of Stamina",
        "Sayge's Dark Fortune of Strength",
        "Sayge's Dark Fortune of Agility",
        "Mol'dar's Moxie",
        "Fengus' Ferocity",
        "Slip'kik's Savvy",
        "Songflower Serenade"
    ]

    for buff in buffs:
        if buff['name'] not in world_buffs:
            continue

        buff_data = {
            "id": buff['guid'],
            "name": buff["name"],
            "players": []
        }

        players = json.loads(buff_active(raid, buff['guid']))
        buff_data['players'] = [player['name'] for player in players]

        data.append(buff_data)

    return data



if __name__ == '__main__':
    app.run()
