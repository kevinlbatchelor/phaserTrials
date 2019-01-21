import { inventory } from './utils.js';
import { createAnimation, draw, walkingSound, jumpingSound, playMusic } from './utils.js';

export default class Player {
    constructor(scene, x, y, inventory = {}) {
        this.scene = scene;

        // Create the animations we need from the player spritesheet
        const anims = scene.anims;
        createAnimation(this, {
            key: 'player-idle',
            frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        createAnimation(this, {
            key: 'player-run',
            frames: anims.generateFrameNumbers('player', { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        createAnimation(this, {
            key: 'jump-up',
            frames: anims.generateFrameNumbers('player', { start: 16, end: 16 }),
            frameRate: 12,
            repeat: -1
        });
        createAnimation(this, {
            key: 'jump-down',
            frames: anims.generateFrameNumbers('player', { start: 17, end: 17 }),
            frameRate: 12,
            repeat: -1
        });

        // Create the physics-based sprite that we will move around and animate
        this.sprite = scene.physics.add
            .sprite(x, y, 'player', 0)
            .setDrag(1000, 0)
            .setMaxVelocity(300, 400).setSize(16, 32).setOffset(8, 0);

        // Track the arrow keys
        const { LEFT, RIGHT, UP, SPACE, Y, CTRL } = Phaser.Input.Keyboard.KeyCodes;

        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            space: SPACE,
            y: Y,
            ctrl: CTRL
        });
    }

    addInventory(key, amount = 1) {
        inventory[key] = inventory[key] + amount;
        return inventory;
    }

    deleteInventory(key) {
        inventory[key] = inventory[key] - 1;
        return inventory;
    }

    getInventory() {
        return inventory;
    }

    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        const acceleration = onGround ? 600 : 200;

        this.isJumping = keys.up.isDown && onGround;
        this.isEntering = keys.y.isDown;

        let playerVelocity = this.sprite.body.velocity;

        if ((keys.space.isDown && this.getInventory().potions > 0 && this.getInventory().earthSpell) || (keys.ctrl.isDown && this.getInventory().potions > 0)) {
            let pt = {
                x: this.sprite.body.x + (playerVelocity.x / 3),
                y: this.sprite.body.y + (62)
            };
            draw(this.scene, pt, this.sprite.body.velocity.x);
        }

        // Apply horizontal acceleration when left/a or right/d are applied
        if (keys.left.isDown) {
            sprite.setAccelerationX(-acceleration);
            // No need to have a separate set of graphics for running to the left & to the right. Instead
            // we can just mirror the sprite.
            sprite.setFlipX(true);
        } else if (keys.right.isDown) {
            playMusic(this.scene);
            sprite.setAccelerationX(acceleration);
            sprite.setFlipX(false);
        } else {
            sprite.setAccelerationX(0);
        }

        actualJump(sprite, keys, onGround);

        // Update the animation/texture based on the state of the player
        if (onGround) {
            sprite.setDrag(1000, 0);
            if (sprite.body.velocity.x !== 0) {
                walkingSound(this.scene);
                sprite.anims.play('player-run', true);
            } else sprite.anims.play('player-idle', true);
        } else if (this.isJumping || sprite.body.velocity.y < 0) {
            sprite.setDrag(200, 0);
            jumpingSound(this.scene);
            sprite.anims.play('jump-up', true);
        } else if (sprite.body.velocity.y > 0) {
            sprite.setDrag(200, 0);
            sprite.anims.play('jump-down', true);
        } else {
            sprite.anims.stop();
            sprite.setTexture('player', 10);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}

const actualJump = _.throttle((sprite, keys, onGround) => {
    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown)) {
        sprite.anims.play('jump', true);
        sprite.setVelocityY(-500);
    }
}, 0, { leading: true, trailing: false });