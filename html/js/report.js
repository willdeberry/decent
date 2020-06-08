const worldBuffs = [
    "Fengus' Ferocity",
    "Mol'dar's Moxie",
    "Rallying Cry of the Dragonslayer",
    "Slip'kik's Savvy",
    "Songflower Serenade",
    "Spirit of Zandalar",
    "Warchief's Blessing",
    //"Sayge's Dark Fortune of Damage",
    //"Sayge's Dark Fortune of Resistance",
    //"Sayge's Dark Fortune of Armor",
    //"Sayge's Dark Fortune of Intelligence",
    //"Sayge's Dark Fortune of Spirit",
    //"Sayge's Dark Fortune of Stamina",
    //"Sayge's Dark Fortune of Strength",
    //"Sayge's Dark Fortune of Agility",
]

function generateDOM(data) {
    let divs = document.getElementsByClassName('reportDiv');
    if (divs.length > 0) {
        for (div of divs) {
            div.parentNode.removeChild(div);
        }
    }

    if (data.value.length > 0) {
        let spinner = document.getElementById('spinner');
        spinner.removeAttribute('hidden');
        getReports(data.value);
    }
}

function getReports(zone) {
    fetch('https://decent.team/api/buffReport?zone=' + zone)
        .then(response => response.json())
        .then(responseData => {
            responseData.forEach(element => {
                let parentDiv = document.getElementById('parent');
                let div = document.createElement('div');
                div.classList.add('reportDiv');
                parentDiv.appendChild(div);
                var dateTime = new Date(element.datetime)
                var h1 = document.createElement('h1');
                h1.innerHTML = element.title + ' ' + dateTime.getFullYear() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getDate();
                div.appendChild(h1);
                var table = document.createElement('table')
                table.classList.add('table', 'table-hover', 'table-dark', 'table-bordered');
                generateTableHead(table);
                generateTable(table, element);
                div.appendChild(table);
            });
        });
}

function generateTableHead(table) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    let th = document.createElement('th');
    let text = document.createTextNode('Name');
    th.appendChild(text);
    row.appendChild(th);
    worldBuffs.forEach(buff => {
        let th = document.createElement('th');
        let text = document.createTextNode(buff);
        th.appendChild(text);
        row.appendChild(th);
    });
    let perc_th = document.createElement('th');
    let perc_text = document.createTextNode('Buff %');
    perc_th.appendChild(perc_text);
    row.appendChild(perc_th);
}

function generateTable(table, data) {
    let totalBuffs = worldBuffs.length;
    let tbody = table.createTBody();
    data['attendance'].forEach(player => {
        let totalActiveBuffs = 0;
        let row = tbody.insertRow();
        let cell = row.insertCell();
        let text = document.createTextNode(player.name);
        cell.appendChild(text);
        worldBuffs.forEach(wbuff => {
            let buff_cell = row.insertCell();

            data['buffs'].forEach(buff => {
                if (wbuff !== buff.name) {
                    return
                }

                if (buff['players'].includes(player.name)) {
                    buff_cell.style.backgroundColor = "green";
                    totalActiveBuffs += 1;
                }
            });
        });
        let percentage = totalActiveBuffs / totalBuffs * 100;
        let perc_cell = row.insertCell();
        let perc_text = document.createTextNode(percentage.toFixed(2));
        perc_cell.appendChild(perc_text)
    });
    let spinner = document.getElementById('spinner');
    spinner.setAttribute('hidden', true);
}
