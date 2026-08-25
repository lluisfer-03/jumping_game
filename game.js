class Game {
  
  /* --1. CONSTRUYE LAS DIMENSIONES Y LOS PARÁMETROS-- */
  constructor(canvasId) {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    //1.1. Dimensiones fijas lienzo
    this.canvas.width = 400;
    this.canvas.height = 600;

    //1.2. Creamos Player
    this.player = new Player(180, 500);

    //1.3. Creamos Iniciales y Plataformas y suelo
    this.floor = new Platform({x: 0,y: this.canvas.height - 15, w: this.canvas.width, v: 0}); 
    
    this.platforms = [this.floor];

    this.numPlatf = 0;//Mover a otro lado
    this.countJumps = 0;//Mover a otro lado
    
      for(let i=1; i <= 6; i++) {  
        let platfX = Math.random() * (this.canvas.width - 80);
        let platfY = this.platforms[i - 1].y - 100; 
        let platfW = 80;
        
        if(platfY > 0) {
          this.platforms.push(new Platform({x: platfX,y: platfY,w: platfW}));
        };
        
      };

    //1.4. Añadimos controles
    this.input = new Controles(this);

    //1.5. Añadimos Score (Recupera high Score guardado, si es null --> 0)
    this.score = 0; 
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;

    //1.6. Cargamos niveles
    this.currentLevelIndex = 0;
    this.levelBannerTimer = 0;

    this.loadLevel(0);

    //this.direction = 'up'
    //this.directionCamera(this.direction);
    this.diff = 0;

    this.bgX = 0;
    this.bgY = 0;

    //Inicia el bucle del juego
    this.start();
  }
  
  //----------------------------------------------------------------
  //Limpia el lienzo
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //----------------------------------------------------------------
  /* --2. ACTUALIZA LOS PARÁMETROS CONSTRUIDOS-- */
  
  update() {
    //2.1. Movimiento Player y rebote Plataformas
    this.player.update(this.canvas.height, this.canvas.width);
    this.colision();
    
    this.platforms.forEach( platform => platform.update(this.canvas.width));

    //2.4. Condición de GameOver si Player cae por debajo de la pantalla
    if(this.player.y > this.canvas.height) {
      this.gameOver();
    }

    //2.5. Si Score es máximo, modificar highScore y gurada el nuevo record.
    if(this.score > this.highScore) {
      this.highScore = this.score;

      //Guarda el nuevo récord en el navegador
      localStorage.setItem('highScore', this.highScore);
    }

    //2.6. Carga Nuevo nivel, comprobar si existe y lanzarlo. Luego lanzar Banner flotante.
    const nextLevelIndex = this.currentLevelIndex + 1;
    let changeScore = LEVEL_CONFIGS[nextLevelIndex]?.minScore || 0;

    if(LEVEL_CONFIGS[nextLevelIndex] && this.countJumps >= changeScore) {
      this.loadLevel(nextLevelIndex);
    }

    //2.2. Lógica Cámara --> Si el Player sube más arriba del 50% (eje Y o eje X) con direction
    this.createPlatforms(this.direction, changeScore);
    this.directionCamera(this.direction, changeScore);

    //Banner flotante de nivel
    if(this.levelBannerTimer > 0) {
      this.levelBannerTimer --;
    }

    
  }

  //----------------------------------------------------------------
  /* --3. DIBUJA TODO ACTUALIZADO-- */
  
  draw() {
    this.clear();

    this.ctx.fillStyle = '#3E5EA3';
    this.ctx.fillRect(this.bgX, this.bgY, this.canvas.width, this.canvas.height);
    
    this.player.draw(this.ctx);
    this.platforms.forEach(platform => platform.draw(this.ctx, this.currentLevelIndex));
    this.drawScore()

    if(this.levelBannerTimer > 0) {
      const levelName = LEVEL_CONFIGS[this.currentLevelIndex].name;

      this.ctx.save();
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, this.canvas.height /2 - 40, this.canvas.wdth, 80);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 22px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(levelName, this.canvas.width / 2, this.canvas.height / 2 + 8);
      this.ctx.restore();
    }
  }

  //----------------------------------------------------------------
  /* --4. GENERA EL LOOP Y LLAMA AL SIGUIENTE FRAME-- */
  
  loop() {
    this.update();
    this.draw()

    requestAnimationFrame(() => this.loop());
  }

  //----------------------------------------------------------------
  /* --5. ACTIVADOR DE TODO EL PROCESO, EN EL CONSTRUCTOR-- */
  
  start() {
    this.loop();
  }

  //----------------------------------------------------------------
  /* ---RESTO DE EVENTOS---- */
  
  //Colisión con las plataformas
  colision() {
    //1. Solo cuando vy > 0 --> Cuando el objeto está cayendo
    if(this.player.vy > 0) {
      //Para cada plataforma comprbamos si los pies de Player tocan
      this.platforms.forEach( platform => {
        
        const hitX = this.player.x + this.player.width > platform.x &&
                     this.player.x < platform.x + platform.width;
        const hitY = this.player.y + this.player.height >= platform.y &&
                     this.player.y + this.player.height <= platform.y + platform.height + this.player.vy;
        
        //Si toca, creamos rebote (solo si no está rota platformBroken = true)
        if(platform.touch != 2 && platform.visible){
          if(hitX && hitY) {
            //Si plataform.type = 'broken' --> La marcamos para eliminarla.
            if(platform.isBreak){ 
              platform.touch ++;
            }
            
            if(platform.isTrampolin) {
              this.player.vy = this.player.jump * 2;
            } else {
            this.player.vy = this.player.jump;
            }
          };
        };  

      });
    };
  }

  //Creamos GameOver
  gameOver() {
    //alert("¡Game Over! Toca para reiniciar")

    //Reiniciamos la posicion de Player y plataformas
    this.player.x = 180;
    this.player.y = 400;
    this.player.vy = 0;

    this.score = 0; //Reinicia los puntos

    this.loadLevel(0);

    this.floor.y = this.canvas.height -15;
    this.platforms = [this.floor];
    this.numPlatf = 0;
    this.countJumps = 0;
    this.bgX = 0;
    this.bgY = 0;

    for(let i=1; i <= 6; i++) {  
        let platfX = Math.random() * (this.canvas.width - 80);
        let platfY = this.platforms[i - 1].y - 100 ?? 0; 
        let platfW = 80;
        
        if(platfY > 0) {
          this.platforms.push(new Platform({x: platfX,y: platfY,w: platfW}));
        };
        
    };
  }

  //Creamos Dibujo Score
  drawScore() {
    this.ctx.fillStyle = '#000000';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.textAlign = 'left'

    //Dibujar Puntuación Actual
    this.ctx.fillText(`Puntos: ${this.score}`, 15, 30);

    //Dibujar Máxima Puntuación
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Récord: ${this.highScore}`, this.canvas.width - 15, 30);
  }

  //Cargamos el nivel
  loadLevel(index) {
    this.currentLevel = index;
    const config = LEVEL_CONFIGS[index];

    //1. Modificar propiedades de la clase Game
    //this.estilo = config.estilo;
    this.direction = config.direction;
    this.percentP = config.percentPlatforms;
    this.levelBannerTimer = 120; //Mostrar aviso durante 120 fotogramas (2 seg)
    if(this.direction != 'up') {
      this.minSpace = config.space[0];
      this.maxSpace = config.space[1];
    }

    //2. Modificar propiedades clase Player
    this.player.g = config.gravity;
    this.player.jump = config.jumpForce;
    this.player.speed = config.playerSpeed;
  }

  //Definimos Dirección de la Cámara
  directionCamera(direction, changeScore) {
    if(direction === 'up'){
      
      if(this.player.y < this.canvas.height / 2) {
        this.diff = this.canvas.height / 2 - this.player.y;
        this.player.y = this.canvas.height / 2;
        
        if(this.countJumps > changeScore - 6) {
          this.bgY += this.diff;
        }
        this.score += Math.floor(this.diff);
        this.platforms.forEach( platform => {
          platform.y += this.diff;
        });
      }
      
    } else if(direction === 'right') {
      
      if(this.player.x > this.canvas.width / 2) {
        this.diff = this.player.x - this.canvas.width / 2;
        this.player.x = this.canvas.width / 2;

        this.score += Math.floor(this.diff / 5);
        this.platforms.forEach( platform => {
          platform.x -= this.diff;
        });
      }
    }
  }

  //Evento Crear plataformas
  createPlatforms(direction, level) {
    //Métricas para definir en que dirección se crean las plataformas
    let platfEje = 0;
    let canvasEje = 0;
    let newX = 0;
    let newY = 0;
    let newW = 80;
    
    let lastValue = this.platforms.length -1 || 0;
    let platfType = 0;

    //Analizamos cada plataforma
    this.platforms.forEach((platform, index) => {
      //Definimos si ha cruzado y si es suelo
      let cross = false;
      let isFloor = false;
      let isVisible = !(this.countJumps > level - 6 && this.countJumps < level)

      //Convertimos en Suelo isFloor = true
      if(this.countJumps === level - 6) {
        isFloor = true;
      };
      
      //Definimos que es cross en cada dirección y direccion de crear plataformas.
      if(direction === 'up') {
        if(platform.y > this.canvas.height) cross = true;
        
        platfEje = platform.y;
        canvasEje = this.canvas.height;
        newX = Math.random() * (this.canvas.width - 80);
        newY = this.platforms[lastValue].y - 100 - this.numPlatf;

      } else if(direction === 'right') {
        if(platform.x + platform.width < 0) cross = true;
        
        platfEje = platform.x;
        canvasEje = this.canvas.width;
        newX = this.platforms[lastValue].x + 170;
        newY = Math.random() * (this.maxSpace - this.minSpace + 1) + this.minSpace;
        
      }

      //En el caso de que sea Cross, eliminamos y creamos una nueva platform.
      if(cross) {
        //Eliminamos la platf que ha cruzado el marco
        this.platforms.splice(index, 1);

        //3. Determinamos que tipo de plataforma será
        const rand = Math.random();
        let moving = 0;
        if(rand <= this.percentP[0].max) moving = 5;
        let breaking = rand <= this.percentP[1].max && rand >= this.percentP[0].max;
        let trampolin = rand <= this.percentP[2].max && rand >= this.percentP[1].max;

        let configPlatf = {x: newX, y: newY, w: newW,v: moving, isBreak: breaking, isTrampolin: trampolin, visible: isVisible}


        platfType = marPlatforms(configPlatf); 

        //console.log(platfType);

        //Si es suelo funciona diferente
        if(isFloor ) {
          platfType = new Platform({x: 50, y: newY, w: this.canvas.width * 2,v: 0, isBreak: false, isTrampolin: false});
        };
        
        this.platforms.push(platfType);
        
        this.countJumps ++;
        if(this.numPlatf < 75) this.numPlatf += 0.1;
      }
    });
  
  }


  
};

//Iniciamos la clase/juego cuando la página carga
window.onload = () => {
  new Game('gameCanvas');
};
