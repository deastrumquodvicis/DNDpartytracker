```js id="h43a0r"
const urlParams = new URLSearchParams(window.location.search);
const isViewMode = urlParams.get('mode') === 'view';

let partyData = [
    {
        name: "Dea",
        current: 30,
        max: 30
    },
    {
        name: "Bruh",
        current: 20,
        max: 35
    }
];

function buildUI() {

    const target = document.getElementById('party-target');
    const forms = document.getElementById('forms-container');

    let overlayHTML = '';
    let formHTML = '';

    partyData.forEach((char, index) => {

        const percent =
            char.max > 0
                ? (char.current / char.max) * 100
                : 0;

        overlayHTML += `
            <div class="char-slot">

                <div class="char-name">
                    ${char.name}
                </div>

                <div class="progress">
                    <div
                        class="progress-bar green"
                        style="width:${percent}%"
                    ></div>
                </div>

                <div class="hp-text">
                    ${char.current} / ${char.max}
                </div>

            </div>
        `;

        formHTML += `
            <div class="char-form-block">

                <div class="form-row">

                    <label>Name</label>

                    <input
                        value="${char.name}"
                        oninput="updateField(${index}, 'name', this.value)"
                    >

                </div>

                <div class="form-row">

                    <label>HP</label>

                    <input
                        type="number"
                        value="${char.current}"
                        oninput="updateField(${index}, 'current', this.value)"
                    >

                </div>

            </div>
        `;
    });

    target.innerHTML = overlayHTML;

    if (!isViewMode) {
        forms.innerHTML = formHTML;
    }
}

function updateField(index, field, value) {

    if (field === 'current') {
        value = parseInt(value) || 0;
    }

    partyData[index][field] = value;

    buildUI();
}

window.addEventListener('DOMContentLoaded', () => {

    if (isViewMode) {

        const controls =
            document.getElementById('ui-controls');

        if (controls) {
            controls.classList.add('hidden');
        }
    }

    buildUI();
});
```
