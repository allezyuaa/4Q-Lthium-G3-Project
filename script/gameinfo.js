function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length); 
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); 
    }
    return null;
}

function saveUsername(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;

    if (username.match(/^[A-Za-z0-9]+$/)) {
        setCookie("username", username, 7); 
        setCookie("accumulatedPoints", "0", 7); 
        setCookie("highestScore", "0", 7); 

        setCookie("purchasedSkins", JSON.stringify([0]), 7); 
        setCookie("selectedIcon1", "shrimp.png", 7); 
        setCookie("selectedIcon2", "shrimp-2.png", 7);


        displayGreeting();
        createConfetti(0);

        function createConfetti(count) {
            if (count >= 100) return;

            const confetti = document.createElement("div");
            confetti.className = "confetti";

            const colors = ["#ff007f", "#00e5ff", "#00ff85", "#ffd300", "#ff4d00", "#8f00ff"];
            const color = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = "-10px";
            confetti.style.backgroundColor = color;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);

            setTimeout(() => {
                createConfetti(count + 1);
            }, 20);
        }

    } else {
        alert("Invalid username! Only letters and numbers are allowed.");
    }
}

function displayGreeting() {
    let savedUsername = getCookie("username");
    if (savedUsername) {
        document.getElementById("greeting").innerText = `Welcome, ${savedUsername}!`;
    }

    let accumulatedPoints = getCookie("accumulatedPoints") || 0;
    let highestScore = getCookie("highestScore") || 0;

    console.log(`Accumulated Points: ${accumulatedPoints}, Highest Score: ${highestScore}`);
}

window.onload = displayGreeting;