import { jump, death, loadAssets, loadMapsAndSprites, draw, drawText, inventory, updateText, levels, gotoLevel } from './utils.js';
import Item from './item.js';

const sceneName = 'SceneOne';
export default class SceneOne extends Phaser.Scene {
    constructor() {
        super(sceneName);
    }

    preload() {
        loadAssets(this, 'platformer-rouge');
    }

    create() {
        this.sceneState = levels[sceneName];
        this.sceneState.visited = true;
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
            gotoLevel(this, chest, 'SceneTwo', levels);
        });

        this.metaText.setText('');
        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            if (this.player.isEntering) {
                gotoLevel(this, door, 'Shop', levels);
            }

            this.metaText.setText('Alchemist shop. Enter? yes(Y) or no(N)');
        });
        death(this);
    }
}
