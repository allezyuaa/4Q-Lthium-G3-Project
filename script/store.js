const skins = [
    { id: 1, name: "Stace", cost: 500, icon: "staceicon.png", icon1: "staceicon1.png", icon2: "staceicon2.png" },
    { id: 2, name: "Bas", cost: 1000, icon: "basicon.png", icon1: "basicon1.png", icon2: "basicon2.png" },
    { id: 3, name: "Noah", cost: 1500, icon: "noahicon.png", icon1: "noahicon1.png", icon2: "noahicon2.png" },
    { id: 4, name: "Kez", cost: 2000, icon: "kezicon.png", icon1: "kezicon1.png", icon2: "kezicon2.png" },
    { id: 5, name: "Marga", cost: 10000, icon: "margaicon.png", icon1: "margaicon1.png", icon2: "margaicon2.png" },
    { id: 6, name: "Lance", cost: 40000, icon: "lanceicon.gif", icon1: "lanceicon1.gif", icon2: "lanceicon2.gif" }
];

function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}


function updatePointsDisplay() {
    const points = parseInt(getCookie("accumulatedPoints")) || 0;
    document.getElementById("points-value").textContent = `${points}`;
}

function renderSkins() {
    const container = document.getElementById("skinContainer");
    container.innerHTML = "";

    let selected = getCookie("selectedSkin");
    const owned = JSON.parse(getCookie("purchasedSkins") || "[]");


    if (selected === null || selected === undefined) {
        selected = "0";
        setCookie("selectedSkin", "0", 7);
        setCookie("selectedIcon1", "shrimp.png", 7);
        setCookie("selectedIcon2", "shrimp-2.png", 7);
    }

    skins.forEach(skin => {
        const isOwned = owned.includes(skin.id);
        const isSelected = selected == skin.id;

        const skinDiv = document.createElement("div");
        skinDiv.className = "skin-item";

        skinDiv.innerHTML = `
            <img src="images/${skin.icon}" class="skin-img" alt="Shrimp ${skin.id}">
            ${!isOwned ?
                `<button onclick="purchaseSkin(${skin.id}, ${skin.cost})"><img src='images/purchasebutton.png'></button>` :
                isSelected ?
                `<button onclick="removeSkin()"><img src='images/removebutton.png'></button>` :
                `<button onclick="applySkin(${skin.id})"><img src='images/usebutton.png'></button>`
            }
        `;

        container.appendChild(skinDiv);
    });
}



function purchaseSkin(skinId, cost) {
    let points = parseInt(getCookie("accumulatedPoints")) || 0;
    if (points >= cost) {
        points -= cost;
        setCookie("accumulatedPoints", points, 7);

        let owned = JSON.parse(getCookie("purchasedSkins") || "[]");

        if (!owned.includes(skinId)) {
            owned.push(skinId);
            setCookie("purchasedSkins", JSON.stringify(owned), 7);
        }


        updatePointsDisplay();
        renderSkins();
    } else {
        alert("Not enough points to buy this skin!");
    }
}

function applySkin(skinId) {
    const skin = skins.find(s => s.id === skinId);
    if (skin) {
        setCookie("selectedSkin", String(skinId), 7);
        setCookie("selectedIcon1", skin.icon1, 7);
        setCookie("selectedIcon2", skin.icon2, 7);
    }
    renderSkins();
}



function removeSkin() {
    setCookie("selectedSkin", "", 7);
    setCookie("selectedIcon1", "shrimp.png", 7);
    setCookie("selectedIcon2", "shrimp-2.png", 7);
    renderSkins();
}

window.onload = function () {
    if (!getCookie("accumulatedPoints")) {
        setCookie("accumulatedPoints", 200, 7);
    }
    updatePointsDisplay();
    renderSkins();
}