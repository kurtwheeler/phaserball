var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('court', 'assets/court.png');
    game.load.image('basketball', 'assets/basketball.gif');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var court;
var cursors;
var position;
var holdsBall;
var score = 0;
var scoreText;
var shootTween;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    court = game.add.sprite(0, 0, 'court');

    court.scale.setTo(0.385,0.5);

    player = game.add.sprite((game.world.width/2)-50, (game.world.height/2)-15, 'dude');
    game.physics.arcade.enable(player);

    basketball = game.add.sprite((game.world.width/2)-8, (game.world.height/2)+5, 'basketball');
    game.physics.arcade.enable(basketball);

    player.body.collideWorldBounds = true;
    basketball.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    passButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    
    shootTween = game.add.tween(basketball);
}

function update() {
    game.physics.arcade.overlap(player, basketball, holding);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    basketball.body.velocity.x = 0;
    basketball.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
        position = "left";

        if(holdsBall) {
          basketball.body.velocity.x = -150;
        }

    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
        position = "right";

        if(holdsBall) {
          basketball.body.velocity.x = 150;
        }
    }
    else
    {
        player.animations.stop();

        player.frame = 4;
    }
    
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -150;
        position = "up";

        if(holdsBall) {
          basketball.body.velocity.y = -150;
        }
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 150;
        position = "down";

        if(holdsBall) {
          basketball.body.velocity.y = 150;
        }
    }

    if(passButton.isDown && holdsBall) {
        passBall();
    }

    if(shootButton.isDown && holdsBall) {
        holdsBall = false;
    }

}

function holding (player, basketball) {
    
    // Removes the star from the screen
    holdsBall = true;

}

function scored(ball, hoop) {

    //  Add and update the score
    score += 2;
    scoreText.text = 'Score: ' + score;
}

function passBall(){
    if(position == "right") {
        basketball.reset(basketball.x + 30, basketball.y);
    }
    else if(position == "left") {
        basketball.reset(basketball.x - 30, basketball.y);
    }
    else if(position == "up") {
        basketball.reset(basketball.x, basketball.y - 30);
    }
    else if(position == "down") {
        basketball.reset(basketball.x, basketball.y + 30);
    }

    holdsBall = false;
}
