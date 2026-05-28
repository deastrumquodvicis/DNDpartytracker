const BIN_ID = "6a17e7aa21f9ee59d2942861";
const MASTER_KEY = "$2a$10$9c4468sUxAYIXJeHOiWzleiSswaWsA43em.565yokW2ueiaQSWU.K";

const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get('mode') === 'view';

const defaultParty = [
    {
        name: "Dea",
        current: 30,
        max: 30,
        pronouns: "they/them",
        class1: "wizard",
        class2: "none",
        player: "Stream",
        portrait: "red_mage.png"
    }
];

let partyData = [...defaultParty];

const availableClasses = [
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
    { id: "wizard", label: "Wizard" }
];

function initialBuild() {

    const target = document.getElementById('party-target');
    const formsContainer = document.getElementById('forms-container');

    let htmlContent = '';

    let formContent = `
        <div class="global-controls">
            <button class="btn btn-add" onclick="addNewCharacter()">
                ➕ Add Character
            </button>

            <button class="btn btn-toggle" onclick="toggleOverlayArea()">
                👁 Hide Panels
            </button>
        </div>
    `;

    partyData.forEach((char, index) => {

        htmlContent += `
            <div class="char-slot" id="p${index}">

                <div class="portrait-area">
                    <img
                        id="stream-img-${index}"
                        class="char-image"
                        src="${char.portrait}"
                    >
                </div>

                <div class="progress">
                    <div
                        id="stream-bar-${index}"
                        class="progress-bar green"
                    ></div>
                </div>

                <div id="stream-hptext-${index}" class="hp-text"></div>

                <div id="stream-name-${index}" class="char-name">
                    ${char.name}
                </div>

                <div id="stream-pronouns-${index}" class="char-pronouns">
                    ${char.pronouns}
                </div>

                <div class="class-bars-container">

                    <div
                        id="stream-class1-${index}"
                        class="class-type-bar"
                    ></div>

                    <div
                        id="stream-class2-${index}"
                        class="class-type-bar"
                    ></div>

                </div>

                <div id="stream-player-${index}" class="char-player">
                    ${char.player}
                </div>

            </div>
        `;

        const classOptions1 = availableClasses.map(c =>
            `<option value="${c.id}" ${
                c.id === char.class1 ? 'selected' : ''
            }>${c.label}</option>`
        ).join('');

        const classOptions2 = availableClasses.map(c =>
            `<option value="${c.id}" ${
                c.id === char.class2 ? 'selected' : ''
            }>${c.label}</option>`
        ).join('');

        formContent += `
            <div class="char-form-block">

                <strong id="ui-title-${index}">
                    Slot ${index + 1}: ${char.name}
                </strong>

                <div class="form-row">
                    <label>HP:</label>

                    <div class="hp-inputs">

                        <input
                            type="number"
                            value="${char.current}"
                            oninput="updateField(${index}, 'current', this.value)"
                        >

                        <span>/</span>

                        <input
                            type="number"
                            value="${char.max}"
                            oninput="updateField(${index}, 'max', this.value)"
                        >

                    </div>
                </div>

                <div class="form-row">
                    <label>Name:</label>

                    <input
                        type="text"
                        value="${char.name}"
                        oninput="updateField(${index}, 'name', this.value)"
                    >
                </div>

                <div class="form-row">
                    <label>Pronouns:</label>

                    <input
                        type="text"
                        value="${char.pronouns}"
                        oninput="updateField(${index}, 'pronouns', this.value)"
                    >
                </div>

                <div class="form-row">
                    <label>Player:</label>

                    <input
                        type="text"
                        value="${char.player}"
                        oninput="updateField(${index}, 'player', this.value)"
                    >
                </div>

                <div class="form-row">
                    <label>Class 1:</label>

                    <select
                        onchange="updateField(${index}, 'class1', this.value)"
                    >
                        ${classOptions1}
                    </select>
                </div>

                <div class="form-row">
                    <label>Class 2:</label>

                    <select
                        onchange="updateField(${index}, 'class2', this.value)"
                    >
                        ${classOptions2}
                    </select>
                </div>

            </div>
        `;
    });

    target.innerHTML = htmlContent;

    if (!isViewMode) {
        formsContainer.innerHTML = formContent;
    }

    updateVisualsOnly();
}

function updateVisualsOnly() {

    partyData.forEach((char, index) => {

        const percent = char.max > 0
            ? Math.min(
                Math.max((char.current / char.max) * 100, 0),
                100
            )
            : 0;

        let colorClass = 'green';

        if (char.current <= 0) {
            colorClass = 'grey';
        }
        else if (percent <= 10) {
            colorClass = 'red';
        }
        else if (percent <= 50) {
            colorClass = 'yellow';
        }

        const bar = document.getElementById(`stream-bar-${index}`);

        if (bar) {
            bar.style.width = `${percent}%`;
            bar.className = `progress-bar ${colorClass}`;
        }

        const hp = document.getElementById(`stream-hptext-${index}`);
        if (hp) hp.innerText = `${char.current} / ${char.max}`;

        const img = document.getElementById(`stream-img-${index}`);

        if (img) {
            img.src = char.portrait;

            img.className =
                char.current <= 0
                    ? 'char-image dead-portrait'
                    : 'char-image';
        }

        const c1 = document.getElementById(`stream-class1-${index}`);
        const c2 = document.getElementById(`stream-class2-${index}`);

        if (c1) {
            c1.innerText = char.class1;
            c1.className = `class-type-bar class-bar-${char.class1}`;
        }

        if (c2) {

            if (char.class2 === 'none') {
                c2.className = 'class-bar-none';
                c2.innerText = '';
            }
            else {
                c2.innerText = char.class2;
                c2.className = `class-type-bar class-bar-${char.class2}`;
            }
        }
    });
}

let saveTimeout = null;

function updateField(index, field, value) {

    if (field === 'current' || field === 'max') {
        partyData[index][field] = parseInt(value) || 0;
    }
    else {
        partyData[index][field] = value;
    }

    updateVisualsOnly();

    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {
        pushDataToCloud();
    }, 300);
}

function addNewCharacter() {

    partyData.push({
        name: "New Hero",
        current: 10,
        max: 10,
        pronouns: "they/them",
        class1: "fighter",
        class2: "none",
        player: "Guest",
        portrait: "warrior.png"
    });

    initialBuild();

    pushDataToCloud();
}

function toggleOverlayArea() {

    const panel = document.getElementById('ui-controls');

    if (panel) {
        panel.classList.toggle('hidden');
    }
}

async function pushDataToCloud() {

    try {

        await fetch(
            'https://api.jsonbin.io/v3/b/' + BIN_ID,
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': MASTER_KEY
                },

                body: JSON.stringify({
                    party: partyData
                })
            }
        );

    } catch (err) {
        console.error(err);
    }
}

async function loadDataFromCloud(isInitial) {

    try {

        const res = await fetch(
            'https://api.jsonbin.io/v3/b/' + BIN_ID + '/latest',
            {
                headers: {
                    'X-Master-Key': MASTER_KEY
                }
            }
        );

        const response = await res.json();

        if (response.record?.party) {

            partyData = response.record.party;

            if (isInitial) {
                initialBuild();
            }
            else {
                updateVisualsOnly();
            }
        }

    } catch (err) {

        console.error(err);

        if (isInitial) {
            initialBuild();
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {

    if (isViewMode) {

        document
            .getElementById('ui-controls')
            ?.classList.add('hidden');
    }

    await loadDataFromCloud(true);

    if (isViewMode) {

        setInterval(() => {
            loadDataFromCloud(false);
        }, 1500);
    }
});
```
