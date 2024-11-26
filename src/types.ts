import * as Phaser from "phaser"
import * as ECS from "miniplex"
import { Effect, Option } from "effect"

//alias
export type Option<T> = Option.Option<T>

export enum SpriteType {
    Player,
    Brick,
    Fire,
    Ice,
}

export enum InputVerticalType {

    Up,
    Down,
    NoInput
}

export enum InputHorizontalType {

    Left,
    Right,
    NoInput
}


export type Position = [number,number]


export type InputEntity = {
    input: [InputHorizontalType, InputVerticalType]
}

export type PlayerEntity = {
    sprite: Phaser.GameObjects.Sprite,
    texture: string,
    player: SpriteType.Player,
}

export type BrickEntity = {
    sprite: Phaser.GameObjects.Sprite,
    texture: string,
    player: SpriteType.Brick,
}

export type FireEntity = {
    sprite: Phaser.GameObjects.Sprite,
    texture: string,
    player: SpriteType.Fire,
}

export type PlayerEntitiesOption = Option<Array<PlayerEntity>>
export type InputEntitiesOption = Option<Array<InputEntity>>

export type Entity = {
    sprite?: Phaser.GameObjects.Sprite,
    texture?: string,
    player?: SpriteType.Player,
    brick?: SpriteType.Brick,
    fire?: SpriteType.Fire
    input?: [InputHorizontalType, InputVerticalType]
}
