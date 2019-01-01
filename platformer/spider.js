import {createAnimation} from './utils.js'

export default class Spider {
    constructor(scene, x, y) {
        this.scene = scene;

        const anims = scene.anims;
        createAnimation(this, {
            key: 'spider-idle',
            frames: anims.generateFrameNumbers('npc', { start: 8, end: 8 }),
            frameRate: 3,
            repeat: -1
        });
        createAnimation(this,{
            key: 'spider-run',
            frames: anims.generateFrameNumbers('npc', { start: 8, end: 10 }),
            frameRate: 6,
            repeat: -1
        });

        this.sprite = scene.physics.add
            .sprite(x, y, 'spider', 0)
            .setDrag(1000, 0)
            .setMaxVelocity(50, 1000).setSize(32, 10).setOffset(0, 22);


        this.turn = true;
        const randomBoolean = Math.random() >= 0.5;
        if (!randomBoolean) {
            this.turn = false
        }
    }

    update() {
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        let acceleration = onGround ? 50 : 200;

        // Apply horizontal acceleration when left/a or right/d are applied
        if (!this.turn) {
            this.turn = sprite.body.blocked.left;

            sprite.setAccelerationX(-acceleration);
            // No need to have a separate set of graphics for running to the left & to the right. Instead
            // we can just mirror the sprite.
            sprite.setFlipX(true);
        } else if (this.turn) {
            this.turn = !sprite.body.blocked.right;
            sprite.setAccelerationX(acceleration);

            sprite.setFlipX(false);

        } else {
            sprite.setAccelerationX(0);
        }

        if (onGround) {
            if (sprite.body.velocity.x !== 0) {
                sprite.anims.play('spider-run', true);
            } else sprite.anims.play('spider-idle', true);
        } else {
            sprite.anims.stop();
            sprite.setTexture('npc', 10);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}