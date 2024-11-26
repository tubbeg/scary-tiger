import * as Phaser from "phaser"
import * as ECS from "miniplex"
import { Effect, Option, Console, pipe } from "effect"
import {createConfig} from "./config"
import {PlayerEntitiesOption, getSingletonComponent, Position, SpriteType, Entity, PlayerEntity, InputEntity, InputHorizontalType, InputVerticalType} from "./types"
import {inputQuery, playerQuery} from "./queries"
import {addKeyboardSystem, createInputEntity, movePlayerEntitySystem} from "./input"
//import Phaser = require("phaser");

type Option<T> = Option.Option<T>

const playerId = "tiger"

function createPlayer ( t : Phaser.Scene, world : ECS.World,x : number,y : number) : ECS.World{
    const _ = world.add({
        texture: playerId,
        sprite: (t.add.sprite(x,y, playerId)),
        player: SpriteType.Player,
      });
    return world;
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
        this.world = createPlayer(this, this.world,400,400);
        this.world = createInputEntity(this.world);
        this.world = addKeyboardSystem(this, this.world);
        //this.add.image(400, 300, 'tiger');
    }

    override update(){
        this.world = Effect.runSync(movePlayerEntitySystem(this.world));
    }
}

function run() {
    const s = createConfig([(new ForegroundScene())]);
    return (new Phaser.Game(s));
}

run();