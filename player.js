class Player {
  
  constructor(x, y) {
    //1. Posición y tamaño
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;

    //2. Propiedades físicas
    this.vy = 0;
    this.vx = 0;

    //Se modificarán en cada NIVEL, datos aquí son base
    this.g = 0.4; //Esto determina la gravedad
    this.jump = -12; //Fuerza de salto
    this.speed = 5;

  }

  update(canvasHeight, canvasWidth) {
    //1. Cada frame vy + g => y = Variacion vy
    this.vy += this.g;
    this.y += this.vy;

    //2. Detectar cuando toca suelo
    /*if(this.y + this.height >= canvasHeight) {
      this.y = canvasHeight - this.height; //Para que no se incruste en el suelo
      this.vy = this.jump; //Rebote!
    };*/

    //3. Movimiento horizontal
    this.x += this.vx;

    //Lateral infinito 
    if(this.x > canvasWidth) this.x = -this.width;
    if(this.x < -this.width) this.x = canvasWidth;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};
