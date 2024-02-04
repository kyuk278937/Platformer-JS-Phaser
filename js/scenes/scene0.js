export default class scene0 extends Phaser.Scene {
    constructor(){
        super('scene0')

        this.keyA;
        this.keyD;
        this.keyShift;
        this.keySpace;
        this.keyAlt;

        this.cameraZoom = 2;

        this.itemsScale = 2;
        this.itemsFrameSize = 18;

        this.SCENE_HEIGHT = 600;
        this.SCENE_WIDTH = 800;
        this.WORLD_WIDTH = 1600;

        this.platforms;

        this.plants;

        this.ladder;

        this.player;
        this.playerWasX = 0;
        this.playerScale = 2.5;
        this.playerGoingRight = true;

        this.sky;
        this.skyWidth = 96;
        this.skyScale = 8.5;
        this.skyPosX=(this.WORLD_WIDTH/2)-((this.skyWidth*(this.skyScale/2))/2);
    }

    createIsland(x,y,len,scale) {
        this.platforms.create(x,y,'world',1).setScale(scale);
        
        for(let i = 0; i<len; i++){
            this.platforms.create(x+36*(i+1),y,'world',2).setScale(scale);
        }

        this.platforms.create(x+36*(1+len),y,'world',3).setScale(scale);
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
            key: "playerHideAnim",
            frames: this.anims.generateFrameNumbers('playerHide', {frames: [0, 1, 2, 3, 4, 0, 5]}),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: "playerHideLeftAnim",
            frames: this.anims.generateFrameNumbers('playerHideLeft', {frames: [0, 1, 2, 3, 4, 0 ,5]}),
            frameRate: 6,
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
        this.cameras.main.setBounds(0,0,1600,600);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(this.cameraZoom);
    }

    createLadder(x,y,len,scale){
        this.ladder.create(x,y,'world',71).setScale(scale);
        
        for(let i = 0; i<len; i++){
            this.ladder.create(x,y-36*(i+1),'world',71).setScale(scale);
        }

        this.ladder.create(x,y-36*(1+len),'world',51).setScale(scale);
    }

    skysController(){
        if(this.player.x>=this.SCENE_WIDTH/4 && this.player.x<=this.WORLD_WIDTH-this.SCENE_WIDTH/4){
            this.skyPosX += (this.player.x - this.playerWasX)/3;
        }
        this.sky.setX(this.skyPosX);
        this.playerWasX = this.player.x;
    }

    playerController(){
        if(this.keyShift.isDown){
            this.player.setVelocityX(0)
            if(this.anim != 4 && this.anim != 3){
                this.anim = 4;
                if(this.playerGoingRight){
                    this.player.play("playerHideAnim");
                }else{
                    this.player.play("playerHideLeftAnim");
                }
            }
        }else if(this.keyA.isDown){
            this.player.setVelocityX(-160);
            this.playerGoingRight = false;
            if(this.anim != 2 && this.anim != 3){
                this.player.play("playerRunLeftAnim");
                this.anim = 2;
            }
        }else if(this.keyD.isDown){
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


        if(this.keySpace.isDown && this.player.body.touching.down){
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
        this.load.spritesheet('world','././assets/tilemap_packed.png', {frameWidth: this.itemsFrameSize, frameHeight: this.itemsFrameSize});
        this.load.spritesheet('playerIdle','././assets/Meow-Knight_Idle.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerIdleLeft','././assets/Meow-Knight_Idle_Left.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerRun','././assets/Meow-Knight_Run.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerRunLeft','././assets/Meow-Knight_Run_Left.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerJump','././assets/Meow-Knight_Dodge.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerJumpLeft','././assets/Meow-Knight_Dodge_Left.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerHide','././assets/playerHide.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerHideLeft','././assets/playerHideLeft.png', {frameWidth: 16, frameHeight: 16});

        this.load.audio('catCuteSound1','././assets/cat1.mp3');
        this.load.audio('catCuteSound2','././assets/cat2.mp3');
        this.load.audio('catCuteSound3','././assets/cat3.mp3');
        this.load.audio('catCuteSound4','././assets/cat4.mp3');
        this.load.audio('catCuteSound5','././assets/cat5.mp3');
    }

    create(){
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyAlt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT);

        this.sound.unlock();
        let catCuteSound1 = this.sound.add('catCuteSound1');
        let catCuteSound2 = this.sound.add('catCuteSound2');
        let catCuteSound3 = this.sound.add('catCuteSound3');
        let catCuteSound4 = this.sound.add('catCuteSound4');
        let catCuteSound5 = this.sound.add('catCuteSound5');
        this.keyAlt.on('down', function(){
            let n = Math.round(Math.random() * 4)
            if(n==0){
                catCuteSound1.play();
            }else if(n==1){
                catCuteSound2.play();
            }else if(n==2){
                catCuteSound3.play();
            }else if(n==3){
                catCuteSound4.play();
            }else{
                catCuteSound5.play();
            }
        });

        this.physics.world.bounds.width = this.WORLD_WIDTH;

        this.plants = this.physics.add.staticGroup();
        this.plants.imovableY = true;

        this.sky = this.physics.add.staticGroup();
        this.sky.imovableY = true;
        this.sky.create(0,300,'sky').setScale(this.skyScale);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.enableBody = true;
        this.platforms.imovable = true;

        this.createIsland(0,this.SCENE_HEIGHT-this.itemsFrameSize,Math.ceil(this.SCENE_WIDTH/this.itemsFrameSize),this.itemsScale);
        this.createIsland(120,453,4,this.itemsScale);
        this.createIsland(360,381,7,this.itemsScale);

        this.ladder = this.physics.add.staticGroup();
        this.ladder.imovable = true;
        this.platforms.enableBody = false;

        this.createLadder(84,552,3,this.itemsScale);


        this.plants.create(326,552,'world',125).setScale(2);
        this.plants.create(396,351,'world',127).setScale(2);
        
        this.createPlayer(50,532);
        this.createCamera();

        this.plants = this.physics.add.staticGroup();
        this.plants.imovableY = true;
        this.platforms.enableBody = false;

        this.plants.create(294,555,'world',124).setScale(2);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.ladder);
    }

    update(){
        this.playerController();
        this.skysController();
    }
}