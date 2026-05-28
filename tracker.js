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

function getPercent(char) {
    if (!char.max || char.max <= 0) return 0;
    return Math.max(0, Math.min(100, (char.current / char.max) * 100));
}

function getColor(char, percent) {
    if (char.current <= 0) return "grey";
    if (percent <= 10) return "red";
    if (percent <= 50) return "yellow";
    return "green";
}

function buildPortraitOptions(selected) {
    let html = "";
    for (let i = 0; i < availablePortraits.length; i++) {
        const p = availablePortraits[i];
        html += '<option value="' + p + '"' + (p === selected ? " selected" : "") + '>' + p + '</option>';
    }
    return html;
}

function buildJobOptions(selected) {
    let html = "";
    for (let i = 0; i < availableJobs.length; i++) {
        const j = availableJobs[i];
        html += '<option value="' + j + '"' + (j === selected ? " selected" : "") + '>' + j + '</option>';
    }
    return html;
}

function buildJobBars(jobs) {
    let html = "";
    const useAbbr = jobs.length >= 3;

    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        if (!job) continue;

        const style = jobStyles[job] || { color: "#666666aa", text: "white" };
        let label = useAbbr ? (jobAbbreviations[job] || job.slice(0,3).toUpperCase()) : job;

        html +=
            '<div class="job-bar ' + job + '" style="background-color:' +
            style.color + ';color:' + style.text + ';">' +
            label +
            '</div>';
    }

    return html;
}

/* ---------------- UI ---------------- */

function buildUI() {
    const target = document.getElementById("party-target");
    const forms = document.getElementById("forms-container");
    if (!target) return;

    let overlayHTML = "";
    let formHTML = "";

    for (let i = 0; i < partyData.length; i++) {
        const char = partyData[i];
        const percent = getPercent(char);
        const color = getColor(char, percent);

        overlayHTML +=
            '<div class="char-slot">' +
                '<div class="portrait-area">' +
                    '<img id="pimg-' + i + '" class="char-image" src="' + char.portrait + '">' +
                '</div>' +

                '<div class="char-name">' + char.name + '</div>' +
                '<div class="char-pronouns">' + char.pronouns + '</div>' +
                '<div class="job-container">' + buildJobBars(char.jobs || []) + '</div>' +
                '<div class="char-player">' + char.player + '</div>' +

                '<div class="progress">' +
                    '<div id="pbar-' + i + '" class="progress-bar ' + color + '" style="width:' + percent + '%"></div>' +
                '</div>' +

                '<div id="php-' + i + '" class="hp-text">' +
                    char.current + ' / ' + char.max +
                '</div>' +
            '</div>';

        formHTML +=
            '<div class="char-form-block">' +
                '<input value="' + char.name + '" oninput="updateField(' + i + ', \'name\', this.value)">' +
                '<input value="' + char.pronouns + '" oninput="updateField(' + i + ', \'pronouns\', this.value)">' +
                '<input value="' + char.player + '" oninput="updateField(' + i + ', \'player\', this.value)">' +

                '<input type="number" value="' + char.current + '" oninput="updateField(' + i + ', \'current\', this.value)">' +
                '<input type="number" value="' + char.max + '" oninput="updateField(' + i + ', \'max\', this.value)">' +

                '<select onchange="updateField(' + i + ', \'portrait\', this.value)">' +
                    buildPortraitOptions(char.portrait) +
                '</select>' +
            '</div>';
    }

    target.innerHTML = overlayHTML;
    if (!isViewMode && forms) forms.innerHTML = formHTML;
}

function updateOverlayOnly() {
    for (let i = 0; i < partyData.length; i++) {
        const char = partyData[i];
        const percent = getPercent(char);
        const color = getColor(char, percent);

        const bar = document.getElementById("pbar-" + i);
        const hp = document.getElementById("php-" + i);
        const img = document.getElementById("pimg-" + i);

        if (bar) {
            bar.style.width = percent + "%";
            bar.className = "progress-bar " + color;
        }

        if (hp) hp.textContent = char.current + " / " + char.max;
        if (img) img.src = char.portrait;
    }
}

function updateField(index, field, value) {
    if (field === "current" || field === "max") {
        value = parseInt(value);
        if (isNaN(value)) value = 0;
    }

    partyData[index][field] = value;
    updateOverlayOnly();
}

window.addEventListener("DOMContentLoaded", () => {
    buildUI();
});
