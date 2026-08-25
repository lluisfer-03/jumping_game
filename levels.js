//CREAMOS NIVELS

const LEVEL_CONFIGS = [
  {
    //Técnico del nivel
    level: 1,
    minScore: 0,
    name: "Nivel 1: Bajo el mar",
    direction: 'up',
    //Relacionado con el Player
    gravity: 0.4,
    jumpForce: -12,
    playerSpeed: 5,
    //Relacionado con las Plataformas
    estilo: marDraw,
    platformCreate: marPlatforms,
    platfUpdate: marUpdate,
    //[0]moving, [1]break, [2]trampolin
    percentPlatforms: [{max: 0.2},
                       {max: 0.6}, 
                       {max: 0.65}]
  },
  {
    level: 2,
    minScore: 20,
    name: "Nivel 2: Beach",
    direction: 'right',
    //Relacionado con el Player
    gravity: 0.4,
    jumpForce: -10,
    playerSpeed: 7,
    //Relacionado con las Plataformas
    estilo: marDraw,
    platformCreate: marPlatforms,
    platfUpdate: marUpdate,
    space: [490, 500], //min, max
    //[0]moving, [1]break, [2]trampolin
    percentPlatforms: [{max: 0},
                       {max: 0.3}, 
                       {max: 0}]
  }
]
/*-- TEMA MAR --*/
//fondo, create, update, draw
function marFondo(ctx, diff) {
  let image = new Image();
  image.src = 'assets/fondo-1.png'

 /* let bgY;
  let bgX;
  bgY = -938 + (diff / 5);
	bgX = 0;
*/
  ctx.drawImage(image, 0, -938, 400, 938);
}
//-----------------------------------------------
function marDraw(ctx, p) {
let marImage = new Image();
marImage.src = 'assets/platf-mar-1.png';

const bubble = new Image();

  if(p.isBreak) {
    const anchoPieza = p.width / p.piezas.length;

    p.piezas.forEach(pieza => {
      if(pieza.alpha <= 0) return;
	bubble.src = pieza.src;
      ctx.save();
      ctx.globalAlpha = Math.max(0, pieza.alpha);
      //ctx.fillStyle = "#000000";

      const posX = p.x + pieza.offsetX;
      const posY = p.y + pieza.offsetY;

      ctx.drawImage(bubble, posX, posY, pieza.size, pieza.size);
      ctx.restore()

    });
    return;
  
  }

 /* if(p.v != 0) {
    ctx.drawImage(marImage, 
    return;
  }

  if(p.isTrampolin) {
    ctx.fillStyle = '#278BF5';
    ctx.fillRect(p.x, p.y, p.width, p.height);
    return;
  }*/

  ctx.drawImage(marImage, p.x, p.y, 80, 20);
/*
  // Decoración superior (Capa de musgo de 4px)
  ctx.fillStyle = '#4c7828';
  ctx.fillRect(p.x, p.y, p.width, 4);*/
  
}
//-----------------------------------------------
function marPlatforms(config) {
  if(config.isBreak) {
    config.piezas = [
      {offsetX: 0, offsetY: 0, alpha: 1, size: 10, speed: 1.5, src: 'assets/bubble-mar.png'},
      {offsetX: 6, offsetY: 0, alpha: 1, size: 25, speed: 1.5, src: 'assets/bubble-mar.png'},
	{offsetX: 28, offsetY: 5, alpha: 1, size: 20, speed: 1.5, src: 'assets/bubble-mar.png'},
	{offsetX: 35, offsetY: 0, alpha: 1, size: 15, speed: 4, src: 'assets/bubble-mar.png'},
	{offsetX: 50, offsetY: 0, alpha: 1, size: 20, speed: 2, src: 'assets/bubble-mar.png'},
	{offsetX: 65, offsetY: 10, alpha: 1, size: 12, speed: 3, src: 'assets/bubble-mar.png'} 	
    ]
    //console.log(config);
    return new Platform(config);
  };

  return new Platform(config);
}
//-----------------------------------------------
function marUpdate(p) {
  //Modificamos piezas de Plataforma Break
  //if(!p.piezas || p.touch !== 1) return;

  if(p.isBreak && p.touch === 1) {
    for(let i = 0; i < p.piezas.length; i++) {
	if(i ===0 || i === 3 || i === 5) {
		p.piezas[i].offsetY -= p.piezas[i].speed;
		if(p.piezas[i].alpha > 0) p.piezas[i].alpha -= 0.02;
		if(p.piezas[i].offsetY < -25) p.piezas[i].src = 'assets/bubbles_explode.png';		
	}
    }
  }
  if(p.touch === 2) {
    for(let i = 0; i < p.piezas.length; i++) {
	p.piezas[i].src = 'assets/bubbles_explode.png';
      if(p.piezas[i].alpha > 0 ) p.piezas[i].alpha -= 0.1;
    }
  }

return;
}
