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
    barbarian: { color: "#F4641Cdd", text: "white" },
    bard: { color: "#F9B8E6dd", text: "black" },
    cleric: { color: "#BFBFBFdd", text: "black" },
    druid: { color: "#31B32Bdd", text: "white" },
    fighter: { color: "#753E1Ddd", text: "white" },
    monk: { color: "#FFEB93dd", text: "black" },
    paladin: { color: "#f7dc6fdd", text: "black" },
    ranger: { color: "#376A0Edd", text: "white" },
    rogue: { color: "#080808dd", text: "white" },
    sorcerer: { color: "#D91A1Add", text: "white" },
    warlock: { color: "#8629B3dd", text: "white" },
    artificer: { color: "#B69A1Add", text: "white" },
    pugilist: { color: "#21B09Bdd", text: "black" },
    gunslinger: { color: "#C79C7Fdd", text: "white" },
    bloodhunter: { color: "#7E0100dd", text: "white" },
    witch: { color: "#FF40F2dd", text: "white" },
    theurge: { color: "#2CFFF8dd", text: "white" },
    wizard: { color: "#1E87E6dd", text: "white" }
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
    
    if (!isViewMode && forms) {
        forms.innerHTML = editor;
        
        // Append the setup for the "+ Add New Character" button at the bottom of the editor list
        const addButtonHtml = `
            <div style="padding: 10px 0;">
                <button onclick="addCharacter()" style="background: #e76eff; color: #111; border: none; padding: 10px; border-radius: 6px; font-weight: bold; font-family: 'Aldrich', sans-serif; cursor: pointer; width: 100%; font-size: 0.9rem;">
                    + Add New Character
                </button>
            </div>
        `;
        forms.insertAdjacentHTML('beforeend', addButtonHtml);
    }
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
    if (!partyData[charIndex].jobs) partyData[charIndex].jobs = [];
    
    while (partyData[charIndex].jobs.length <= jobIndex) {
        partyData[charIndex].jobs.push("");
    }
    
    partyData[charIndex].jobs[jobIndex] = newJobValue;
    partyData[charIndex].jobs = partyData[charIndex].jobs.filter(j => j !== "");
    
    buildUI(); 
}

function addCharacter() {
    const newChar = {
        name: "New Hero",
        current: 10,
        max: 10,
        portrait: availablePortraits[0] || "images/placeholder.png",
        pronouns: "they/them",
        player: "Player Name",
        jobs: ["wizard"]
    };

    partyData.push(newChar);
    buildUI();
}

function removeCharacter(i) {
    if (confirm(`Are you sure you want to remove ${partyData[i].name || 'this character'}?`)) {
        partyData.splice(i, 1);
        buildUI();
    }
}

/* ---------------- INIT ---------------- */

window.addEventListener("DOMContentLoaded", buildUI);
