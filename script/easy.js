function getCookie(name) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(name + "=") === 0) return cookie.substring(name.length + 1);
    }
    return "";
  }

  function setCookie(name, value, days) {
    let d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }


  window.onload = function () {
    let accumulatedScore = parseInt(getCookie("accumulatedPoints")) || 0;
    let highScore = parseInt(getCookie("highestScore")) || 0;
    let selectedIcon1 = getCookie("selectedIcon1") || "shrimp.png";  
    let selectedIcon2 = getCookie("selectedIcon2") || "shrimp-2.png"; 
    let img = document.getElementById("shrimp-1");
    img.src = "images/" + selectedIcon1;  
    document.querySelector('.Accumulated_score_val').innerHTML = accumulatedScore;
    document.querySelector('.High_score_val').innerHTML = highScore;
  }

  let move_speed = 7, gravity = 0.5;
  let shrimp = document.querySelector('.shrimp');
  let img = document.getElementById('shrimp-1');
  let shrimp_props = shrimp.getBoundingClientRect();
  let background = document.querySelector('.background').getBoundingClientRect();
  let score_val = document.querySelector('.score_val');
  let message = document.querySelector('.message');
  let game_state = 'Start';
  
  let Accumulated_score = parseInt(getCookie('accumulatedPoints')) || 0;
  let highScore = parseInt(getCookie('highestScore')) || 0;
  
  img.style.display = 'none';

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state === 'Start') {
      document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
      img.style.display = 'block';
      shrimp.style.top = '40vh';
      shrimp_dy = 0;
      game_state = 'Play';
      message.innerHTML = '';
      score_val.innerHTML = '0';
      shrimp_props = shrimp.getBoundingClientRect();
      play();
    }
  });

  let shrimp_dy = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowUp' || e.key == ' ') {
      img.src = "images/" + getCookie("selectedIcon2"); 
      shrimp_dy = -7.6;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowUp' || e.key == ' ') {
      img.src = "images/" + getCookie("selectedIcon1"); 
    }
  });

  function updateScore() {
    let currentScore = parseInt(score_val.innerHTML) + 1;
    score_val.innerHTML = currentScore;
    if (currentScore > highScore) {
      highScore = currentScore;
      setCookie('highestScore', highScore, 365);
      document.querySelector('.High_score_val').innerHTML = highScore;
    }
    Accumulated_score++;
    document.querySelector('.Accumulated_score_val').innerHTML = Accumulated_score;
    setCookie('accumulatedPoints', Accumulated_score, 365);
  }

  const pipeGradients = [
    "radial-gradient(#1b5e20 40%, #388e3c 70%, #81c784 100%)",
    "radial-gradient(#2e7d32 40%, #66bb6a 80%, #a5d6a7 100%)",
    "radial-gradient(#4caf50 50%, #2c6b2f 80%, #1b5e20 100%)",
    "radial-gradient(#8bc34a 50%, #4caf50 70%, #388e3c 90%)",
    "radial-gradient(#2c6b2f 40%, #4caf50 80%, #81c784 100%)"
  ];

  function play() {
    function move() {
      if (game_state != 'Play') return;

      let pipe_sprite = document.querySelectorAll('.pipe_sprite');
      pipe_sprite.forEach((element) => {
        let pipe_sprite_props = element.getBoundingClientRect();
        shrimp_props = shrimp.getBoundingClientRect();

        if (pipe_sprite_props.right <= 0) {
          element.remove();
        } else {
          if (
            shrimp_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
            shrimp_props.left + shrimp_props.width > pipe_sprite_props.left &&
            shrimp_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
            shrimp_props.top + shrimp_props.height > pipe_sprite_props.top
          ) {
            gameOver();
            return;
          } else {
            if (
              pipe_sprite_props.right < shrimp_props.left &&
              pipe_sprite_props.right + move_speed >= shrimp_props.left &&
              element.getAttribute('increase_score') === '1'
            ) {
              updateScore();
              element.setAttribute('increase_score', '0');
            }
            element.style.left = pipe_sprite_props.left - move_speed + 'px';
          }
        }
      });
      requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
      if (game_state !== 'Play') return;

      shrimp_dy += gravity;
      if (shrimp_props.top <= 0 || shrimp_props.bottom >= background.bottom) {
        gameOver();
        return;
      }

      shrimp.style.top = shrimp_props.top + shrimp_dy + 'px';
      shrimp_props = shrimp.getBoundingClientRect();
      requestAnimationFrame(apply_gravity);
    }

    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 40;

    function create_pipe() {
      if (game_state != 'Play') return;

      if (pipe_seperation > 115) {
        pipe_seperation = 0;
        let pipe_posi = Math.floor(Math.random() * 43) + 8;

        let pipe_sprite_inv = document.createElement('div');
        pipe_sprite_inv.className = 'pipe_sprite';
        pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
        pipe_sprite_inv.style.left = '100vw';
        pipe_sprite_inv.style.background = pipeGradients[Math.floor(Math.random() * pipeGradients.length)];
        document.body.appendChild(pipe_sprite_inv);

        let pipe_sprite = document.createElement('div');
        pipe_sprite.className = 'pipe_sprite';
        pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
        pipe_sprite.style.left = '100vw';
        pipe_sprite.setAttribute('increase_score', '1');
        pipe_sprite.style.background = pipeGradients[Math.floor(Math.random() * pipeGradients.length)];
        document.body.appendChild(pipe_sprite);
      }
      pipe_seperation++;
      requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
  }

  function gameOver() {
     game_state = 'End';
     message.innerHTML = `
        <div style="position: relative; display: inline-block;">
           <img src="images/gameover.png" alt="Game Over" style="width: 760px; height: auto;" />
           <div class="messagestyle">
              <p>Score This Round: ${score_val.innerHTML}</p>
              <p>Accumulated Points: ${Accumulated_score}</p>
              <p>Highest Score So Far: ${highScore}</p>
           </div>
        </div>
        <div class="buttons-container">
           <a href="easy.html" class="restartbutton">
              <img src="images/restartbutton.png" alt="restart button">
           </a>
           <a href="gameinfo.html" class="exitbutton">
              <img src="images/exitbutton.png" alt="exit button">
           </a>
        </div>
     `;
     img.style.display = 'none';
  }
