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

export type InputEntity = {
    down: boolean,
    up: boolean,
    left: boolean,
    right: boolean,
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

export type Entity = {
    sprite?: Phaser.GameObjects.Sprite,
    texture?: string,
    player?: SpriteType.Player,
    brick?: SpriteType.Brick,
    fire?: SpriteType.Fire
    input?: InputEntity
}
