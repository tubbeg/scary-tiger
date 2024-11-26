import * as Phaser from "phaser"
import * as ECS from "miniplex"
import { Effect, Option, Console, pipe } from "effect"
import {PlayerEntitiesOption, getSingletonComponent, Position, SpriteType, Entity, PlayerEntity, InputEntity, InputHorizontalType, InputVerticalType} from "./types"
import {inputQuery, playerQuery} from "./queries"
//import Phaser = require("phaser");


type Option<T> = Option.Option<T>

const moveConst = 5;

function inputToPos (s : Phaser.GameObjects.Sprite, input : InputEntity) : Position{
    let i = input.input;
    //console.log(i);
    let x = 0,y = 0;
    if (i[0] == InputHorizontalType.Left)
        x = s.x - moveConst;
    if (i[0] == InputHorizontalType.Right)
        x = s.x + moveConst;
    if (i[0] == InputHorizontalType.NoInput)
        x = s.x;
    if (i[1] == InputVerticalType.Up)
        y = s.y - moveConst;
    if (i[1] == InputVerticalType.Down)
        y = s.y + moveConst;
    if (i[1] == InputVerticalType.NoInput)
        y = s.y;
    return [x,y];
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
export function movePlayerEntitySystem (world : ECS.World) {
    return Effect.sync(() => {
        Option.map(playerQuery(world), (parr) => {
            Option.map(inputQuery(world), (iarr) => {
                movePlayer(parr, iarr);
            })
        })
        return world;
    })
}

function inputToEnt (i : InputEntity, t : string){
    switch (t)
    {
        case "vert-up":
            return {
                input: [i.input[0],InputVerticalType.Up]
            } 
        case "vert-down":
            return {
                input: [i.input[0],InputVerticalType.Down]
            } 
        case "vert-none":
            return {
                input: [i.input[0],InputVerticalType.NoInput]
            } 
        case "hor-right":
            return {
                input: [InputHorizontalType.Right,i.input[1]]
            } 
        case "hor-left":
            return {
                input: [InputHorizontalType.Left,i.input[1]]
            } 
        case "hor-none":
            return {
                input: [InputHorizontalType.NoInput,i.input[1]]
            } 
        default:
            return {
                input: [i.input[0],i.input[1]]
            } 
    }
}


function addInputSystem (world : ECS.World, t : string){
    Option.map(inputQuery(world), (iarr) => {
        Option.map(getSingletonComponent(iarr), (i) => {
            const updatedInput = inputToEnt(i, t);
            world.remove(i);
            const _ = world.add(updatedInput);
            return world;
        })
    })
}


export function addKeyboardSystem(t : Phaser.Scene, world : ECS.World){
    if (t.input.keyboard != null)
    {
        t.input.keyboard.on('keydown-W', (event : any) => {
            return addInputSystem(world, "vert-up");
        });
        
        t.input.keyboard.on('keyup-W', (event : any) => {
            return addInputSystem(world, "vert-none");
        });
        
        t.input.keyboard.on('keydown-A', (event : any) => {
            
           return addInputSystem(world, "hor-left");
        });

        t.input.keyboard.on('keyup-A', (event : any) => {
            
           return addInputSystem(world, "hor-none");
        });

        t.input.keyboard.on('keydown-S', (event : any) => {
            
            return addInputSystem(world, "vert-down");
         });
 
         t.input.keyboard.on('keyup-S', (event : any) => {
             
            return addInputSystem(world, "vert-none");
         });
 
         t.input.keyboard.on('keydown-D', (event : any) => {
            
            return addInputSystem(world, "hor-right");
         });
 
         t.input.keyboard.on('keyup-D', (event : any) => {
             
            return addInputSystem(world, "hor-none");
         });
 
    }
    return world;
}

export function createInputEntity (world : ECS.World){
    const input : InputEntity = {input: [InputHorizontalType.NoInput, InputVerticalType.NoInput]} as const;
    const _ = world.add(input);
    return world;
}
