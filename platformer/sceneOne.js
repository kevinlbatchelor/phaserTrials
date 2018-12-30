import { jump, death, loadAssets, loadMapsAndSprites, draw } from './utils.js';
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
        this.scoreText = this.add.text(40, 10, 'Click to use potions', {
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

        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        // Add a colliding tile at the mouse position
        if (pointer.isDown && this.player.getInventory().potions > 0) {
            draw(this, worldPoint);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');

            this.scoreText.setText('Potions:' + _.toString(this.player.getInventory().potions));
            potion.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.scene.start('SceneTwo');
        });

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            if (this.player.isEntering) {
                this.scene.start('Shop');
            }
            this.scoreText.setText('Alchemist shop. Enter? Y or N');
        });

        death(this);
    }
}
