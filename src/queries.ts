import * as ECS from "miniplex"
import { Effect, Option } from "effect"
import {PlayerEntitiesOption, InputEntitiesOption, SpriteType, Entity} from "./types"
//import Phaser = require("phaser");

function queryIsNotEmpty (q : ECS.Query<any>)
{
    return (q.entities.length > 0);
}

export function playerQuery (world : ECS.World) : PlayerEntitiesOption {
    const c =  world.with("sprite","texture","player");
    if (queryIsNotEmpty(c))
        return Option.some(c.entities);
    return Option.none();
}

export function inputQuery (world : ECS.World) : InputEntitiesOption {
    const c =  world.with("input");
    if (queryIsNotEmpty(c))
        return Option.some(c.entities);
    return Option.none();
}