import { jump, death, loadAssets, loadMapsAndSprites } from './utils.js';

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class PlatformerScene extends Phaser.Scene {
    preload() {
        loadAssets(this, 'platformer-rouge2.json');
    }

    create() {
        this.score = 0;
        this.scoreText = this.add.text(40, 10, 'Click to use potions:' + this.score, {
            font: '18px monospace',
            fill: '#ffffff',
            padding: { x: 32, y: 32 }
        }).setScrollFactor(0).setDepth(30);
        this.isPlayerDead = false;
        loadMapsAndSprites(this);
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.player.update();
        jump(this);

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        if (pointer.isDown && this.score > 0) {
            console.log(_.get(pointer, 'isDown'));
            draw(this, worldPoint);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.score = this.score + 1;
            this.scoreText.setText('Potions:' + this.score);
            potion.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.scene.start('SceneTwo');
        });

        death(this);
    }
}

const draw = _.throttle((scene, worldPoint) => {
    const tile = scene.groundLayer.putTileAtWorldXY(348, worldPoint.x, worldPoint.y);
    tile.setCollision(true);
    scene.score = scene.score - 1;
    scene.scoreText.setText('Potions:' + scene.score);
}, 500, { leading: true, trailing: false });
