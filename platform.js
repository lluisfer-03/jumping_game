class Platform {
  constructor(config = {}) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.w || 80;
    this.height = 20;
    this.v = config.v || 0;
    this.touch = 0;
    this.isBreak = config.isBreak ?? false;
    this.isTrampolin = config.isTrampolin ?? false;
    this.visible = config.visible ?? true;
    this.color = '#2ecc71';

    this.opacity = 1;

    Object.assign(this, config);

    //this.image = new Image();
    //this.image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQclKroLf8zW-wd-kWsCXwNgw-frPfOVrIB3uAk-m7aLFTLVVyKtKpt9ww&s';
  }

  update(canvasWidth) {
    if(this.v != 0) {
      this.x += this.v;
    }
      //Rebotar en las paredes
      if(this.x <= 0 || this.x + this.width >= canvasWidth) {
        this.v *= -1;  
      };

    marUpdate(this);

  }

  draw(ctx, nivelActual) {
    if(!this.visible) return;
    const dibujarEstilo = LEVEL_CONFIGS[nivelActual].estilo;

    dibujarEstilo(ctx, this);
  }
    
}
