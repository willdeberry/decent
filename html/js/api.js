var raid = null;

function getReports() {
    console.log('getReports');
    var select = document.getElementById('reports');
    select.setAttribute('onchange', 'getBuffs(this)');

    fetch('https://decent.team/api/reports')
        .then(response => response.json())
        .then(responseData => {
            responseData.forEach(element => {
                var option = document.createElement('option');
                var dateTime = new Date(element.start)
                option.text = element.title + ' ' + dateTime.getFullYear() + '/' + dateTime.getMonth() + '/' + dateTime.getDate();
                option.value = element.id;
                select.add(option, null);
            });
        });
}

function getBuffs(data) {
    console.log('getBuffs');
    raid = data.value;
    var playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    const worldBuffs = [
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

    var select = document.getElementById('buffs');
    select.setAttribute('onchange', 'getActive(this)');
    select.innerHTML = '<option>Choose the buff</option>';

    fetch('https://decent.team/api/buffs?raid=' + raid)
        .then(response => response.json())
        .then(responseData => {
            var auras = responseData['auras'];
            auras.sort(sortNames);
            select.disabled = false;

            auras.forEach(element => {
                if (!(worldBuffs.includes(element.name))) {
                    return;
                }
                var option = document.createElement('option');
                option.text = element.name;
                option.value = element.guid;
                select.add(option, null);
            });
        });
}

function getActive(data) {
    console.log('getActive');
    var playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    fetch('https://decent.team/api/buffActive?raid=' + raid + '&buff=' + data.value)
        .then(response => response.json())
        .then(responseData => {
            responseData.forEach(element => {
                var listItem = document.createElement('li');
                listItem.innerHTML = element.name;
                playerList.appendChild(listItem);
            });
        });
}

function sortNames(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    } else {
        return 0;
    }
}

document.addEventListener("DOMContentLoaded", function(){
    getReports();
});
