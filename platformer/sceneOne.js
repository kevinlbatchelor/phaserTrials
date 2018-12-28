import { jump, death, loadAssets, loadMapsAndSprites } from './utils.js';
import Item from './item.js';

export default class SceneOne extends Phaser.Scene {
    constructor() {
        super('SceneOne');
    }

    preload() {
        loadAssets(this, 'platformer-rouge');
    }

    create() {
        this.score = 0;
        this.scoreText = this.add.text(40, 10, 'Click to use potions:' + this.score, {
            font: '18px monospace',
            fill: '#ffffff',
            padding: { x: 32, y: 32 }
        }).setScrollFactor(0).setDepth(30);
        this.isPlayerDead = false;
        loadMapsAndSprites(this, 'platformer-rouge');
        new Item(this, 'door', 'doorGroup', 'isDoor', 'doorLayer');
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.physics.world.addCollider(this.spider.sprite, this.groundLayer);
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.player.update();
        this.spider.update();
        jump(this);

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        if (pointer.isDown && this.score > 0) {
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

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            this.scene.start('Shop');
        });

        death(this);
    }
}

const draw = _.throttle((scene, worldPoint) => {
    const tile = scene.platformLayer.putTileAtWorldXY(348, worldPoint.x, worldPoint.y);
    tile.setCollision(true);
    scene.score = scene.score - 1;
    scene.scoreText.setText('Potions:' + scene.score);
}, 500, { leading: true, trailing: false });
