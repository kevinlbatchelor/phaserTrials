export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create the player's walking animations from the texture atlas. These are stored in the global
        // animation manager so any sprite can access them.
        const anims = scene.anims;
        anims.create({
            key: 'misa-left-walk',
            frames: anims.generateFrameNames('atlas', { prefix: 'misa-left-walk.', start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'misa-right-walk',
            frames: anims.generateFrameNames('atlas', { prefix: 'misa-right-walk.', start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'misa-front-walk',
            frames: anims.generateFrameNames('atlas', { prefix: 'misa-front-walk.', start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'misa-back-walk',
            frames: anims.generateFrameNames('atlas', { prefix: 'misa-back-walk.', start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Create a sprite with physics enabled via the physics system. The image used for the sprite has
        // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
        this.sprite = scene.physics.add
            .sprite(x, y, 'atlas', 'misa-front')
            .setSize(30, 40)
            .setOffset(0, 24);

        // Track the arrow keys
        this.cursor = scene.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 500;
        const prevVelocity = this.sprite.body.velocity.clone();

        // Stop any previous movement from the last frame
        this.sprite.body.setVelocity(0);

        // Horizontal movement
        if (this.cursor.left.isDown) {
            this.sprite.body.setVelocityX(-speed);
        } else if (this.cursor.right.isDown) {
            this.sprite.body.setVelocityX(speed);
        }

        // Vertical movement
        if (this.cursor.up.isDown) {
            this.sprite.body.setVelocityY(-speed);
        } else if (this.cursor.down.isDown) {
            this.sprite.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that this.sprite can't move faster along a diagonal
        this.sprite.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursor.left.isDown) {
            this.sprite.anims.play('misa-left-walk', true);
        } else if (this.cursor.right.isDown) {
            this.sprite.anims.play('misa-right-walk', true);
        } else if (this.cursor.up.isDown) {
            this.sprite.anims.play('misa-back-walk', true);
        } else if (this.cursor.down.isDown) {
            this.sprite.anims.play('misa-front-walk', true);
        } else {
            this.sprite.anims.stop();
        }
    }
}
