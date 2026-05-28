var BIN_ID = "6a17e7aa21f9ee59d2942861";
var MASTER_KEY = "$2a$10$9c4468sUxAYIXJeHOiWzleiSswaWsA43em.565yokW2ueiaQSWU.K";

var urlParams = new URLSearchParams(window.location.search);
var isViewMode = urlParams.get('mode') === 'view';


window.addEventListener('DOMContentLoaded', function() {
    var panel = document.getElementById('ui-controls');
    if (panel && isViewMode) {
        panel.classList.add('hidden');
    }
});

var defaultParty = [
    { name: "Dea", current: 30, max: 30, pronouns: "they/them", class1: "wizard", class2: "none", player: "Stream", portrait: "red_mage.png" },
    { name: "Bruh", current: 35, max: 35, pronouns: "he/him", class1: "fighter", class2: "none", player: "Stream", portrait: "warrior.png" },
    { name: "Hitz", current: 28, max: 28, pronouns: "she/her", class1: "barbarian", class2: "none", player: "Stream", portrait: "black_belt.png" },
    { name: "Hiil", current: 25, max: 25, pronouns: "he/him", class1: "cleric", class2: "wizard", player: "Stream", portrait: "white_mage.png" }
];

var partyData = defaultParty;
var availablePortraits = ["red_mage.png", "warrior.png", "black_belt.png", "white_mage.png"];

var availableClasses = [
    { id: "none", label: "None / Single Class" },
    { id: "barbarian", label: "Barbarian" },
    { id: "bard", label: "Bard" },
    { id: "cleric", label: "Cleric" },
    { id: "druid", label: "Druid" },
    { id: "fighter", label: "Fighter" },
    { id: "monk", label: "Monk" },
    { id: "paladin", label: "Paladin" },
    { id: "ranger", label: "Ranger" },
    { id: "rogue", label: "Rogue" },
    { id: "sorcerer", label: "Sorcerer" },
    { id: "warlock", label: "Warlock" },
    { id: "wizard", label: "Wizard" },
    { id: "bug", label: "Bug (Test)" }
];
function initialBuild() {
    var target = document.getElementById('party-target');
    var formsContainer = document.getElementById('forms-container');
    var htmlContent = '';
    var formContent = '<div class="global-controls"><button class="btn btn-add" onclick="addNewCharacter()">➕ Add Character</button><button class="btn btn-toggle" onclick="toggleOverlayArea()">👁️ Hide Panels</button></div>';
    
    partyData.forEach(function(char, index) {
        htmlContent += '<div class="char-slot" id="p' + index + '"><div class="portrait-area"><img id="stream-img-' + index + '" class="char-image" src="' + char.portrait + '" onerror="this.style.display=\'none\'"></div><div class="progress"><div id="stream-bar-' + index + '" class="progress-bar green"></div></div><div id="stream-hptext-' + index + '" class="hp-text">0 / 0</div><div id="stream-name-' + index + '" class="char-name">' + char.name + '</div><div id="stream-pronouns-' + index + '" class="char-pronouns">' + char.pronouns + '</div><div class="class-bars-container"><div id="stream-class1-' + index + '" class="class-type-bar"></div><div id="stream-class2-' + index + '" class="class-type-bar"></div></div><div id="stream-player-' + index + '" class="char-player">' + char.player + '</div></div>';
        
        formContent += '<div class="char-form-block"><strong id="ui-title-' + index + '">Slot ' + (index + 1) + ': ' + (char.name || 'Unnamed') + '</strong><div class="form-row" style="margin-top:5px;"><label>HP:</label><div class="hp-inputs"><input type="number" id="input-curr-' + index + '" value="' + char.current + '" oninput="updateField(' + index + ', \'current\', this.value)" title="Current HP"><span>/</span><input type="number" id="input-max-' + index + '" value="' + char.max + '" oninput="updateField(' + index + ', \'max\', this.value)" title="Max HP"></div></div><div class="form-row"><label>Name:</label><input type="text" value="' + char.name + '" oninput="updateField(' + index + ', \'name\', this.value)"></div><div class="form-row"><label>Pronouns:</label><input type="text" value="' + char.pronouns + '" oninput="updateField(' + index + ', \'pronouns\', this.value)"></div><div class="form-row"><label>Player:</label><input type="text" value="' + char.player + '" oninput="updateField(' + index + ', \'player\', this.value)"></div><div class="form-row"><label>Class 1:</label><select onchange="updateField(' + index + ', \'class1\', this.value)"><option value="barbarian">Barbarian</option><option value="bard">Bard</option><option value="cleric">Cleric</option><option value="druid">Druid</option><option value="fighter">Fighter</option><option value="monk">Monk</option><option value="paladin">Paladin</option><option value="ranger">Ranger</option><option value="rogue">Rogue</option><option value="sorcerer">Sorcerer</option><option value="warlock">Warlock</option><option value="wizard">Wizard</option><option value="bug">Bug (Test)</option></select></div><div class="form-row"><label>Class 2:</label><select onchange="updateField(' + index + ', \'class2\', this.value)"><option value="none">None / Single Class</option><option value="barbarian">Barbarian</option><option value="bard">Bard</option><option value="cleric">Cleric</option><option value="druid">Druid</option><option value="fighter">Fighter</option><option value="monk">Monk</option><option value="paladin">Paladin</option><option value="ranger">Ranger</option><option value="rogue">Rogue</option><option value="sorcerer">Sorcerer</option><option value="warlock">Warlock</option><option value="wizard">Wizard</option><option value="bug">Bug (Test)</option></select></div><div class="form-row"><label>Portrait:</label><select onchange="updateField(' + index + ', \'portrait\', this.value)"><option value="red_mage.png">red_mage.png</option><option value="warrior.png">warrior.png</option><option value="black_belt.png">black_belt.png</option><option value="white_mage.png">white_mage.png</option></select></div><button class="btn btn-remove" onclick="removeCharacter(' + index + ')">❌ Remove Character</button></div>';
    });
    if (target) target.innerHTML = htmlContent;
    if (formsContainer) formsContainer.innerHTML = formContent;
    updateVisualsOnly();
}

