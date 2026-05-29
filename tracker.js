const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get("mode") === "view";

// Hardcoded default values to fall back on if storage is empty
let partyData = [
    {
        name: "Dea",
        current: 30,
        max: 30,
        portrait: "images/placeholder.png",
        pronouns: "they/them",
        player: "Stream",
        jobs: ["wizard"]
    },
    {
        name: "Bruh",
        current: 20,
        max: 35,
        portrait: "images/placeholder.png",
        pronouns: "he/him",
        player: "Josh",
        jobs: ["fighter", "rogue"]
    }
];

const availableJobs = [
    "artificer","barbarian","bard","bloodhunter","cleric","druid","fighter","gunslinger","monk",
    "paladin","pugilist","ranger","rogue","sorcerer","theurge","warlock","witch","wizard","⸻","sidekick"
];

const jobStyles = {
    barbarian: { color: "#F4641C", text: "black" },
    bard: { color: "#F9B8E6", text: "black" },
    cleric: { color: "#BFBFBF", text: "black" },
    druid: { color: "#31B32B", text: "white" },
    fighter: { color: "#753E1D", text: "white" },
    monk: { color: "#93BEFF", text: "black" },
    paladin: { color: "#f7dc6f", text: "black" },
    ranger: { color: "#376A0E", text: "white" },
    rogue: { color: "#080808", text: "white" },
    sorcerer: { color: "#D91A1A", text: "white" },
    warlock: { color: "#8629B3", text: "white" },
    artificer: { color: "#B69A1A", text: "black" },
    pugilist: { color: "#21B09B", text: "white" },
    gunslinger: { color: "#C79C7F", text: "white" },
    bloodhunter: { color: "#7E0100", text: "white" },
    witch: { color: "#FF40F2", text: "white" },
    theurge: { color: "#2CFFF8", text: "black" },
    sidekick: { color: "#808080", text: "white" },
    "⸻": { color: "#808080", text: "white" },
    wizard: { color: "#1E87E6", text: "white" }
};

const jobFullLabels = {
    artificer: "Artificer",
    barbarian: "Barbarian",
    bard: "Bard",
    bloodhunter: "Blood Hunter",
    cleric: "Cleric",
    druid: "Druid",
    fighter: "Fighter",
    gunslinger: "Gunslinger",
    monk: "Monk",
    paladin: "Paladin",
    pugilist: "Pugilist",
    ranger: "Ranger",
    rogue: "Rogue",
    sorcerer: "Sorcerer",
    theurge: "Theurge",
    sidekick: "Sidekick",
    "⸻": "⸻",
    warlock: "Warlock",
    witch: "Witch",
    wizard: "Wizard"
};

