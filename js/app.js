var game = new Phaser.Game(1200, 720, Phaser.CANVAS, 'theGame', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('court', 'assets/court-small.png');
    game.load.image('basketball', 'assets/basketball.gif');
    game.load.spritesheet('sean', 'assets/sean.png', 80, 120);
    game.load.spritesheet('zahir', 'assets/d1zahh.png', 80, 120);

}

var player;
var court;
var cursors;
var position;
var holdsBall;
var score1 = 0;
var score2 = 0;
var scoreText1;
var scoreText2;
var pauseTime = 0;
var paused = false;
var passTime = 0;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    court = game.add.sprite(0, 0, 'court');

    player = game.add.sprite((game.world.width/2)-50, (game.world.height/2)-15, 'sean');
    game.physics.arcade.enable(player);

    basketball = game.add.sprite((game.world.width/2)-8, (game.world.height/2)+5, 'basketball');
    game.physics.arcade.enable(basketball);

    player.body.collideWorldBounds = true;
    basketball.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  The score
    scoreText1 = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreText2 = game.add.text(1000, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    passButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
}

function update() {
  if(game.time.now - pauseTime > 2000) {
    if(paused) {
      basketball.reset((game.world.width/2)-8, (game.world.height/2)+5);
      paused = false;
    }
    game.physics.arcade.overlap(player, basketball, holding);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if(game.time.now - passTime > 2000) {
      basketball.body.velocity.x = 0;
      basketball.body.velocity.y = 0;
    }

    if (cursors.left.isDown)
    {
        if(position != "left" && holdsBall) {
            basketball.reset(player.x - 15, player.y + 20);
        }

        player.body.velocity.x = -150;
        player.animations.play('left');
        position = "left";

        if(holdsBall) {
          basketball.body.velocity.x = -150;
        }

    }
    else if (cursors.right.isDown)
    {
        if(position != "right" && holdsBall) {
            basketball.reset(player.x + 22, player.y + 20);
        }

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

    if(basketball.x > 1091 && basketball.x < 1168 && basketball.y > 329 && basketball.y < 375) {
        scored();
        scored2();
        holdsBall = false;
    }

    if(basketball.x < 91 && basketball.x > 25 && basketball.y > 329 && basketball.y < 375) {
        scored();
        scored1();
        holdsBall = false;
    }
  }
}

function holding (player, basketball) {

    // Removes the star from the screen
    holdsBall = true;

}

function scored () {
    pauseTime = game.time.now;
    paused = true;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    basketball.body.velocity.x = 0;
    basketball.body.velocity.y = 0;

    player.animations.stop();

    player.frame = 4;
}

function scored1() {
    //  Add and update the score
    score1 += 2;
    scoreText1.text = 'Score: ' + score1;
}

function scored2() {
    //  Add and update the score
    score2 += 2;
    scoreText2.text = 'Score: ' + score2;
}

function passBall(){
    distance = 20;

    if(position == "right") {
        basketball.reset(basketball.x + distance, basketball.y);
        basketball.body.velocity.x = 300;
        passTime = game.time.now;

    }
    else if(position == "left") {
        basketball.reset(basketball.x - distance, basketball.y);
        basketball.body.velocity.x = -300;
        passTime = game.time.now;
    }
    else if(position == "up") {
        basketball.reset(basketball.x, basketball.y - distance);
        basketball.body.velocity.y = -300;
        passTime = game.time.now;
    }
    else if(position == "down") {
        basketball.reset(basketball.x, basketball.y + distance);
        basketball.body.velocity.y = 300;
        passTime = game.time.now;
    }

    holdsBall = false;
}
