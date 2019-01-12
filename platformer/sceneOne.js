import { jump, death, loadAssets, loadMapsAndSprites, drawText, inventory, updateText, levels, gotoLevel} from './utils.js';
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
        let map = loadMapsAndSprites(this, 'platformer-rouge');
        new Item(this, 'door', 'doorGroup', 'isDoor', 'doorLayer');
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        jump(this);
        this.player.update();

        // const pointer = this.input.activePointer;
        // const worldPoint = pointer.positionToCamera(this.cameras.main);
        // Add a colliding tile at the mouse position

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');
            updateText(this);
            potion.disableBody(true, true);

            this.metaText.setText('Jump and press ctrl to use potion.');
        });

        this.physics.world.overlap(this.player.sprite, this.innerDoorGroup, (player, innerDoor) => {
            if (this.player.isEntering) {
                gotoLevel(this, innerDoor, 'SceneTwo', levels);
            }
            this.metaText.setText('Leave the country? yes(Y) or no(N)');
        });

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            if (this.player.isEntering) {
                gotoLevel(this, door, 'Shop', levels);
            }
            this.metaText.setText('Alchemist shop? yes(Y) or no(N)');
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.player.addInventory('gold', 10);
            updateText(this);
            chest.disableBody(true, true);
        });
        death(this);
    }
}
