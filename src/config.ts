import * as Phaser from "phaser"

export const createConfig = (s : Array<Phaser.Scene>) => 
{
    const c = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: s,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200, x: 0 }
            }
        }
    } as const;
    return c;
}
