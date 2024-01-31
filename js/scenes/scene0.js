export default class scene0 extends Phaser.Scene {
    constructor(){
        super('scene0')

        this.ground;
        this.player;
        this.cursor;

        this.anim = -1;
    }

    createIsland(x,y,len) {
        this.ground.create(x,y,'items',1).setScale(2);
        
        for(let i = 1; i<len; i++){
            this.ground.create(x+36*i,y,'items',2).setScale(2);
        }

        this.ground.create(x+36*len,y,'items',3).setScale(2);
    }

    preload(){
        this.load.image('sky','././assets/background.png');
        this.load.spritesheet('items','././assets/tilemap_packed.png', {frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('playerIdle','././assets/Meow-Knight_Idle.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('playerRun','././assets/Meow-Knight_Run.png', {frameWidth: 16, frameHeight: 16});
    }

    create(){
        this.add.image(400,300,'sky').setScale(8.5)

        this.ground = this.physics.add.staticGroup()

        for(let i = 18; i<818; i+=36){
            this.ground.create(i,581,'items',2).setScale(2);
        }

        this.createIsland(120,460,4);
        this.createIsland(360,380,7);


        this.player = this.physics.add.sprite(50,532,'playerIdle').setScale(2.5);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        this.anims.create({
            key: "playerIdleAnim",
            frames: this.anims.generateFrameNumbers('playerIdle', {frames: [0, 1, 3, 4, 5]}),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: "playerRunAnim",
            frames: this.anims.generateFrameNumbers('playerRun', {frames: [0, 1, 3, 4, 5, 6, 7, 8]}),
            frameRate: 6,
            repeat: -1
        });


        this.cursor = this.input.keyboard.createCursorKeys();


        this.physics.add.collider(this.player, this.ground);
    }

    update(){
        if(this.cursor.left.isDown){
            this.player.setVelocityX(-160)
            this.player.setScale(-2.5,2.5);
            if(this.anim != 1){
                this.player.play("playerRunAnim");
                this.anim = 1;
            }
        }else if(this.cursor.right.isDown){
            this.player.setVelocityX(160)
            this.player.setScale(2.5,2.5);
            if(this.anim != 1){
                this.player.play("playerRunAnim");
                this.anim = 1;
            }
        }else{
            this.player.setVelocityX(0)
            if(this.anim != 0){
                this.player.play("playerIdleAnim");
                this.anim = 0;
            }
        }

        if(this.cursor.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-400);
        }

    }
}