function updateVisualsOnly() {
    partyData.forEach(function(char, index) {
        var percent = Math.min(Math.max((char.current / char.max) * 100, 0), 100);
        if (isNaN(percent)) percent = 0;
        var colorClass = 'green';
        if (char.current <= 0) { colorClass = 'grey'; }
        else if (percent <= 10) { colorClass = 'red'; }
        else if (percent <= 50) { colorClass = 'yellow'; }
        
        var bar = document.getElementById('stream-bar-' + index);
        if (bar) { bar.style.width = percent + '%'; bar.className = 'progress-bar ' + colorClass; }
        
        var hpText = document.getElementById('stream-hptext-' + index);
        if (hpText) hpText.innerText = char.current + ' / ' + char.max;
        
        var nameText = document.getElementById('stream-name-' + index);
        if (nameText) nameText.innerText = char.name;
        
        var pronounsText = document.getElementById('stream-pronouns-' + index);
        if (pronounsText) pronounsText.innerText = char.pronouns;
        
        var playerText = document.getElementById('stream-player-' + index);
        if (playerText) playerText.innerText = char.player;
        
        var c1Bar = document.getElementById('stream-class1-' + index);
        if (c1Bar) {
            var label1 = char.class1;
            for (var i = 0; i < availableClasses.length; i++) { if (availableClasses[i].id === char.class1) label1 = availableClasses[i].label; }
            c1Bar.innerText = label1; c1Bar.className = 'class-type-bar class-bar-' + char.class1;
        }
        
        var c2Bar = document.getElementById('stream-class2-' + index);
        if (c2Bar) {
            if (char.class2 === 'none' || !char.class2) { c2Bar.innerText = ''; c2Bar.className = 'class-bar-none'; }
            else {
                var label2 = char.class2;
                for (var j = 0; j < availableClasses.length; j++) { if (availableClasses[j].id === char.class2) label2 = availableClasses[j].label; }
                c2Bar.innerText = label2; c2Bar.className = 'class-type-bar class-bar-' + char.class2;
            }
        }
        
        var imgElem = document.getElementById('stream-img-' + index);
        if (imgElem) {
            imgElem.src = char.portrait; imgElem.style.display = 'block';
            if (char.current <= 0) { imgElem.className = 'char-image dead-portrait'; } else { imgElem.className = 'char-image'; }
        }
        
        var uiTitle = document.getElementById('ui-title-' + index);
        if (uiTitle) uiTitle.innerText = 'Slot ' + (index + 1) + ': ' + (char.name || 'Unnamed');
    });
}

var saveTimeout = null;
function updateField(index, field, value) {
    if (field === 'current' || field === 'max') { partyData[index][field] = parseInt(value) || 0; } else { partyData[index][field] = value; }
    updateVisualsOnly();
    if (!isViewMode) { clearTimeout(saveTimeout); saveTimeout = setTimeout(pushDataToCloud, 400); }
}

function addNewCharacter() {
    partyData.push({ name: "New Hero", current: 10, max: 10, pronouns: "they/them", class1: "fighter", class2: "none", player: "Guest", portrait: "warrior.png" });
    initialBuild();
    if (!isViewMode) pushDataToCloud();
}

function removeCharacter(index) {
    if (confirm("Are you sure you want to delete this slot?")) { partyData.splice(index, 1); initialBuild(); if (!isViewMode) pushDataToCloud(); }
}

function toggleOverlayArea() { var panel = document.getElementById('ui-controls'); if (panel) { panel.classList.toggle('hidden'); } }

function pushDataToCloud() {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://jsonbin.io' + BIN_ID, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Master-Key', MASTER_KEY);
    xhr.send(JSON.stringify({ party: partyData }));
}

function loadDataFromCloud(isInitial) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonbin.io' + BIN_ID + '/latest', true);
    xhr.setRequestHeader('X-Master-Key', MASTER_KEY);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.record && response.record.party) {
                var incoming = response.record.party;
                if (incoming.length === 0 && !isViewMode && isInitial) { pushDataToCloud(); return; }
                if (JSON.stringify(incoming) !== JSON.stringify(partyData)) {
                    var lengthShift = incoming.length !== partyData.length;
                    partyData = incoming;
                    if (lengthShift || isInitial) { initialBuild(); } else { updateVisualsOnly(); }
                }
            }
        }
    };
    xhr.send();
}

if (isViewMode) { setInterval(function() { loadDataFromCloud(false); }, 1500); }
loadDataFromCloud(true);
