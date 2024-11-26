import * as Phaser from "phaser"
import * as ECS from "miniplex"
import { Effect, Option, Console, pipe } from "effect"
import {createConfig} from "./config"
import {PlayerEntitiesOption, Position, SpriteType, Entity, PlayerEntity, InputEntity, InputHorizontalType, InputVerticalType} from "./types"
import {inputQuery, playerQuery} from "./queries"
import { update } from "effect/Differ"
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



function inputToPos (s : Phaser.GameObjects.Sprite, input : InputEntity) : Position{
    let i = input.input;
    //console.log(i);

    switch(i[0], i[1])
    {
        case (InputHorizontalType.NoInput,InputVerticalType.NoInput):
            return [(s.x ), (s.y )];
        case (InputHorizontalType.Left,InputVerticalType.Up):
            console.log("Trigger left up");
            console.log(i[0]);
            console.log(InputHorizontalType.Left);
            return [(s.x - 1), (s.y + 1)];
        case (InputHorizontalType.Left,InputVerticalType.Down):
            return [(s.x - 1), (s.y - 1)];
        case (InputHorizontalType.Right,InputVerticalType.Up):
            console.log("Trigger right up");
            return [(s.x + 1), (s.y + 1)];
        case (InputHorizontalType.Right,InputVerticalType.Down):
            return [(s.x + 1), (s.y - 1)];
        case (InputHorizontalType.Right,InputVerticalType.NoInput):
            return [(s.x + 1), (s.y )];
        case (InputHorizontalType.Left,InputVerticalType.NoInput):
            return [(s.x - 1), (s.y )];
        case (InputHorizontalType.NoInput,InputVerticalType.Up):
            console.log("Trigger up");
            return [(s.x ), (s.y + 1)];
        case (InputHorizontalType.NoInput,InputVerticalType.Down):
            return [(s.x ), (s.y - 1)];
        default:
            return [s.x,s.y];
    }
}


function updatePlayerPosition (player : Option<PlayerEntity>, input : Option<InputEntity>){
    //console.log("Updating position");
    return Option.map(player, (p) => {
        Option.map(input, (i) => {
            let pos : Position = inputToPos(p.sprite, i);
            p.sprite.x = pos[0];
            p.sprite.y = pos[1];
        })
    })
}


function getSingletonComponent<Type> (a : Array<Type>) : Option<Type>{
    if (a.length < 1)
        return Option.none();
    const result = a.at(0);
    if (result != null)
        return Option.some(result);
    return Option.none();
}


//SIDE EFFECT!
function movePlayer (players : Array<PlayerEntity>, i : Array<InputEntity>){

    //console.log("Updating position");
    const player = getSingletonComponent(players);
    const input = getSingletonComponent(i);

    return updatePlayerPosition(player,input);

    //const f = (player : PlayerEntity,index : number) => {return updatePlayerPosition(player,index, i);}
    //Effect.forEach(players, f, {discard: true})
}

//SIDE EFFECT!
function movePlayerEntitySystem (world : ECS.World) {
    return Effect.sync(() => {
        Option.map(playerQuery(world), (parr) => {
            Option.map(inputQuery(world), (iarr) => {
                movePlayer(parr, iarr);
            })
        })
        return world;
    })
}


function addKeyboardSystem(t : Phaser.Scene, world : ECS.World){
    if (t.input.keyboard != null)
    {
        t.input.keyboard.on('keydown-W', (event : any) => {
            console.log("Pressing W!");
            Option.map(inputQuery(world), (iarr) => {
                Option.map(getSingletonComponent(iarr), (i) => {
                    const updatedInput : InputEntity = {
                        input: [i.input[0],InputVerticalType.Up]
                    } as const;
                    world.remove(i);
                    console.log("Updating with key down input!", updatedInput)
                    const _ = world.add(updatedInput);
                    return world;
                })
            })
        });
        
        t.input.keyboard.on('keyup-W', (event : any) => {
            console.log("Pressing W!");
            Option.map(inputQuery(world), (iarr) => {
                Option.map(getSingletonComponent(iarr), (i) => {
                    const updatedInput : InputEntity = {
                        input: [i.input[0],InputVerticalType.NoInput]
                    } as const;
                    world.remove(i);
                    //console.log("Updating with input!", updatedInput)
                    const _ = world.add(updatedInput);
                    return world;
                })
            })
        });
        


        t.input.keyboard.on('keydown-A', (event : any) => {
            
           console.log("Pressing A!") 
        });


        t.input.keyboard.on('keydown-S', (event : any) => {
            
           console.log("Pressing S!") 
        });


        t.input.keyboard.on('keydown-D', (event : any) => {
            
           console.log("Pressing D!") 
        });
    }
    return world;
}

function createInputEntity (world : ECS.World){
    const input : InputEntity = {input: [InputHorizontalType.NoInput, InputVerticalType.NoInput]} as const;
    const _ = world.add(input);
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