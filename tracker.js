const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get('mode') === 'view';

let saveTimeout = null;

let partyData = [
    {
        name: "Dea",
        current: 30,
        max: 30,
        portrait: "images/dannika.png",
        pronouns: "they/them",
        player: "Stream",
        jobs: ["wizard"]
    },
    {
        name: "Bruh",
        current: 20,
        max: 35,
        portrait: "images/ayame.png",
        pronouns: "he/him",
        player: "Josh",
        jobs: ["fighter", "rogue"]
    }
];

const availableJobs = [
    "barbarian","bard","cleric","druid","fighter","monk",
    "paladin","ranger","rogue","sorcerer","warlock","wizard"
];

const jobStyles = {
    barbarian: { color: "#a93226aa", text: "white" },
    bard: { color: "#f4d03faa", text: "black" },
    cleric: { color: "#f8e287aa", text: "black" },
    druid: { color: "#239b56aa", text: "white" },
    fighter: { color: "#922b21aa", text: "white" },
    monk: { color: "#dc7633aa", text: "black" },
    paladin: { color: "#f7dc6faa", text: "black" },
    ranger: { color: "#196f3daa", text: "white" },
    rogue: { color: "#34495eaa", text: "white" },
    sorcerer: { color: "#8e44adaa", text: "white" },
    warlock: { color: "#4a235aaa", text: "white" },
    wizard: { color: "#5b2c6faa", text: "white" }
};

const jobAbbreviations = {
    barbarian: "BARB",
    bard: "BARD",
    cleric: "CLRC",
    druid: "DRUD",
    fighter: "FGHT",
    monk: "MONK",
    paladin: "PAL",
    ranger: "RANG",
    rogue: "ROG",
    sorcerer: "SORC",
    warlock: "WRLK",
    wizard: "WZRD"
};

const availablePortraits = [
    "images/ayame.png",
    "images/dannika.png",
    "images/klofna_f.png",
    "images/klofna_m.png",
    "images/purple.png",
    "images/shaktal.png"
];

/* ---------------- HELPERS ---------------- */

function getPercent(char) {
    if (!char.max) return 0;
    return Math.max(0, Math.min(100, (char.current / char.max) * 100));
}

function getColor(percent) {
    if (percent <= 0) return "grey";
    if (percent <= 10) return "red";
    if (percent <= 50) return "yellow";
    return "green";
}

/* ---------------- JOB UI ---------------- */

function buildJobOptions(selected) {
    let html = "";
    for (let j of availableJobs) {
        html += `<option value="${j}" ${j === selected ? "selected" : ""}>${j}</option>`;
    }
    return html;
}

function buildPortraitOptions(selected) {
    let html = "";
    for (let p of availablePortraits) {
        html += `<option value="${p}" ${p === selected ? "selected" : ""}>${p}</option>`;
    }
    return html;
}

function buildJobBars(jobs = []) {

    const useAbbr = jobs.length >= 3;

    return jobs.map(job => {

        const style = jobStyles[job] || { color: "#666666aa", text: "#fff" };
        const label = useAbbr
            ? (jobAbbreviations[job] || job.slice(0,4).toUpperCase())
            : job;

        return `
            <div class="job-bar ${job}" style="--job-color:${style.color}; color:${style.text}">
                <span>${label}</span>
            </div>
        `;
    }).join("");
}

/* ---------------- RENDER ---------------- */

