class Controles {
  constructor(game) {
    this.game = game;

    //1. ESCUCHAMOS TECLADO (Desktop)
    window.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft' || e.key === 'a'){
        this.game.player.vx = -this.game.player.speed;
      } else if(e.key === 'ArrowRight' || e.key === 'd'){
        this.game.player.vx = this.game.player.speed;
      }
    });

    //Detenemos al soltar la tecla
    window.addEventListener('keyup', (e) => {
      if(['ArrowLeft','ArrowRight','a','d'].includes(e.key)) {
        this.game.player.vx = 0;
      }
    });

    //1. ESCUCHAMOS PANTALLA TACTIL (Mobile)
    window.addEventListener('touchstart', e => {
      const touchX = e.touch[0].clientX;
      const screenWidth = window.innerWidth;
      
      if(touchX < screenWidth / 2) {
        this.game.player.vx = -this.game.player.speed;
      } else{
        this.game.player.vx = this.game.player.speed;
      }
    });

    //Se detiene al levantar el dedo
    window.addEventListener('touchend', () => {
      this.game.player.vx = 0;
    });
  }
}