const jobAbbreviations = {
    artificer: "RTFC",
    barbarian: "BARB",
    bard: "BARD",
    bloodhunter: "BLDH",
    cleric: "CLRC",
    druid: "DRUD",
    fighter: "FGHT",
    gunslinger: "GUN",
    monk: "MONK",
    paladin: "PAL",
    pugilist: "PUGI",
    ranger: "RANG",
    rogue: "ROG",
    sorcerer: "SORC",
    theurge: "THURG",
    warlock: "WRLK",
    witch: "WTCH",
    sidekick: "SIDE",
    "⸻": "⸺",
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

/* ---------------- HELPERS & DATA SYNC ENGINE ---------------- */

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

function saveTrackerState() {
    try {
        localStorage.setItem("streamPartyTrackerData", JSON.stringify(partyData));
    } catch(e) {
        console.error("Storage write blocked by browser configuration settings:", e);
    }
}

function loadTrackerState() {
    const cachedData = localStorage.getItem("streamPartyTrackerData");
    if (cachedData) {
        try {
            partyData = JSON.parse(cachedData);
        } catch (e) {
            console.error("Failed to parse cached structural database layout data:", e);
        }
    }
}

// FAILSAFE SYSTEM: Lets you copy data out manually if OBS splits the cache contexts
function copyStateToClipboard() {
    const dataString = JSON.stringify(partyData);
    navigator.clipboard.writeText(dataString).then(() => {
        alert("Party configuration string copied to clipboard! You can save this text as a fallback backup layout.");
    }).catch(err => {
        // Fallback alert if clipboard api is blocked in view container scripts
        alert("Copy string manual value:\n\n" + dataString);
    });
}

function importStateFromString() {
    const input = prompt("Paste your saved party layout configuration data string here:");
    if (!input) return;
    try {
        partyData = JSON.parse(input);
        saveTrackerState();
        buildUI();
    } catch (e) {
        alert("Invalid layout data signature. Check string variables and try again.");
    }
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
            : (jobFullLabels[job] || job);

        return `
        <div class="job-bar ${job}" style="--job-color:${style.color}; color:${style.text}">
            <span class="job-text-span">${label}</span>
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
        const isDeadClass = char.current <= 0 ? "dead-portrait" : "";

       overlay += `
        <div class="char-slot">
            <div class="portrait-area">
                <img id="pimg-${i}" class="char-image ${isDeadClass}" src="${char.portrait}">
            </div>
            <div class="char-name" id="pname-${i}">${char.name}</div>
            <div class="char-pronouns" id="ppronouns-${i}">${char.pronouns}</div>
            <div class="progress">
                <div id="pbar-${i}" class="progress-bar ${color}" style="width:${percent}%"></div>
            </div>
            <div id="php-${i}" class="hp-text">${char.current} / ${char.max}</div>
            <div class="job-container" style="margin-top: 8px;">
                ${buildJobBars(char.jobs)}
            </div>
            <div class="char-player" id="pplayer-${i}">${char.player}</div>
        </div>`;

        const charJobs = [...char.jobs];
        while (charJobs.length < 3) {
            charJobs.push(""); 
        }

        editor += `
        <div class="char-form-block">
            <h3>Character: ${char.name || 'New'}</h3>
            <div class="form-row"><label>Name</label><input value="${char.name}" oninput="updateField(${i},'name',this.value)"></div>
            <div class="form-row"><label>Pronouns</label><input value="${char.pronouns}" oninput="updateField(${i},'pronouns',this.value)"></div>
            <div class="form-row"><label>Player</label><input value="${char.player}" oninput="updateField(${i},'player',this.value)"></div>
            <div class="form-row"><label>HP Current</label><input type="number" value="${char.current}" oninput="updateField(${i},'current',this.value)"></div>
            <div class="form-row"><label>HP Max</label><input type="number" value="${char.max}" oninput="updateField(${i},'max',this.value)"></div>
            <div class="form-row">
                <label>Portrait</label>
                <select onchange="updateField(${i},'portrait',this.value)">${buildPortraitOptions(char.portrait)}</select>
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
        
        // Form system operational control deck tools layout inject
        const controlDeckHtml = `
            <div style="padding: 10px 0; display: flex; flex-direction: column; gap: 8px;">
                <button onclick="addCharacter()" style="background: #e76eff; color: #111; border: none; padding: 10px; border-radius: 6px; font-weight: bold; font-family: 'Aldrich', sans-serif; cursor: pointer; width: 100%; font-size: 0.9rem;">
                    + Add New Character
                </button>
                <div style="display: flex; gap: 6px;">
                    <button onclick="copyStateToClipboard()" style="flex: 1; background: #2e4053; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">💾 Copy Backup String</button>
                    <button onclick="importStateFromString()" style="flex: 1; background: #2e4053; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">📂 Import Layout String</button>
                </div>
            </div>
        `;
        forms.insertAdjacentHTML('beforeend', controlDeckHtml);
    }
}

/* ---------------- UPDATE CONTROLLERS ---------------- */

function updateOverlayOnly() {
    partyData.forEach((char, i) => {
        const percent = getPercent(char);
        const color = getColor(percent);

        const bar = document.getElementById("pbar-" + i);
        const hp = document.getElementById("php-" + i);
        const img = document.getElementById("pimg-" + i);
        
        const nameEl = document.getElementById("pname-" + i);
        const pronounEl = document.getElementById("ppronouns-" + i);
        const playerEl = document.getElementById("pplayer-" + i);

        if (bar) {
            bar.style.width = percent + "%";
            bar.className = "progress-bar " + color;
        }
        if (hp) hp.textContent = `${char.current} / ${char.max}`;
        if (img) {
            img.src = char.portrait;
            if (char.current <= 0) {
                img.classList.add("dead-portrait");
            } else {
                img.classList.remove("dead-portrait");
            }
        }
        if (nameEl) nameEl.textContent = char.name;
        if (pronounEl) pronounEl.textContent = char.pronouns;
        if (playerEl) playerEl.textContent = char.player;
    });
}

function updateField(i, field, value) {
    if (field === "current" || field === "max") {
        value = parseInt(value);
        if (isNaN(value)) value = 0;
    }

    partyData[i][field] = value;
    updateOverlayOnly();
    saveTrackerState(); // Fires cache sequence inside operational scope layout arrays
}

function updateJob(charIndex, jobIndex, newJobValue) {
    if (!partyData[charIndex].jobs) partyData[charIndex].jobs = [];
    
    while (partyData[charIndex].jobs.length <= jobIndex) {
        partyData[charIndex].jobs.push("");
    }
    
    partyData[charIndex].jobs[jobIndex] = newJobValue;
    partyData[charIndex].jobs = partyData[charIndex].jobs.filter(j => j !== "");
    
    saveTrackerState(); // State stored before trigger redraw to preserve split structures
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
    saveTrackerState();
    buildUI();
}

function removeCharacter(i) {
    if (confirm(`Are you sure you want to remove ${partyData[i].name || 'this character'}?`)) {
        partyData.splice(i, 1);
        saveTrackerState();
        buildUI();
    }
}

/* ---------------- INIT & HOTKEYS ---------------- */

function initTracker() {
    loadTrackerState();
    buildUI();
}

window.addEventListener("keydown", (e) => {
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === "r") {
        localStorage.removeItem("streamPartyTrackerData");
        window.location.reload();
    }
});

window.addEventListener("DOMContentLoaded", initTracker);