function buildUI() {

    const target = document.getElementById("party-target");
    const forms = document.getElementById("forms-container");
    if (!target) return;

    let overlay = "";
    let editor = "";

    partyData.forEach((char, i) => {

        const percent = getPercent(char);
        const color = getColor(percent);

        overlay += `
        <div class="char-slot">

            <div class="portrait-area">
                <img id="pimg-${i}" class="char-image" src="${char.portrait}">
            </div>

            <div class="char-name">${char.name}</div>
            <div class="char-pronouns">${char.pronouns}</div>

            <div class="job-container">
                ${buildJobBars(char.jobs)}
            </div>

            <div class="char-player">${char.player}</div>

            <div class="progress">
                <div id="pbar-${i}" class="progress-bar ${color}" style="width:${percent}%"></div>
            </div>

            <div id="php-${i}" class="hp-text">
                ${char.current} / ${char.max}
            </div>

        </div>`;

        editor += `
        <div class="char-form-block">

            <input value="${char.name}" oninput="updateField(${i}, 'name', this.value)">
            <input value="${char.pronouns}" oninput="updateField(${i}, 'pronouns', this.value)">
            <input value="${char.player}" oninput="updateField(${i}, 'player', this.value)">

            <input type="number" value="${char.current}" oninput="updateField(${i}, 'current', this.value)">
            <input type="number" value="${char.max}" oninput="updateField(${i}, 'max', this.value)">

            <select onchange="updateField(${i}, 'portrait', this.value)">
                ${buildPortraitOptions(char.portrait)}
            </select>

        </div>`;
    });

    target.innerHTML = overlay;
    if (!isViewMode && forms) forms.innerHTML = editor;
}

/* ---------------- UPDATE ---------------- */

function updateOverlayOnly() {

    partyData.forEach((char, i) => {

        const percent = getPercent(char);
        const color = getColor(percent);

        const bar = document.getElementById("pbar-" + i);
        const hp = document.getElementById("php-" + i);
        const img = document.getElementById("pimg-" + i);

        if (bar) {
            bar.style.width = percent + "%";
            bar.className = "progress-bar " + color;
        }

        if (hp) hp.textContent = `${char.current} / ${char.max}`;
        if (img) img.src = char.portrait;
    });
}

function updateField(i, field, value) {

    if (field === "current" || field === "max") {
        value = parseInt(value);
        if (isNaN(value)) value = 0;
    }

    partyData[i][field] = value;

    updateOverlayOnly();
}
for (let j = 0; j < 3; j++) {

    let selectedJob = char.jobs[j] || '';

    formHTML +=
        '<div class="form-row">' +
            '<label>Job ' + (j + 1) + '</label>' +
            '<select onchange="updateJob(' + i + ', ' + j + ', this.value)">' +
                '<option value="">None</option>' +
                buildJobOptions(selectedJob) +
            '</select>' +
        '</div>';
}
formHTML +=
'<div class="char-form-block">' +

    '<div class="form-row">' +
        '<label>Name</label>' +
        '<input value="' + char.name + '" oninput="updateField(' + i + ', \'name\', this.value)">' +
    '</div>' +

    '<div class="form-row">' +
        '<label>Pronouns</label>' +
        '<input value="' + char.pronouns + '" oninput="updateField(' + i + ', \'pronouns\', this.value)">' +
    '</div>' +

    '<div class="form-row">' +
        '<label>Player</label>' +
        '<input value="' + char.player + '" oninput="updateField(' + i + ', \'player\', this.value)">' +
    '</div>';
formHTML +=
    '<div class="form-row">' +
        '<label>Current HP</label>' +
        '<input type="number" value="' + char.current + '" oninput="updateField(' + i + ', \'current\', this.value)">' +
    '</div>' +

    '<div class="form-row">' +
        '<label>Max HP</label>' +
        '<input type="number" value="' + char.max + '" oninput="updateField(' + i + ', \'max\', this.value)">' +
    '</div>' +

    '<div class="form-row">' +
        '<label>Portrait</label>' +
        '<select onchange="updateField(' + i + ', \'portrait\', this.value)">' +
            buildPortraitOptions(char.portrait) +
        '</select>' +
    '</div>' +

    '<button onclick="removeCharacter(' + i + ')">Remove</button>' +

'</div>';
/* ---------------- INIT ---------------- */

window.addEventListener("DOMContentLoaded", buildUI);
