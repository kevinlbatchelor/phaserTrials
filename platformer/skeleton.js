import { createAnimation } from './utils.js';

export default class Skeleton {
    constructor(scene, x, y) {
        this.scene = scene;

        const anims = scene.anims;
        createAnimation(this, {
            key: 'skeleton-idle',
            frames: anims.generateFrameNumbers('monster', { start: 0, end: 0 }),
            frameRate: 3,
            repeat: -1
        });
        createAnimation(this, {
            key: 'skeleton-run',
            frames: anims.generateFrameNumbers('monster', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.sprite = scene.physics.add
            .sprite(x, y, 'skeleton', 0)
            .setDrag(7000, 0)
            .setMaxVelocity(50, 5000).setSize(32, 10).setOffset(0, 22);


        this.turn = true;
        const randomBoolean = Math.random() >= 0.5;
        if (!randomBoolean) {
            this.turn = false;
        }
    }

    update() {
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        let acceleration = onGround ? 40 : 200;

        if (Math.abs(this.scene.player.sprite.x - this.sprite.x) < 100) {

            this.turn = (this.scene.player.sprite.x - this.sprite.x > 0);
            if (!this.turn) {
                sprite.setAccelerationX(-acceleration);
                sprite.setFlipX(true);
            } else if (this.turn) {
                sprite.setAccelerationX(acceleration);
                sprite.setFlipX(false);
            } else {
                sprite.setAccelerationX(0);
            }
        } else {
            if (!this.turn) {
                this.turn = sprite.body.blocked.left;
                sprite.setAccelerationX(-acceleration);
                sprite.setFlipX(true);
            } else if (this.turn) {
                this.turn = !sprite.body.blocked.right;
                sprite.setAccelerationX(acceleration);

                sprite.setFlipX(false);

            } else {
                sprite.setAccelerationX(0);
            }
        }

        if (onGround) {
            sprite.anims.play('skeleton-run', true);

        } else {
            sprite.anims.stop();
            sprite.setTexture('monster', 0);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}