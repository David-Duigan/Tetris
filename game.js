const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

O = [[[".", ".", ".", ".", "."], 
      [".", "x", "x", ".", "."], 
      [".", "x", "x", ".", "."], 
      [".", ".", ".", ".", "."]]

];

L = [[[".", ".", "x", ".", "."], 
      [".", ".", "x", ".", "."], 
      [".", ".", "x", "x", "."], 
      [".", ".", ".", ".", "."]], 
      
      [[".", ".", ".", ".", "."], 
       [".", "x", "x", "x", "."], 
       [".", "x", ".", ".", "."], 
       [".", ".", ".", ".", "."]], 
       
      [[".", "x", "x", ".", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", ".", ".", "."]],

      [[".", ".", ".", "x", "."], 
       [".", "x", "x", "x", "."], 
       [".", ".", ".", ".", "."], 
       [".", ".", ".", ".", "."]] 
];
J = [[[".", ".", "x", ".", "."], 
      [".", ".", "x", ".", "."], 
      [".", "x", "x", ".", "."], 
      [".", ".", ".", ".", "."]], 
      
      [[".", "x", ".", ".", "."], 
       [".", "x", "x", "x", "."], 
       [".", ".", ".", ".", "."], 
       [".", ".", ".", ".", "."]], 
       
      [[".", ".", "x", "x", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", ".", ".", "."]],

      [[".", ".", ".", ".", "."], 
       [".", "x", "x", "x", "."], 
       [".", ".", ".", "x", "."], 
       [".", ".", ".", ".", "."]] 
];
I = [[[".", ".", "x", ".", "."], 
      [".", ".", "x", ".", "."], 
      [".", ".", "x", ".", "."], 
      [".", ".", "x", ".", "."]], 
      
      [[".", ".", ".", ".", "."], 
       ["x", "x", "x", "x", "."], 
       [".", ".", ".", ".", "."], 
       [".", ".", ".", ".", "."]]
];
T = [[[".", ".", "x", ".", "."], 
      [".", ".", "x", "x", "."], 
      [".", ".", "x", ".", "."], 
      [".", ".", ".", ".", "."]], 
      
      [[".", ".", ".", ".", "."], 
       [".", "x", "x", "x", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", ".", ".", "."]], 
       
      [[".", ".", "x", ".", "."], 
       [".", "x", "x", ".", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", ".", ".", "."]],

      [[".", ".", "x", ".", "."], 
       [".", "x", "x", "x", "."], 
       [".", ".", ".", ".", "."], 
       [".", ".", ".", ".", "."]] 
];

S = [[[".", ".", ".", ".", "."], 
      [".", ".", "x", "x", "."], 
      [".", "x", "x", ".", "."], 
      [".", ".", ".", ".", "."]], 
      
      [[".", ".", "x", ".", "."], 
       [".", ".", "x", "x", "."], 
       [".", ".", ".", "x", "."], 
       [".", ".", ".", ".", "."]]
       
];
Z = [[[".", ".", ".", ".", "."], 
      [".", "x", "x", ".", "."], 
      [".", ".", "x", "x", "."], 
      [".", ".", ".", ".", "."]], 
      
      [[".", ".", ".", "x", "."], 
       [".", ".", "x", "x", "."], 
       [".", ".", "x", ".", "."], 
       [".", ".", ".", ".", "."]]
       
];

class Button {
    constructor(game, x, y, width, height, text, color, stroke, font, hoverColor=color){
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.origX = this.x;
        this.text = text;
        this.color = color;
        this.hoverColor = hoverColor
        this.stroke = stroke;
        this.font = font;
        this.hover = false;

    }
    draw(ctx){
        this.priceX = this.x + this.width * 1.5 + 10;
        this.update();

        if (this.hover){
            ctx.fillStyle = this.hoverColor;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = 5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height/2 + 8)

    }
    update(){
        if (this.checkMouseCollision() && !this.game.mouse.clicked){
            this.hover = true;
        } else {
            this.hover = false;
        }
    }
    checkMouseCollision(){
        if (this.game.mouse.x >= this.x && this.game.mouse.x <= this.x + this.width
            && this.game.mouse.y >= this.y && this.game.mouse.y <= this.y + this.height){
                return true;
        }

        return false;
    }
}
class InputHandler {
    constructor(game){
        this.game = game;

        window.addEventListener("keydown", e => {
            if (this.game.keys.indexOf(e.key) === -1 && !this.pressed){
                this.game.keys.push(e.key)
            };
        });
        window.addEventListener("keyup", e => {
            this.game.keys.splice(this.game.keys.indexOf(e.key), 1) 
        });
    }
}

class Game {
    constructor(canvas, ctx, listHolder){
        this.ctx = ctx;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = [];
        this.listHolder = listHolder;
        this.tetris1 = new TetrisBoard(this)
        this.tetris2 = new TetrisBoard(this)
        this.inputHandler = new InputHandler(this);
        this.menu = true;
        this.background = document.getElementById('background');
        this.multiplayer = false;
        this.nextBlocks = [this.tetris1.blockTypes[Math.floor(Math.random() * this.tetris1.blockTypes.length)]];
        this.levelScreen = false;
        this.difficulty = "easy";
        this.musicList = [loadAudio("sounds/happy.mp3"), loadAudio("sounds/music2.wav"), loadAudio("sounds/music3.mp3"), loadAudio("sounds/music5.mp3"), loadAudio("sounds/music6.mp3"), loadAudio("sounds/music1.mp3")];
        this.music = undefined;
        this.changeMusic();
        this.clickAudio = loadAudio("sounds/click.mp3");
        this.loseAudio = loadAudio("sounds/lose.mp3");
        this.winAudio = loadAudio("sounds/win.mp3");
        this.music.volume = 0.4;
        this.loseAudio.volume = 0.5;
        this.winAudio.volume = 0.5;
        this.clickAudio.volume = 0.2;
        this.changeMusicTime = true;
        this.informationMenu = false;

        this.singlePlayerButton = new Button(this, this.width/3 + 100 - 40, this.height/2 + 50, 180, 80, "SinglePlayer", "transparent", "cyan", "25px Arial", "rgba(0, 255, 255, 0.5)");
        this.multiPlayerButton = new Button(this, this.width/3 + this.width/3 - 170 - 40, this.height/2 + 50, 180, 80, "MultiPlayer", "transparent", "cyan", "25px Arial", "rgba(0, 255, 255, 0.5)");
        this.informationButton = new Button(this, this.width - 75, 10, 60, 60, "Info", "transparent", "transparent", "40px Arial");
        this.informationExitButton = new Button(this, this.width - 70, 10, 60, 60, "X", "transparent", "red", "25px Arial", "rgba(255, 0, 0, 0.5)");

        let width = 180;
        let spacing = (this.width - (width * 4)) / 5

        this.easyButton = new Button(this, spacing, this.height/2, width, 80, "Easy", "lightgreen", "green", "25px Arial");
        this.mediumButton = new Button(this, spacing*2 + width, this.height/2, width, 80, "Medium", "orange", "yellow", "25px Arial");
        this.hardButton = new Button(this, spacing*3 + width*2, this.height/2, width, 80, "Hard", "red", "darkorange", "25px Arial");
        this.brutalButton = new Button(this, spacing*4 + width*3, this.height/2, width, 80, "Brutal", "darkred", "red", "25px Arial");
        this.firstInteraction = false;
        this.levelScreenButtons = [this.easyButton, this.mediumButton, this.hardButton, this.brutalButton]

        this.mouse = {
            x: undefined,
            y: undefined,
            clicked: false,
            start: undefined,
            moving: false,
        };

        window.addEventListener("mousedown", e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            this.mouse.clicked = true;
            this.mouse.start = e.x;
        });

        window.addEventListener("mousemove", e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y; 
            if ((this.mouse.start >= this.mouse.x + 40 || this.mouse.start <= this.mouse.x - 40) && this.mouse.clicked) {
                this.mouse.moving = true;
            } else {
                this.mouse.moving = false;
            }
        });

        window.addEventListener("mouseup", e => {
            this.mouse.clicked = false;
            this.origOffsetX = this.offsetX;
            this.mouse.moving = false;
        });

        window.addEventListener('click', () => {
            if (!this.firstInteraction) {
                this.firstInteraction = true;
            }
        });

    }
    changeMusic(){
        if (this.music) {
            this.music.muted = true;            
        }
        
        let loadIndex = Math.floor(Math.random() * this.musicList.length);
        this.music = this.musicList[loadIndex]

        this.music.currentTime = 0;
        this.music.muted = false;
               

    }
    render(deltaTime){

        if (this.firstInteraction) {
            this.music.addEventListener('ended', () => {
                this.changeMusic();
            });
            this.music.volume = 0.5;
            if (this.musicList.indexOf(this.music) === 0){
                this.music.volume = 0.3;
            } else if (this.musicList.indexOf(this.music) === 5){
                this.music.volume = 0.9;
            }
            this.music.play();
        }

        if (!this.menu && !this.levelScreen && !this.informationMenu) {

            if (this.multiplayer) {
                this.tetris1.x = this.width/2 - this.tetris1.width/2 + 350;
                this.tetris2.x = this.width/2 - this.tetris1.width/2 - 500;
                this.tetris1.createGrid();
                this.tetris2.createGrid();
                this.tetris2.draw(this.ctx, deltaTime);
                if (!this.tetris1.lost) {
                    this.tetris2.update(deltaTime);
                }
                this.tetris2.keys = ["d", "a", "w", "s", " "];
            }             
            this.tetris1.draw(this.ctx, deltaTime);
            if (!this.tetris2.lost) {
                this.tetris1.update(deltaTime); 3
            }

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.tetris1.y - 2)
            let text1 = "You Lost!";
            let text2 = "You Lost!";

            if (this.tetris1.lost && text1 !== "You Won!") text2 = "You Won!"
            else if (this.tetris2.lost && text2 !== "You Won!") text1 = "You Won!"
    
            if ((this.tetris2.lost || this.tetris1.lost)){
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "red";
                if (text1 === "You Won!") this.ctx.fillStyle = "green";
                this.ctx.font = "80px Arial";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                this.ctx.fillText(text1, this.tetris1.x + this.tetris1.width/2, this.tetris1.y + this.tetris1.height/2);
                this.ctx.strokeText(text1, this.tetris1.x + this.tetris1.width/2, this.tetris1.y + this.tetris1.height/2)

                if (this.multiplayer){
                    this.winAudio.play();
                    this.music.muted = true;
                    this.winAudio.addEventListener("ended", e => {                                
                        this.music.muted = false;
                    })
                    this.ctx.textAlign = "center";
                    this.ctx.fillStyle = "red";
                    if (text2 === "You Won!") this.ctx.fillStyle = "green";
                    this.ctx.font = "80px Arial";
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 1;
                    this.ctx.fillText(text2, this.tetris2.x + this.tetris2.width/2, this.tetris2.y + this.tetris2.height/2);
                    this.ctx.strokeText(text2, this.tetris2.x + this.tetris2.width/2, this.tetris2.y + this.tetris2.height/2)

                } else {
                    this.loseAudio.play();
                    this.music.muted = true;
                    this.loseAudio.addEventListener("ended", e => {                                
                        this.music.muted = false;
                    })
                }
            }

            
        } else if (this.informationMenu) {
            fillTextHelper("Right Player Keys", "green", "30px Arial", "left", 400, 100)
            fillTextHelper("Rotate:  Up Arrow", "white", "25px Arial", "left", 430, 145)
            fillTextHelper("Move Right:  Right Arrow", "white", "25px Arial", "left", 430, 180)
            fillTextHelper("Move Left:  Left Arrow", "white", "25px Arial", "left", 430, 215)
            fillTextHelper("Move Down:  Down Arrow", "white", "25px Arial", "left", 430, 250)
            fillTextHelper("Jump Down:  Right Control", "white", "25px Arial", "left", 430, 285)

            fillTextHelper("Left Player Keys", "red", "30px Arial", "left", 900, 100)
            fillTextHelper("Rotate:  W", "white", "25px Arial", "left", 930, 145)
            fillTextHelper("Move Right:  D", "white", "25px Arial", "left", 930, 180)
            fillTextHelper("Move Left:  A", "white", "25px Arial", "left", 930, 215)
            fillTextHelper("Move Down:  S", "white", "25px Arial", "left", 930, 250)
            fillTextHelper("Jump Down:  Space", "white", "25px Arial", "left", 930, 285)

            this.informationExitButton.draw(this.ctx);
            if (this.informationButton.checkMouseCollision() && this.mouse.clicked){
                this.menu = true;
                this.informationMenu = false;
                this.mouse.clicked = false;
            }

        } else if (this.menu) {
            this.multiplayer = false;
            this.ctx.drawImage(this.background, 0, 0, this.width, this.height);
            this.singlePlayerButton.draw(this.ctx);
            this.multiPlayerButton.draw(this.ctx);
            this.informationButton.draw(this.ctx);

            if (this.singlePlayerButton.checkMouseCollision() && this.mouse.clicked){
                this.clickAudio.play();
                this.menu = false;
                this.tetris1 = new TetrisBoard(this)
                this.tetris2 = new TetrisBoard(this)
                this.levelScreen = true;
                this.mouse.clicked = false;
            }

            else if (this.multiPlayerButton.checkMouseCollision() && this.mouse.clicked){
                this.clickAudio.play();
                this.menu = false;
                this.tetris1 = new TetrisBoard(this)
                this.tetris2 = new TetrisBoard(this)
                this.multiplayer = true;
                this.levelScreen = true;
                this.mouse.clicked = false;

            } else if (this.informationButton.checkMouseCollision() && this.mouse.clicked) {
                this.informationMenu = true;
                this.mouse.clicked = false;
            }

        } else if (this.levelScreen){
            this.levelScreenButtons.forEach(button => {
                button.draw(ctx);

                if (button.checkMouseCollision() && this.mouse.clicked){
                    this.clickAudio.play();
                    if (button.text === "Easy") this.difficulty = "easy";
                    else if (button.text === "Medium") this.difficulty = "medium";
                    else if (button.text === "Hard") this.difficulty = "hard";
                    else if (button.text === "Brutal") this.difficulty = "brutal";

                    this.changeMusic();
                    this.levelScreen = false;
                }
            })
        }
    }
}
class Cell {
    constructor(x, y, board){
        this.board = board;
        this.x = x;
        this.y = y;
        this.width = this.board.cellSize;
        this.height = this.board.cellSize;
        this.solid = false;
        this.color = "white";
        this.gridX = Math.round(((this.x - this.board.x) / this.board.cellSize));
        this.gridY = Math.round(((this.y - this.board.y) / this.board.cellSize));
        this.checkPoint(0, 0);
        this.markedForDeletion = false;

    }
    draw(ctx){    
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
    }
    checkPoint(x, y){
        if (x === this.gridX && y === this.gridY){
            return true;
        }
        return false;
    }

}

class TetrisBoard {
    constructor(game){
        this.game = game;
        this.height = this.game.height / 1.2;
        this.width = this.height/2;
        this.x = this.game.width/2 - this.width/2;
        this.y = this.game.height/2 - this.height/2;
        this.cellSize = this.height / 20;
        this.gridWidth = this.width / this.cellSize;
        this.gridHeight = this.height / this.cellSize;
        this.grid = [];
        this.blockTypes = ["o", "l", "j", "i", "t", "s", "z"];
        this.blocks = [];
        this.activeBlock = this.blocks[this.blocks.length - 1];
        this.random = undefined;
        this.score = 0;
        this.lost = false;
        this.lostTimer = 0;
        this.lostInterval = 2500;
        this.keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter"];
        this.currentBlock = 0;
        this.getPointAudio = loadAudio("sounds/getPoint.mp3")
        this.stopAudio = loadAudio("sounds/stop.mp3");
        this.turnAudio = loadAudio("sounds/turn.mp3");
        this.moveToAudio = loadAudio("sounds/moveTo.mp3");
        this.downAudio = loadAudio("sounds/down.wav");
        this.sideAudio = loadAudio("sounds/side.wav");
        this.checkpointAudio = loadAudio("sounds/checkpoint.mp3");
        this.turnAudio.volume = 0.5;
        this.stopAudio.volume = 0.9;
        this.moveToAudio.volume = 0.7;
        this.checkpoint = 10;

        this.createGrid();
        this.levelSettings();

    }
    levelSettings(){

    }
    createGrid(){
        this.grid = [];
        let yTime = 0;
        for (let y = this.y; y <= this.height + this.y - this.cellSize; y += this.cellSize){
            if (yTime < 20) {
                yTime += 1;
                let xTime = 0;
                for (let x = this.x; x < (this.cellSize * 10) + this.x; x += this.cellSize){
                    if (xTime < 10) {
                        this.grid.push(new Cell(x, y, this));
                    }
                    xTime += 1;
                }
            }
        }
    }
    drawOutline(){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    draw(ctx, deltaTime){

        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = "50px Arial"
        ctx.fillText(`Score: ${this.score}`, this.x + this.width + 30, this.y + this.height/2 - 40);

        this.blocks.forEach(block => {
            block.draw(ctx, deltaTime);
        });
        this.drawOutline();

        this.grid.forEach(cell => {
            cell.draw(ctx);
        })      
        
        this.drawNextBlock(ctx);

    }
    drawNextBlock(ctx){
        let nextBlock = undefined;
         
        if (this.game.nextBlocks[this.currentBlock] === "o") nextBlock = new OPiece(this.game, this, this.game.listHolder[0]);
        else if (this.game.nextBlocks[this.currentBlock] === "l") nextBlock = new LPiece(this.game, this, this.game.listHolder[1]);
        else if (this.game.nextBlocks[this.currentBlock] === "j") nextBlock = new JPiece(this.game, this, this.game.listHolder[2]);
        else if (this.game.nextBlocks[this.currentBlock] === "i") nextBlock = new IPiece(this.game, this, this.game.listHolder[3]);
        else if (this.game.nextBlocks[this.currentBlock] === "t") nextBlock = new TPiece(this.game, this, this.game.listHolder[4]);
        else if (this.game.nextBlocks[this.currentBlock] === "s") nextBlock = new SPiece(this.game, this, this.game.listHolder[5]);
        else if (this.game.nextBlocks[this.currentBlock] === "z") nextBlock = new ZPiece(this.game, this, this.game.listHolder[6]);

        if (nextBlock) {
            nextBlock.x = (this.gridWidth + (nextBlock.width + nextBlock.leftMarginWidth)/2);
            nextBlock.y = this.gridHeight/2 - (nextBlock.height + nextBlock.topMarginHeight)/2 - 5;

            nextBlock.initialCreate();
            nextBlock.draw(ctx);

            nextBlock.cells.forEach(tCell => {
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeRect(tCell.x, tCell.y, this.cellSize, this.cellSize)
            })

        }
    }

    update(deltaTime){
        if (this.score >= this.checkpoint){
            this.checkpointAudio.play();
            this.checkpoint += 10;
        }

        if (!this.lost) {
            this.blocks.forEach(block => {
                block.update(deltaTime);
            });
    
            this.blocks = this.blocks.filter(block => !block.markedForDeletion);
    

            if (this.blocks.length > 0) {
                this.activeBlock = this.blocks[this.blocks.length - 1];
    
                if (this.game.keys.indexOf(this.keys[0]) !== -1 && !(this.activeBlock.x + this.activeBlock.width + this.activeBlock.leftMarginWidth >= this.gridWidth) && this.activeBlock.right && !this.activeBlock.stop){
                    this.blocks[(this.blocks.length - 1)].x += 1;
                    this.activeBlock.changeCellsX(1);
                    this.game.keys.splice(this.game.keys.indexOf(this.keys[0]), 1);     
                    this.sideAudio.currentTime = 0;
                    this.sideAudio.play();               
                }

                if (this.game.keys.indexOf(this.keys[1]) !== -1 && !(this.activeBlock.x + this.activeBlock.leftMarginWidth <= 0) && this.activeBlock.left && !this.activeBlock.stop){
                    this.blocks[(this.blocks.length - 1)].x -= 1;
                    this.activeBlock.changeCellsX(-1);
                    this.game.keys.splice(this.game.keys.indexOf(this.keys[1]), 1);     
                    this.sideAudio.currentTime = 0;
                    this.sideAudio.play();   
                }


                if (this.game.keys.indexOf(this.keys[3]) !== -1 && !(this.activeBlock.y + this.activeBlock.height >= this.gridHeight) && !this.activeBlock.stop && this.activeBlock.stopTimer === 0){
                    this.downAudio.currentTime = 0;
                    this.downAudio.play();
                    this.blocks[(this.blocks.length - 1)].y += 1;
                    this.activeBlock.increaseCellsY();
                    this.game.keys.splice(this.game.keys.indexOf(this.keys[3]), 1);
                
                    
                }
                if (this.game.keys.indexOf(this.keys[4]) !== -1 && !(this.activeBlock.y + this.activeBlock.height >= this.gridHeight) && !this.activeBlock.stop && this.activeBlock.stopTimer === 0){   
                    this.moveToAudio.currentTime = 0;
                    this.moveToAudio.play();
                    this.activeBlock.workoutToMove();       

                    for (let i = 0; i < this.activeBlock.toMove; i++) {
                        this.blocks[(this.blocks.length - 1)].y += 1;
                        this.activeBlock.increaseCellsY(); 
                    }

                    this.activeBlock.stopTimer = this.activeBlock.stopInterval;
                    this.activeBlock.stop = true;
                    this.activeBlock.speedTimer = 0;
                    this.activeBlock.speedInterval = 5000;
    
                    this.game.keys.splice(this.game.keys.indexOf(this.keys[4]), 1);
                    
                }
        
                if (this.game.keys.indexOf(this.keys[2]) !== -1){
                    this.turnAudio.currentTime = 0;
                    this.turnAudio.play()

                    this.activeBlock.rotation += 1;
                    this.game.keys.splice(this.game.keys.indexOf(this.keys[2]), 1);
    
                    if (this.activeBlock.rotation >= this.activeBlock.rotationList.length) this.activeBlock.rotation = 0;
                    else if (this.activeBlock.rotation < 0) this.activeBlock.rotation = (this.activeBlock.rotationList.length - 1);
    
                    this.activeBlock.initiateHeight();
                    let subtracted = false;
    
                    this.activeBlock.initialCreate();
    
                    this.blocks.forEach(block => {
                        block.update(deltaTime);
                    });
    
                    this.activeBlock.cells.forEach(tCell => {
                        this.grid.forEach(cell => {
                            if ((cell.checkPoint(tCell.gridX, tCell.gridY)) && cell.solid && !subtracted){
                                this.activeBlock.rotation -= 1;
                                console.warn("Stopped")
                                subtracted = true;
    
                            } else if (tCell.gridY > (this.gridHeight - 1) && !subtracted){
                                this.activeBlock.rotation -= 1;
                                console.warn("Stopped Bottom")
                                subtracted = true;
                                this.activeBlock.y += 1;
    
                            } else if (tCell.gridX < 0 && !subtracted){
                                this.activeBlock.rotation -= 1;
                                console.warn("Stopped Left")
                                subtracted = true;
    
                            } else if (tCell.gridX > (this.gridWidth - 1) && !subtracted){
                                this.activeBlock.rotation -= 1;
                                console.warn("Stopped Right")
                                subtracted = true;
                            }
                              
                        });
                    });
    
                    if (this.activeBlock.rotation >= this.activeBlock.rotationList.length) this.activeBlock.rotation = 0;
                    else if (this.activeBlock.rotation < 0) this.activeBlock.rotation = (this.activeBlock.rotationList.length - 1);
    
                    this.activeBlock.initialCreate();
    
                }
                    
                if (this.activeBlock.stop){
                    this.pickRandomBlock();
                    this.game.nextBlocks.push(this.blockTypes[Math.floor(Math.random() * this.blockTypes.length)]);
                    this.activeBlock = this.blocks[this.blocks.length - 1];
                    
                }
                
            } else {
                this.pickRandomBlock();
                this.game.nextBlocks.push(this.blockTypes[Math.floor(Math.random() * this.blockTypes.length)]);
            }
    
        } else {
            this.lostTimer += deltaTime;
            if (this.lostTimer >= this.lostInterval){
                this.game.menu = true;
                this.game.changeMusic();
                this.lostTimer = 0;
            }
        }
    }

    pickRandomBlock(){
        this.random = this.game.nextBlocks[this.currentBlock];
        this.currentBlock += 1;
        if (this.random === "o") this.blocks.push(new OPiece(this.game, this, this.game.listHolder[0]));
        else if (this.random === "l") this.blocks.push(new LPiece(this.game, this, this.game.listHolder[1]));
        else if (this.random === "j") this.blocks.push(new JPiece(this.game, this, this.game.listHolder[2]));
        else if (this.random === "i") this.blocks.push(new IPiece(this.game, this, this.game.listHolder[3]));
        else if (this.random === "t") this.blocks.push(new TPiece(this.game, this, this.game.listHolder[4]));
        else if (this.random === "s") this.blocks.push(new SPiece(this.game, this, this.game.listHolder[5]));
        else if (this.random === "z") this.blocks.push(new ZPiece(this.game, this, this.game.listHolder[6]));
    }
}

class TetrisCell {
    constructor(game, board, x, y, color){
        this.game = game;
        this.board = board;
        this.x = x;
        this.y = y;
        this.color = color;
        this.gridX = Math.round((this.x - this.board.x) / this.board.cellSize);
        this.gridY = Math.round((this.y - this.board.y) / this.board.cellSize);
        this.markedForDeletion = false;
        
    }
    draw(ctx){
        this.gridX = Math.round((this.x - this.board.x) / this.board.cellSize);
        this.gridY = Math.round((this.y - this.board.y) / this.board.cellSize);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.board.cellSize, this.board.cellSize);
    }

}

class Block {
    constructor(game, board){
        this.game = game;
        this.board = board;
        this.x = 0;
        this.y = 0;
        this.speedInterval = 500;
        this.speedTimer = 0;
        this.cellSize = this.board.cellSize;
        this.stop = false;
        this.rotation = 0;
        this.positionMargin = 5;
        this.stopInterval = 300;
        this.stopTimer = 0;
        this.right = true;
        this.left = true;
        this.cells = [];
        this.markedForDeletion = false;
        this.toMove = 0;
        this.drawShadow = true;
        this.ctx = this.game.ctx;

        this.difficultySettings();

    }
    difficultySettings(){
        if (this.game.difficulty === "easy"){
            this.drawShadow = true;
            this.speedInterval = 620;
            this.stopInterval = 350;

        } else if (this.game.difficulty === "medium"){
            this.drawShadow = true;
            this.speedInterval = 380;
            this.stopInterval = 300;

        } else if (this.game.difficulty === "hard"){
            this.drawShadow = false;
            this.speedInterval = 240;
            this.stopInterval = 270;

        } else if (this.game.difficulty === "brutal"){
            this.drawShadow = false;
            this.speedInterval = 120;
            this.stopInterval = 200;

        }
    }
    initialCreate(){
        this.cells = [];
        let rotation = this.rotationList[this.rotation];
        for (let row = 0; row <= rotation[0].length; row++){
            for (let column = 0; column < rotation.length; column++){
                if (rotation[column][row] === "x") {
                    this.cells.push(new TetrisCell(this.game, this.board, (this.x + row) * this.cellSize + this.board.x, (this.y + column) * this.cellSize + this.board.y, this.color))
                }                
            }
        }  
    }
    workoutToMove(){
        let shortestPath = this.board.gridHeight * 2;

        this.cells.forEach(tCell => {
            tCell.draw(this.ctx);
        })
        this.board.grid.forEach(cell => {
            cell.draw(ctx);
        })      
        this.board.drawOutline();

        this.board.grid.forEach(cell => {
            this.cells.forEach(tCell => {
                if (cell.solid) {
                    if (cell.gridX === tCell.gridX && cell.gridY >= tCell.gridY){
                        this.toMove = cell.gridY - (tCell.gridY + 1);
                        if (this.toMove < shortestPath) shortestPath = this.toMove;
                    }

                } else {
                    if (cell.gridY === (this.board.gridHeight - 1)){
                        this.toMove = cell.gridY - (tCell.gridY);
                        if (this.toMove < shortestPath) shortestPath = this.toMove;
                    }
                }
            });
        })

        this.toMove = shortestPath;
    }
    draw(ctx, deltaTime){
        this.update(deltaTime);
        this.workoutToMove();
        if (this.board.activeBlock === this && this.drawShadow) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            this.cells.forEach(tCell => {
                ctx.strokeRect(tCell.x, tCell.y + (this.toMove * this.board.cellSize), this.board.cellSize, this.board.cellSize);
            })
        }
    }
    increaseCellsY(direction=1){
        this.cells.forEach(tCell => {
            tCell.y += (this.board.cellSize * direction);
        });
    }
    changeCellsX(direction){
        this.cells.forEach(tCell => {
            tCell.x += (this.board.cellSize * direction);
        });
    }
    update(deltaTime){
        this.initiateHeight();
        
        this.workoutToMove();
        this.right = true;
        this.left = true;

        if (this.cells.length <= 0){
            this.markedForDeletion = true;
        }

        this.cells = this.cells.filter(tCell => !tCell.markedForDeletion);

        if (this.stop) {
            this.cells.forEach(tCell => {
                if (tCell.gridY <= 0){
                    this.board.lost = true;
                }
            });
        }

        this.cells.forEach(tCell => {
            if (this.stop){
                this.board.grid.forEach(cell => {
                    if (cell.checkPoint(tCell.gridX, tCell.gridY)){
                        cell.solid = true;                                                              
                    }
                });
            }

            this.board.grid.forEach(cell => {
                if (tCell.gridX === cell.gridX && tCell.gridY + 1 === cell.gridY && cell.solid){
                    this.speedTimer = 0;
                    this.stopTimer += deltaTime;
                    if (this.stopTimer >= this.stopInterval){
                        this.stop = true;
                        this.board.stopAudio.play();
                        this.stopTimer = 0;
                        this.stopInterval = 100000000000000;
                    }
                } 
                if (cell.gridY === tCell.gridY && cell.solid && !this.stop){
                    if (cell.gridX === tCell.gridX + 1){    
                        this.right = false;
                    }                                    
                }
    
                if (cell.gridY === tCell.gridY && cell.solid && !this.stop){
                    if (cell.gridX === tCell.gridX - 1){
                        this.left = false;
    
                    }        
                }                
            });
            
        });

        let blocksOnCurrentY = 0;
        let currentY = 0;
        let deleteY = 0;
        let toDelete = false;

        this.board.grid.forEach(cell => {

            if (cell.solid){ 
                if (currentY === cell.gridY){
                    blocksOnCurrentY++;

                } else {
                    currentY = cell.gridY;
                    blocksOnCurrentY = 1;
                }

            }
            if (blocksOnCurrentY >= 10){
                toDelete = true;
                deleteY = currentY;                
            };
        });
        
        if (toDelete){
            this.board.grid.forEach(cell => {
                cell.solid = false;
            });

            this.board.blocks.forEach(block => {
                block.cells.forEach(tCell => {
                    if (tCell.gridY === deleteY){
                        tCell.markedForDeletion = true;

                    } else if (tCell.gridY < deleteY && block.stop){
                        tCell.y += this.board.cellSize;
                    }

                });

            });
            this.board.getPointAudio.play();
            this.board.score += 1;
        }
    
        if (this.y + this.height + this.topMarginHeight > this.board.gridHeight){
            this.y -= 1;
            this.increaseCellsY(-1);
            console.warn("IT WENT OUT AT THE BOTTOM!")
        }
        
        if (this.y + this.height + this.topMarginHeight >= this.board.gridHeight){
            this.speedTimer = 0;
            this.stopTimer += deltaTime;
            if (this.stopTimer >= this.stopInterval){
                this.stop = true;
                this.board.stopAudio.play();
                this.stopTimer = 0;
                this.stopInterval = 100000000000000;
            }
            
        } else if (!this.stop && this.speedTimer !== 0){
            this.stopTimer = 0;
        }

        if (this.speedTimer >= this.speedInterval && !this.stop && this.stopTimer === 0){
            this.y += 1;
            this.increaseCellsY();
            this.speedTimer = 0;

        }
        this.speedTimer += deltaTime;
    }

    initiateHeight(){
        this.width = 0;
        this.height = 0;
        this.topMarginHeight = 0;
        this.leftMarginWidth = 0;
        let rotation = this.rotationList[this.rotation];
        let XFound = false;
        let atTop = true;
        let atLeft = true;

        for (let i = 0; i < rotation.length; i++){
            XFound = false;
            rotation[i].forEach(value => {
                if (value === "x"){
                    atTop = false;
                    XFound = true;
                }                  
            });
            if (XFound){
                this.height += 1;
            } else {
                if (atTop){
                    this.topMarginHeight += 1;
                }
            }
        }
        XFound = false;
        for (let i = 0; i < rotation[0].length; i++){
            XFound = false;
            rotation.forEach(column => {
                if (column[i] === "x"){
                    atLeft = false;
                    XFound = true;
                }                             
            });
            if (XFound){
                this.width += 1;
            } else {
                if (atLeft){
                    this.leftMarginWidth += 1;
                }
            }
        }
    }
}
class OPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "rgb(255, 210, 0)";
        this.initialCreate();
    }
}

class LPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "darkorange";
        this.initialCreate();
        
    }
}

class JPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "blue";
        this.initialCreate();
        
    }
}
class IPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "cyan";
        this.initialCreate();
        
    }
}
class TPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "purple";
        this.initialCreate();
        
    }
}
class SPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "green";
        this.initialCreate();
        
    }
}
class ZPiece extends Block {
    constructor(game, board, rotList){
        super(game, board);
        this.rotationList = rotList;
        this.initiateHeight();
        this.y -= (this.height + this.topMarginHeight);
        this.x = Math.round(this.board.gridWidth/2 - this.width/2 - this.leftMarginWidth);
        this.color = "red";
        this.initialCreate();
        
    }
}

const listHolder = [O, L, J, I, T, S, Z];
const game = new Game(canvas, ctx, listHolder);
let lastTime = 0;

function loadAudio(src){
    let audio = new Audio();
    audio.src = src;

    return audio;
}

function fillTextHelper(text, color, font, align, x, y){
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y)
}

function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    game.render(deltaTime);

    requestAnimationFrame(animate);
}

animate(0);