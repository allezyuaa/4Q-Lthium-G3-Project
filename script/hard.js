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

  let move_speed = 3, gravity = 0.5;
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

  const pipeColors = [
     'radial-gradient(hotpink 50%, deeppink)',
     'radial-gradient(#ff69b4 50%, #c71585)',
     'radial-gradient(#e75480 50%, #8b008b)',
     'radial-gradient(#ff1493 50%, #b03060)',
     'radial-gradient(#db3e75 50%, #7b1b49)'
  ];

  const obstacleImages = [
     'images/dave.png',
     'images/skull.gif',
     'images/fire.gif',
     'images/TNT.png'
  ];

  img.style.display = 'none';

  document.addEventListener('keydown', (e) => {
     if (e.key === 'Enter' && game_state === 'Start') {
        document.querySelectorAll('.pipe_sprite, .obstacle').forEach((e) => e.remove());
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
        img.src = img.src = "images/" + getCookie("selectedIcon2");
        shrimp_dy = -7.6;
     }
  });

  document.addEventListener('keyup', (e) => {
     if (e.key == 'ArrowUp' || e.key == ' ') {
      img.src = "images/" + getCookie("selectedIcon1");
     }
  });

  function updateScore() {
     let currentScore = parseInt(score_val.innerHTML) + 3;
     score_val.innerHTML = currentScore;

 
     if (currentScore > highScore) {
        highScore = currentScore;
        setCookie('highestScore', highScore, 365); 
        document.querySelector('.High_score_val').innerHTML = highScore;
     }


     Accumulated_score+=3;
     document.querySelector('.Accumulated_score_val').innerHTML = Accumulated_score;
     setCookie('accumulatedPoints', Accumulated_score, 365);  
  }

  function play() {
     function move() {
        if (game_state != 'Play') return;

        let elements = document.querySelectorAll('.pipe_sprite, .obstacle');
        elements.forEach((element) => {
           let element_props = element.getBoundingClientRect();
           shrimp_props = shrimp.getBoundingClientRect();

           if (element_props.right <= 0) {
              element.remove();
           } else {
              if (
                 shrimp_props.left < element_props.left + element_props.width &&
                 shrimp_props.left + shrimp_props.width > element_props.left &&
                 shrimp_props.top < element_props.top + element_props.height &&
                 shrimp_props.top + shrimp_props.height > element_props.top
              ) {
                 gameOver();
                 return;
              } else {
                 element.style.left = element_props.left - move_speed + 'px';
                 if (
                    element.classList.contains('pipe_sprite') &&
                    element.getAttribute('increase_score') === '1' &&
                    element_props.right < shrimp_props.left &&
                    element_props.right + move_speed >= shrimp_props.left
                 ) {
                    updateScore();
                    element.setAttribute('increase_score', '0');
                 }
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
     let pipe_gap = 35;
     function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
           pipe_seperation = 0;
           let pipe_posi = Math.floor(Math.random() * 43) + 8;

           let color = pipeColors[Math.floor(Math.random() * pipeColors.length)];

           const pipeTopY = pipe_posi - 70;
           const pipeBottomY = pipe_posi + pipe_gap;


           let pipe_sprite_inv = document.createElement('div');
           pipe_sprite_inv.className = 'pipe_sprite';
           pipe_sprite_inv.style.top = pipeTopY + 'vh';
           pipe_sprite_inv.style.left = '100vw';
           pipe_sprite_inv.style.background = color;
           document.body.appendChild(pipe_sprite_inv);


           let pipe_sprite = document.createElement('div');
           pipe_sprite.className = 'pipe_sprite';
           pipe_sprite.style.top = pipeBottomY + 'vh';
           pipe_sprite.style.left = '100vw';
           pipe_sprite.setAttribute('increase_score', '1');
           pipe_sprite.style.background = color;
           document.body.appendChild(pipe_sprite);


           if (Math.random() < 0.5) {
               const obstacleBottom = document.createElement('img');
               obstacleBottom.className = 'obstacle';
               obstacleBottom.src = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
               obstacleBottom.style.width = '100px'; 
               obstacleBottom.style.height = 'auto';
               obstacleBottom.style.left = '100vw';
               obstacleBottom.style.top = `calc(${pipeBottomY}vh - 100px)`; 
               document.body.appendChild(obstacleBottom);
           }
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
           <a href="hard.html" class="restartbutton">
              <img src="images/restartbutton.png" alt="restart button">
           </a>
           <a href="gameinfo.html" class="exitbutton">
              <img src="images/exitbutton.png" alt="exit button">
           </a>
        </div>
     `;
     img.style.display = 'none';
  }