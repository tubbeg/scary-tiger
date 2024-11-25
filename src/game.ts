import * as Phaser from "phaser"
import * as ECS from "miniplex"
//import Phaser = require("phaser");


enum SpriteType {
    Player,
    Brick,
    Fire,
    Ice,
}

const playerId = "tiger"


type Entity = {
    sprite?: Phaser.GameObjects.Sprite,
    texture? : String,
    st?: SpriteType
}

function createPlayerSprite (t : Phaser.Scene) : Phaser.GameObjects.Sprite {
    return t.add.sprite(400,400,playerId);
}


function createPlayer ( t : Phaser.Scene, world : ECS.World) : ECS.World{
    return world.add({
        texture: playerId,
        sprite: createPlayerSprite(t),
        st: SpriteType.Player
      })      
}

function create_queries (world : ECS.World) {
    return {
        moving: world.with("position", "velocity"),
        health: world.with("health")
    }
  }


class ForegroundScene extends Phaser.Scene
{
    world : ECS.World;
    
    constructor(){
        super();
        this.world = new ECS.World<Entity>();
    }

    preload ()
    {
        this.load.image('tiger', 'MySprite.png');
        this.load.image('brick', 'MySprite.png');
    }


    create ()
    {
        this.world = createPlayer(this, this.world);
        //this.add.image(400, 300, 'tiger');

    }

    override update(){

    }


}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: ForegroundScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200, x: 0 }
        }
    }
};



function run() {

    return (new Phaser.Game(config));
}

run();