let turn = true;
export default class Alchemist {
    constructor(scene, x, y) {
        this.scene = scene;
        this.isSpeaking = false;

        const anims = scene.anims;
        anims.create({
            key: 'alchemist-idle',
            frames: anims.generateFrameNumbers('npc', { start: 0, end: 0 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: 'alchemist-run',
            frames: anims.generateFrameNumbers('npc', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.sprite = scene.physics.add
            .sprite(x, y, 'alchemist', 0)
            .setDrag(1000, 0)
            .setMaxVelocity(20, 500);
    }

    update() {
        let acceleration;
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        if (onGround && !this.isSpeaking) {
            acceleration = 20;
        } else if (this.isSpeaking) {

            acceleration = 0;
        } else {
            acceleration = 1000;
        }

        // Apply horizontal acceleration when left/a or right/d are applied
        if (!turn) {
            turn = sprite.body.blocked.left;

            sprite.setAccelerationX(-acceleration);
            // No need to have a separate set of graphics for running to the left & to the right. Instead
            // we can just mirror the sprite.
            sprite.setFlipX(true);
        } else if (turn) {
            turn = !sprite.body.blocked.right;
            sprite.setAccelerationX(acceleration);

            sprite.setFlipX(false);

        } else {
            sprite.setAccelerationX(0);
        }

        if (onGround) {
            if (sprite.body.velocity.x !== 0) {
                sprite.anims.play('alchemist-run', true);
            } else sprite.anims.play('alchemist-idle', true);
        } else {
            sprite.anims.stop();
            sprite.setTexture('npc', 10);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}