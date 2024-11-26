import * as Phaser from "phaser"
import * as ECS from "miniplex"
import { Effect, Option, Console } from "effect"
import {createConfig} from "./config"
import {PlayerEntitiesOption, SpriteType, Entity, PlayerEntity} from "./types"
import {playerQuery} from "./queries"
//import Phaser = require("phaser");

const playerId = "tiger"

function createPlayer ( t : Phaser.Scene, world : ECS.World,x : number,y : number) : ECS.World{
    const _ = world.add({
        texture: playerId,
        sprite: (t.add.sprite(x,y, playerId)),
        player: SpriteType.Player,
      });
    return world;
}

function updatePlayerPosition (player : PlayerEntity, index : number){
    return Effect.sync(() => {
        
    })
}

//SIDE EFFECT!
function movePlayers (players : Array<PlayerEntity>){
    Effect.forEach(players, updatePlayerPosition, {discard: true})
}

//SIDE EFFECT!
function movePlayerEntitySystem (world : ECS.World) {
    return Effect.sync(() => {
        Option.map(playerQuery(world), (arr) => {
            movePlayers(arr);
        })
    })
}

function addKeyboardCallback(t : Phaser.Scene, world : ECS.World){
    if (t.input.keyboard != null)
    {
        t.input.keyboard.on('keydown-A', (event : any) => {
            
        });
    }
    return world;
}


class ForegroundScene extends Phaser.Scene
{
    world : ECS.World;
    playerQuery : PlayerEntitiesOption;
    constructor(){
        super();
        this.world = new ECS.World<Entity>();
        this.playerQuery = playerQuery(this.world);
    }

    preload ()
    {
        this.load.image('tiger', 'MySprite.png');
        this.load.image('brick', 'MySprite.png');
    }

    create ()
    {
        this.world = createPlayer(this, this.world,400,400);
        this.world = addKeyboardCallback(this, this.world);
        //this.add.image(400, 300, 'tiger');
    }

    override update(){

    }


}


function run() {
    const s = createConfig([(new ForegroundScene())]);
    return (new Phaser.Game(s));
}

run();