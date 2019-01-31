import { createAnimation } from './utils.js';

export default class Bat {
    constructor(scene, x, y) {
        this.scene = scene;

        const anims = scene.anims;
        createAnimation(this, {
            key: 'bat-idle',
            frames: anims.generateFrameNumbers('monster', { start: 9, end: 9 }),
            frameRate: 3,
            repeat: -1
        });
        createAnimation(this, {
            key: 'bat-run',
            frames: anims.generateFrameNumbers('monster', { start: 8, end: 12 }),
            frameRate: 9,
            repeat: -1
        });

        this.sprite = scene.physics.add
            .sprite(x, y, 'bat', 0)
            .setDrag(4, 0)
            .setMaxVelocity(200, 500).setSize(32, 10).setOffset(0, 22);
    }

    update() {
        this.turn = (this.scene.player.sprite.x - this.sprite.x > 0);
        this.alt = (this.scene.player.sprite.y - this.sprite.y > 0);
        const sprite = this.sprite;
        sprite.body.setGravityY(-1000);
        let acceleration = 500;
        let accelerationY = 200;
        sprite.anims.play('bat-run', true);
        // Apply horizontal acceleration when left/a or right/d are applied
        if (!this.turn) {
            sprite.setAccelerationX(-acceleration);
            // No need to have a separate set of graphics for running to the left & to the right. Instead we can just mirror the sprite.
            sprite.setFlipX(true);
        } else if (this.turn) {
            sprite.setAccelerationX(acceleration);
            sprite.setFlipX(false);
        } else {
            sprite.setAccelerationX(0);
        }

        if(this.alt){
            sprite.setAccelerationY(accelerationY)
        } else if(!this.alt){
            sprite.setAccelerationY(-accelerationY)
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}