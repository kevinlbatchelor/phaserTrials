import Player from './player.js';
import Item from './item.js';

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class PlatformerScene extends Phaser.Scene {
    preload() {
        this.load.spritesheet(
            'player',
            'assets/spritesheets/rouge-sprite2.png',
            {
                frameWidth: 32,
                frameHeight: 32,
                margin: 1,
                spacing: 2
            }
        );
        this.load.image('spike', 'assets/images/spike.png');
        this.load.image('potion', 'assets/images/potion.png');
        this.load.image('tiles', 'assets/tilesets/tile-set-rouge.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/platformer-rouge.json');
    }

    create() {
        this.score = 0;
        this.scoreText = this.add
            .text(16, 16, 'Potions:' + this.score, {
                font: '18px monospace',
                fill: '#ffffff',
                padding: { x: 32, y: 32 }
            })
            .setScrollFactor(0)
            .setDepth(30);

        this.isPlayerDead = false;

        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('tile-set-rouge', 'tiles');

        map.createDynamicLayer('Background', tiles);
        this.groundLayer = map.createDynamicLayer('Ground', tiles);
        this.foregroundLayer = map.createDynamicLayer('Foreground', tiles);
        this.platformLayer = map.createDynamicLayer('Platform', tiles);

        this.foregroundLayer.setDepth(10);

        let findFunction = (obj) => {
            return obj.name === 'Spawn Point';
        };
        // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
        const spawnPoint = map.findObject('Objects', findFunction);
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        // Collide the player against the ground layer - here we are grabbing the sprite property from the player (since the Player class is not a Phaser.Sprite).
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.platformLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        new Item(this, 'spike', 'spikeGroup', 'isSpike');
        new Item(this, 'potion', 'potionGroup', 'isPotion');

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //debug
        // const graphics = this.add
        //     .graphics()
        //     .setAlpha(0.75)
        //     .setDepth(20);
        //
        // this.groundLayer.renderDebug(graphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });

    }

    update(time, delta) {
        if (this.isPlayerDead) return;

        this.player.update();

        if (this.player.isJumping && this.platformCollider) {
            this.platformCollider.destroy();
            this.platformCollider = null;
        } else if (!this.player.isJumping && !this.platformCollider) {
            this.platformCollider = this.physics.world.addCollider(this.player.sprite, this.platformLayer);
        }

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        if (pointer.isDown && this.score > 0) {
            const tile = this.groundLayer.putTileAtWorldXY(344, worldPoint.x, worldPoint.y);
            tile.setCollision(true);

            this.score = this.score - 1;
            this.scoreText.setText('Potion used! Potions:'+ this.score);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.score = this.score + 1;
            this.scoreText.setText('Potions: ' + this.score);
            potion.disableBody(true, true);
        });

        if (this.player.sprite.y > this.groundLayer.height || this.physics.world.overlap(this.player.sprite, this.spikeGroup)) {
            // Flag that the player is dead so that we can stop update from running in the future
            this.isPlayerDead = true;

            const cam = this.cameras.main;
            cam.shake(100, 0.05);
            cam.fade(250, 0, 0, 0);
            cam.once('camerafadeoutcomplete', () => {
                this.player.destroy();
                this.scene.restart();
            });
        }
    }
}
