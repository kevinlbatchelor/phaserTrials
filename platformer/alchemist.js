let turn = true;
export default class Alchemist {
    constructor(scene, x, y) {
        this.scene = scene;
        this.isSpeaking = false;
        this.scripts = [
            'I see you are an alchemist, Are you here to buy(B) or sell(S)?',
            'You haven\'t enough gold.',
            'Buy potion. (P) -20g',
            'Sell potion. (X) +10g',
            'You haven\'t got any thing that I need.',
            'Thank\'s for doing business'
        ];

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

        const { B, S, X, P } = Phaser.Input.Keyboard.KeyCodes;

        this.keys = scene.input.keyboard.addKeys({
            b: B,
            s: S,
            x: X,
            p: P
        });
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