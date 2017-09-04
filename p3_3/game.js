var actions = { preload: preload, create: create, update: update };
var game = new Phaser.Game(790, 400, Phaser.AUTO, "game", actions);
var score = 0;
var labelScore;
var player;
var object;
var x;
var y;
var isInitialised;
var object_array = [];
var probA = 1/3;
var probB = 1/3;
var probC = 1/3;

function preload() {
  game.load.image("playerImg","../assets/flappy_batman.png");
  game.load.image("objectA","../assets/pipe_green.png");
  game.load.image("objectB","../assets/pipe_orange.png");
  game.load.image("objectC","../assets/pipe_red.png");

}

function create() {
  game.stage.setBackgroundColor("#00ffff");
  game.add.text(100, 20, "Green: +5 points, Orange: -5, Red: Avoid")
  labelScore = game.add.text(750, 20, "0");

  game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown);
  game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
  game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
  game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  player = game.add.sprite(395, 300, "playerImg");
  game.physics.arcade.enable(player)
  player.body.collideWorldBounds = true;
  game.time.events.repeat(Phaser.Timer.SECOND * 3, Number.MAX_VALUE, spawnObject);
}

function update() {
  if(isInitialised){
    if(score < 0){
      gameOver();
      }
    for(i = 0; i < object_array.length; i++){
      if(game.physics.arcade.overlap(player, object_array[i][0])) {
        changeScore(i);
        killSprite(i);
      }
    }
    if(score > 12) {
      probA = 1/6;
      probB = 1/2;
      probC = 1/3;
    }
    else {
      probA = 1/3;
      probB = 1/3;
      probC = 1/3;
    }
  }
}

function gameOver() {
  game.destroy();
}

function killSprite(i) {
  object_array[i][0].destroy()
  object_array.splice(i,1);
}

function spawnPosition() {
  side = game.rnd.integerInRange(1, 3)
  if(side == 1) {
    x = game.rnd.integerInRange(-10, 0);
    y = game.rnd.integerInRange(0, 350);
  } else if (side == 2) {
    x = game.rnd.integerInRange(790, 800);
    y = game.rnd.integerInRange(0, 350);
  }
  else {
    x = game.rnd.integerInRange(0, 790);
    y = game.rnd.integerInRange(-10, 0);
  }
}

function spawnObject() {
  spawnPosition();
  var option = game.rnd.integerInRange(1, 120);
  var type;
  if(option <= 120*probA) {
    object = game.add.sprite(x, y, "objectA");
    type = 'a'
  }
  else if(option > 120*probA && option <(120*probB + 120*probA)) {
    object = game.add.sprite(x, y, "objectB");
    type = 'b'
  }
  else {
    object = game.add.sprite(x, y, "objectC");
    type = 'c'
  }

  game.physics.arcade.enable(object);
  object.body.collideWorldBounds=true;
  object.body.gravity.x = game.rnd.integerInRange(-50, 50);
  object.body.gravity.y = 100 + Math.random() * 100;
  object.body.bounce.setTo(1);

  object_array.push([object,type]);

  isInitialised = true;
}

function changeScore(i) {
  if(object_array[i][1]=='a'){
    score = score+5;
  }
  else if (object_array[i][1]=='b'){
    score = score-5;
  }
  else if (object_array[i][1]=='c'){
    score = Math.sqrt(score);
    score = Math.round(score);
  }
  labelScore.setText(score.toString());
//  console.log(objects[i][0]);

}

function moveRight() {
  player.x += 25;
}

function moveLeft() {
  player.x -= 25;
}

function moveDown() {
  player.y += 25;
}

function moveUp() {
  player.y -= 25;
}
