export default class scene0 extends Phaser.Scene {
    constructor(){
        super('scene0')

        this.cursor;

        this.SCENE_HEIGHT = 600;
        this.SCENE_WIDTH = 800;

        this.platforms;
        this.platformsScale = 2;
        this.platformFrameSize = 18;

        this.player;
        this.playerScale = 2.5;
        this.playerGoingRight = true;
    }

    createIsland(x,y,len,scale) {
        this.platforms.create(x,y,'world',1).setScale(scale);
        
        for(let i = 0; i<len; i++){
            this.platforms.create(x+36*(i+1),y,'world',2).setScale(scale);
        }

        this.platforms.create(x+36*(1+len),y,'world',3).setScale(scale);
    }

    createSky(x,y,len,spriteWidth,scale){
        for(let i = 0; i<len; i++){
            this.add.image(x,y,'sky').setScale(scale);
            x += spriteWidth;
        }
    }

    createPlayer(x,y){
        this.player = this.physics.add.sprite(x,y,'playerIdle').setScale(this.playerScale);
        this.player.setBounce(0.2);
        this.player.body.collideWorldBounds = true;

        this.anims.create({
            key: "playerIdleAnim",
            frames: this.anims.generateFrameNumbers('playerIdle', {frames: [0, 0, 1, 1, 3, 1, 5, 5]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "playerIdleLeftAnim",
            frames: this.anims.generateFrameNumbers('playerIdleLeft', {frames: [0, 0, 1, 1, 3, 1, 5, 5]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "playerRunAnim",
            frames: this.anims.generateFrameNumbers('playerRun', {frames: [0, 1, 3, 4, 5, 6, 7]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "playerRunLeftAnim",
            frames: this.anims.generateFrameNumbers('playerRunLeft', {frames: [0, 1, 3, 4, 5, 6, 7]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "playerJumpAnim",
            frames: this.anims.generateFrameNumbers('playerJump', {frames: [2, 3, 4, 5]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "playerJumpLeftAnim",
            frames: this.anims.generateFrameNumbers('playerJumpLeft', {frames: [2, 3, 4, 5]}),
            frameRate: 8,
            repeat: -1
        });
    }

    createCamera(){
        this.cameras.main.setBounds(0,0,800,600);
        this.cameras.main.startFollow(this.player);
        this.physics.world.bounds.width = 1600;
    }

    playerController(){
        if(this.cursor.left.isDown){
            this.player.setVelocityX(-160)
            this.playerGoingRight = false;
            if(this.anim != 2 && this.anim != 3){
                this.player.play("playerRunLeftAnim");
                this.anim = 2;
            }
        }else if(this.cursor.right.isDown){
            this.player.setVelocityX(160)
            this.playerGoingRight = true;
            if(this.anim != 1 && this.anim != 3){
                this.player.play("playerRunAnim");
                this.anim = 1;
            }
        }else{
            this.player.setVelocityX(0)
            if(this.anim != 0 && this.anim != 3){
                this.anim = 0;
                if(this.playerGoingRight){
                    this.player.play("playerIdleAnim");
                }else{
                    this.player.play("playerIdleLeftAnim");
                }
            }
        }

        if(this.anim == 3 && this.player.body.touching.down){
            this.anim = 0;
            if(this.playerGoingRight){
                this.player.play("playerIdleAnim");
            }else{
                this.player.play("playerIdleLeftAnim");
            }
        }
        if(this.cursor.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-300);
            this.anim = 3;
            if(this.playerGoingRight){
                this.player.play("playerJumpAnim");
            }else{
                this.player.play("playerJumpLeftAnim");
            }
        }
    }

    preload(){
        this.load.image('sky','././assets/background.png');
        this.load.spritesheet('world','././assets/tilemap_packed.png', {frameWidth: this.platformFrameSize, frameHeight: this.platformFrameSize});
        this.load.spritesheet('playerIdle','././assets/Meow-Knight_Idle.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerIdleLeft','././assets/Meow-Knight_Idle_Left.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerRun','././assets/Meow-Knight_Run.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerRunLeft','././assets/Meow-Knight_Run_Left.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerJump','././assets/Meow-Knight_Dodge.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerJumpLeft','././assets/Meow-Knight_Dodge_Left.png', {frameWidth: 16, frameHeight: 16});
    }

    create(){
        this.cursor = this.input.keyboard.createCursorKeys();

        this.createSky(400,300,1,96,8.5);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.enableBody = true;
        this.platforms.imovable = true;

        this.createIsland(0,this.SCENE_HEIGHT-this.platformFrameSize,30,this.platformsScale);

        this.createIsland(120,460,4,this.platformsScale);
        this.createIsland(360,380,7,this.platformsScale);

        this.createPlayer(50,532);
        this.createCamera();

        this.physics.add.collider(this.player, this.platforms);
    }

    update(){
        this.playerController();
    }
}