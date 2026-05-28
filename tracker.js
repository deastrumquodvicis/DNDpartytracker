const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get('mode') === 'view';

let saveTimeout = null;

let partyData = [
    { name: "Dea", current: 30, max: 30 },
    { name: "Bruh", current: 20, max: 35 }
];

function getHpPercent(char) {
    if (!char.max || char.max <= 0) return 0;
    return Math.max(0, Math.min(100, (char.current / char.max) * 100));
}

function getHpColor(percent, current) {
    if (current <= 0) return "grey";
    if (percent <= 10) return "red";
    if (percent <= 50) return "yellow";
    return "green";
}

function buildUI() {

    const target = document.getElementById("party-target");
    const forms = document.getElementById("forms-container");

    if (!target) return;

    let overlayHTML = "";
    let formHTML = "";

    for (let i = 0; i < partyData.length; i++) {

        const char = partyData[i];
        const percent = getHpPercent(char);
        const color = getHpColor(percent, char.current);

        overlayHTML +=
            '<div class="char-slot">' +

                '<div class="char-name">' +
                    char.name +
                '</div>' +

                '<div class="progress">' +
                    '<div class="progress-bar ' + color + '" style="width:' + percent + '%"></div>' +
                '</div>' +

                '<div class="hp-text">' +
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

                '<button onclick="removeCharacter(' + i + ')">Remove</button>' +

            '</div>';
    }

    target.innerHTML = overlayHTML;

    if (!isViewMode && forms) {
        forms.innerHTML = formHTML;
    }
}

function updateField(index, field, value) {

    if (field === "current" || field === "max") {
        value = parseInt(value);
        if (isNaN(value)) value = 0;
    }

    partyData[index][field] = value;

    buildUI();

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(function () {
        console.log("auto-save trigger (optional)");
        // pushDataToCloud();
    }, 400);
}

function addCharacter() {
    partyData.push({
        name: "New Hero",
        current: 10,
        max: 10
    });

    buildUI();
}

function removeCharacter(index) {
    partyData.splice(index, 1);
    buildUI();
}

window.addEventListener("DOMContentLoaded", function () {

    const controls = document.getElementById("ui-controls");

    if (isViewMode && controls) {
        controls.classList.add("hidden");
    }

    buildUI();
});
