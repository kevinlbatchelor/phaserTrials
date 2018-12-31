import { jump, death, loadAssets, loadMapsAndSprites, draw, drawText, inventory, updateText } from './utils.js';
import Item from './item.js';

export default class SceneOne extends Phaser.Scene {
    constructor() {
        super('SceneOne');
    }

    preload() {
        loadAssets(this, 'platformer-rouge');
    }

    create() {
        drawText(this, inventory);
        this.isPlayerDead = false;
        loadMapsAndSprites(this, 'platformer-rouge');
        new Item(this, 'door', 'doorGroup', 'isDoor', 'doorLayer');
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.player.update();
        jump(this);

        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        // Add a colliding tile at the mouse position
        if (pointer.isDown && this.player.getInventory().potions > 0) {
            draw(this, worldPoint);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');
            updateText(this);
            potion.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.scene.start('SceneTwo');
        });

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            if (this.player.isEntering) {
                this.scene.start('Shop');
            }
            this.metaText.setText('Alchemist shop. Enter? Y or N');
        });
        death(this);
    }
}
