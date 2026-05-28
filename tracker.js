const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get("mode") === "view";

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
    "artificer","barbarian","bard","bloodhunter","cleric","druid","fighter","gunslinger","monk",
    "paladin","pugilist","ranger","rogue","sorcerer","theurge","warlock","witch","wizard"
];

const jobStyles = {
    barbarian: { color: "#F4641Caa", text: "white" },
    bard: { color: "#F9B8E6aa", text: "black" },
    cleric: { color: "#BFBFBFaa", text: "black" },
    druid: { color: "#31B32Baa", text: "white" },
    fighter: { color: "#753E1Daa", text: "white" },
    monk: { color: "#FFEB93aa", text: "black" },
    paladin: { color: "#f7dc6faa", text: "black" },
    ranger: { color: "#376A0Eaa", text: "white" },
    rogue: { color: "#080808eaa", text: "white" },
    sorcerer: { color: "#D91A1Aaa", text: "white" },
    warlock: { color: "#8629B3aa", text: "white" },
    artificer: { color: "#B69A1Aaa", text: "black" },
    pugilist: { color: "#21B09Baa", text: "black" },
    gunslinger: { color: "#C79C7Faa", text: "white" },
    bloodhunter: { color: "#7E0100aa", text: "white" },
    witch: { color: "#FF40F2aa", text: "white" },
    theurge: { color: "#2CFFF8aa", text: "white" },
    wizard: { color: "#1E87E6aa", text: "white" }
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
    artificer: "RTFC",
    gunslinger: "GUN",
    pugilist: "PUGI",
    bloodhunter: "BLDH",
    witch: "WTCH",
    theurge: "THURG",
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
    if (!char.max || char.max <= 0) return 0;
    return Math.max(0, Math.min(100, (char.current / char.max) * 100));
}

function getColor(percent) {
    if (percent <= 0) return "grey";
    if (percent <= 10) return "red";
    if (percent <= 50) return "yellow";
    return "green";
}

/* ---------------- BUILDERS ---------------- */

function buildJobOptions(selected) {
    return availableJobs
        .map(j => `<option value="${j}" ${j === selected ? "selected" : ""}>${j}</option>`)
        .join("");
}

function buildPortraitOptions(selected) {
    return availablePortraits
        .map(p => `<option value="${p}" ${p === selected ? "selected" : ""}>${p}</option>`)
        .join("");
}

function buildJobBars(jobs = []) {
    const useAbbr = jobs.length >= 3;

    return jobs.map(job => {
        const style = jobStyles[job] || { color: "#666666aa", text: "#fff" };
        const label = useAbbr
            ? (jobAbbreviations[job] || job.slice(0,4).toUpperCase())
            : job;

        return `
        <div class="job-bar ${job}"
            style="background-color:${style.color}; color:${style.text}">
            ${label}
        </div>`;
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

            <div class="progress">
                <div id="pbar-${i}" class="progress-bar ${color}" style="width:${percent}%"></div>
            </div>
            <div id="php-${i}" class="hp-text">${char.current} / ${char.max}</div>

            <div class="job-container" style="margin-top: 8px;">
                ${buildJobBars(char.jobs)}
            </div>

            <div class="char-player">${char.player}</div>

        </div>`;
  // Pull the character's jobs, filling empty slots up to 3 with empty strings
        const charJobs = [...char.jobs];
        while (charJobs.length < 3) {
            charJobs.push(""); 
        }

        editor += `
        <div class="char-form-block">
            <h3>Character: ${char.name || 'New'}</h3>
            
            <div class="form-row">
                <label>Name</label>
                <input value="${char.name}" oninput="updateField(${i},'name',this.value)">
            </div>

            <div class="form-row">
                <label>Pronouns</label>
                <input value="${char.pronouns}" oninput="updateField(${i},'pronouns',this.value)">
            </div>

            <div class="form-row">
                <label>Player</label>
                <input value="${char.player}" oninput="updateField(${i},'player',this.value)">
            </div>

            <div class="form-row">
                <label>HP Current</label>
                <input type="number" value="${char.current}" oninput="updateField(${i},'current',this.value)">
            </div>

            <div class="form-row">
                <label>HP Max</label>
                <input type="number" value="${char.max}" oninput="updateField(${i},'max',this.value)">
            </div>

            <div class="form-row">
                <label>Portrait</label>
                <select onchange="updateField(${i},'portrait',this.value)">
                    ${buildPortraitOptions(char.portrait)}
                </select>
            </div>

            <div class="form-row">
                <label>Jobs</label>
                <div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1;">
                    ${charJobs.map((currentJob, jobIndex) => `
                        <select onchange="updateJob(${i}, ${jobIndex}, this.value)">
                            <option value="">-- No Class --</option>
                            ${buildJobOptions(currentJob)}
                        </select>
                    `).join('')}
                </div>
            </div>

            <div class="form-row" style="margin-top: 10px;">
                <button onclick="removeCharacter(${i})" style="background: #922b21; color: white; border: none; padding: 5px; border-radius: 4px; cursor: pointer; width: 100%;">Remove</button>
            </div>
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
function updateJob(charIndex, jobIndex, newJobValue) {
    // 1. Ensure the jobs array exists
    if (!partyData[charIndex].jobs) partyData[charIndex].jobs = [];
    
    // 2. Pad array with empty strings if it's missing slots up to the edited index
    while (partyData[charIndex].jobs.length <= jobIndex) {
        partyData[charIndex].jobs.push("");
    }
    
    // 3. Update target slot
    partyData[charIndex].jobs[jobIndex] = newJobValue;
    
    // 4. Clean out empty elements so data stays clean (e.g. ["wizard", ""]) becomes ["wizard"]
    partyData[charIndex].jobs = partyData[charIndex].jobs.filter(j => j !== "");
    
    // 5. Force a total UI rebuild to redraw the updated job configuration
    buildUI(); 
}
/* ---------------- INIT ---------------- */

window.addEventListener("DOMContentLoaded", buildUI);
