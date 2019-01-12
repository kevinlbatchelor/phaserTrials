import { jump, death, loadAssets, loadMapsAndSprites, addDrawLogic, updateText, levels, drawText, inventory, gotoLevel, findFunction } from './utils.js';
import Item from './item.js';
import Spider from './spider.js';

const sceneName = 'SceneThree';

export default class SceneTwo extends Phaser.Scene {
    constructor() {
        super(sceneName);
    }

    preload() {
        loadAssets(this, 'rouge3');
    }

    create() {
        this.sceneState = levels[sceneName];
        this.sceneState.visited = true;

        drawText(this, inventory);
        this.isPlayerDead = false;
        let map = loadMapsAndSprites(this, 'rouge3');

        new Item(this, 'door', 'doorGroup', 'isDoor', 'doorLayer');
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        const enemyPoint = map.findObject('Objects', findFunction('Enemy Spawn'));

        if (enemyPoint) {
            this.spider2 = new Spider(this, enemyPoint.x + _.random(-200, 200), enemyPoint.y);
            this.spider3 = new Spider(this, enemyPoint.x + _.random(-200, 200), enemyPoint.y);
            this.spider4 = new Spider(this, enemyPoint.x + _.random(-200, 200), enemyPoint.y);

            this.physics.world.addCollider(this.spider2.sprite, this.groundLayer);
            this.physics.world.addCollider(this.spider3.sprite, this.groundLayer);
            this.physics.world.addCollider(this.spider4.sprite, this.groundLayer);
        }
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.player.update();
        this.spider.update();
        this.spider2.update();
        this.spider3.update();
        this.spider4.update();
        jump(this);

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);
        addDrawLogic(this);

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');

            updateText(this);
            potion.disableBody(true, true);
        });

        this.metaText.setText('');
        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            if (this.player.isEntering) {
                gotoLevel(this, chest, 'SceneOne', levels);
            }
            this.metaText.setText('Leave the country. Enter? yes(Y) or no(N)');
        });

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            if (this.player.isEntering) {
                gotoLevel(this, door, 'Shop', levels);
            }
            this.metaText.setText('Alchemist shop. Enter? yes(Y) or no(N)');
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.player.addInventory('gold', 10);
            updateText(this);
            chest.disableBody(true, true);
        });
        death(this);
    }
}
