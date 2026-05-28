const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get('mode') === 'view';

let saveTimeout = null;

let partyData = [
    {
        name: "Dea",
        current: 30,
        max: 30,
        portrait: "images/red_mage.png"
    },
    {
        name: "Bruh",
        current: 20,
        max: 35,
        portrait: "images/warrior.png"
    }
];
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

        overlayHTML +=
            '<div class="char-slot">' +

               '<div class="portrait-area">' +
    '<img id="pimg-' + i + '" class="char-image" src="' + char.portrait + '">' +
'</div>' +

'<div class="char-name">' +
    char.name +
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

/* -------------------------
   ADD / REMOVE CHARACTERS
-------------------------- */
function addCharacter() {
    partyData.push({
        name: "New Hero",
        current: 10,
        max: 10,
        portrait: availablePortraits[0]
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
