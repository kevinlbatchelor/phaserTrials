import { jump, death, loadAssets, loadMapsAndSprites, draw, updateText } from './utils.js';
import { drawText, inventory } from './utils.js';
import Item from './item.js';

export default class SceneTwo extends Phaser.Scene {
    constructor() {
        super('SceneTwo');
    }

    preload() {
        loadAssets(this, 'rouge2');
    }

    create() {
        drawText(this, inventory);
        this.isPlayerDead = false;
        loadMapsAndSprites(this, 'rouge2');

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

        if (pointer.isDown && this.player.getInventory().potions > 0) {
            draw(this, worldPoint);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');

            updateText(this);
            potion.disableBody(true, true);
        });

        this.metaText.setText('');
        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.scene.start('SceneOne');
        }, (a) => {
          console.log(a);
        });

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            console.log('door');
            if (this.player.isEntering) {
                this.scene.start('Shop');
            }
            this.metaText.setText('Alchemist shop. Enter? yes(Y) or no(N)');
        });
        death(this);
    }
}
