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
    "barbarian",
    "bard",
    "cleric",
    "druid",
    "fighter",
    "monk",
    "paladin",
    "ranger",
    "rogue",
    "sorcerer",
    "warlock",
    "wizard"
];
const jobStyles = {

    barbarian: {
        color: "#a93226aa",
        text: "white"
    },

    bard: {
        color: "#f4d03faa",
        text: "black"
    },

    cleric: {
        color: "#f8e287aa",
        text: "black"
    },

    druid: {
        color: "#239b56aa",
        text: "white"
    },

    fighter: {
        color: "#922b21aa",
        text: "white"
    },

    monk: {
        color: "#dc7633aa",
        text: "black"
    },

    paladin: {
        color: "#f7dc6faa",
        text: "black"
    },

    ranger: {
        color: "#196f3daa",
        text: "white"
    },

    rogue: {
        color: "#34495eaa",
        text: "white"
    },

    sorcerer: {
        color: "#8e44adaa",
        text: "white"
    },

    warlock: {
        color: "#4a235aaa",
        text: "white"
    },

    wizard: {
        color: "#5b2c6faa",
        text: "white"
    }
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

    let html = '';

    for (let i = 0; i < availablePortraits.length; i++) {

        const portrait = availablePortraits[i];

        html +=
            '<option value="' + portrait + '"';

        if (portrait === selected) {
            html += ' selected';
        }

        html += '>' + portrait + '</option>';
    }

    return html;
}
function buildJobBars(jobs) {

    let html = '';

    const useAbbreviations = jobs.length >= 3;

    for (let i = 0; i < jobs.length; i++) {

        const job = jobs[i];

        const style =
            jobStyles[job] ||
            {
                color: "#666666aa",
                text: "white"
            };

        let label = job;

        if (useAbbreviations) {

            label =
                jobAbbreviations[job] ||
                job.substring(0, 3).toUpperCase();
        }

        html +=
            '<div class="job-bar ' + job + '" ' +

                'style="' +
                    'background-color:' + style.color + ';' +
                    'color:' + style.text + ';' +
                '">' +

                label +

            '</div>';
    }

    return html;
}
/* -------------------------
   INITIAL BUILD (FULL RENDER)
-------------------------- */
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
for (let j = 0; j < 3; j++) {

    let selectedJob = '';

    if (char.jobs[j]) {
        selectedJob = char.jobs[j];
    }

    formHTML +=
        '<div class="form-row">' +
            '<label>Job ' + (j + 1) + '</label>' +

            '<select onchange="updateJob(' + i + ', ' + j + ', this.value)">' +

                '<option value="">None</option>' +

                buildJobOptions(selectedJob) +

            '</select>' +
        '</div>';
}
        overlayHTML +=
            '<div class="char-slot">' +

               '<div class="portrait-area">' +
    '<img id="pimg-' + i + '" class="char-image" src="' + char.portrait + '">' +
'</div>' +

'<div class="char-name">' +
    char.name +
'</div>' +

'<div class="char-pronouns">' +
    char.pronouns +
'</div>' +

'<div class="job-container">' +
    buildJobBars(char.jobs) +
'</div>' +

'<div class="char-player">' +
    char.player +
'</div>' +

                '<div class="progress">' +
                    '<div id="pbar-' + i + '" class="progress-bar ' + color +
                    '" style="width:' + percent + '%"></div>' +
                '</div>' +

                '<div id="php-' + i + '" class="hp-text">' +
                    char.current + ' / ' + char.max +
                '</div>' +

            '</div>';

        formHTML +=
            '<div class="char-form-block">' +

                '<div class="form-row">' +
                    '<label>Name</label>' +
                    '<input value="' + char.name + '" oninput="updateField(' + i + ', \'name\', this.value)">' +
                '</div>' +
'<div class="form-row">' +
    '<label>Pronouns</label>' +
    '<input value="' + char.pronouns +
    '" oninput="updateField(' + i + ', \'pronouns\', this.value)">' +
'</div>' +
            '<div class="form-row">' +
    '<label>Player</label>' +
    '<input value="' + char.player +
    '" oninput="updateField(' + i + ', \'player\', this.value)">' +
'</div>' +
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
    }

    target.innerHTML = overlayHTML;

    if (!isViewMode && forms) {
        forms.innerHTML = formHTML;
    }
}

/* -------------------------
   FAST OVERLAY UPDATE ONLY
-------------------------- */
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

        if (hp) {
            hp.textContent = char.current + " / " + char.max;
        }

        if (img) {
            img.src = char.portrait;
        }
    }
}
/* -------------------------
   FIELD UPDATE (NO FULL RERENDER)
-------------------------- */
function updateField(index, field, value) {

    if (field === "current" || field === "max") {
        value = parseInt(value);
        if (isNaN(value)) value = 0;
    }

    partyData[index][field] = value;

    updateOverlayOnly();

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(function () {
        console.log("auto-save (optional)");
    }, 400);
}
function updateJob(charIndex, jobIndex, value) {

    if (!partyData[charIndex].jobs) {
        partyData[charIndex].jobs = [];
    }

    if (value === '') {
        partyData[charIndex].jobs.splice(jobIndex, 1);
    }
    else {
        partyData[charIndex].jobs[jobIndex] = value;
    }

    buildUI();
}
/* -------------------------
   ADD / REMOVE CHARACTERS
-------------------------- */
function addCharacter() {
    partyData.push({
        name: "New Hero",
        current: 10,
        max: 10,
        portrait: "images/placeholder.png"
    });

    buildUI();
}

function removeCharacter(index) {
    partyData.splice(index, 1);
    buildUI();
}

/* -------------------------
   INIT
-------------------------- */
window.addEventListener("DOMContentLoaded", function () {

    const controls = document.getElementById("ui-controls");

    if (isViewMode && controls) {
        controls.classList.add("hidden");
    }

    buildUI();
});
