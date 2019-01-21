import { jump, death, loadAssets, loadMapsAndSprites, updateText, levels, drawText, inventory, gotoLevel, findFunction } from './utils.js';
import Item from './item.js';
import Spider from './spider.js';
import Skeleton from './skeleton.js';
import { chestSound, potionSound } from './utils.js';

const sceneName = 'SceneFour';

export default class SceneTwo extends Phaser.Scene {
    constructor() {
        super(sceneName);
    }

    preload() {
        loadAssets(this, 'graveyard');
    }

    create() {
        this.sceneState = levels[sceneName];
        this.sceneState.visited = true;

        drawText(this, inventory);
        this.isPlayerDead = false;
        let map = loadMapsAndSprites(this, 'graveyard');

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
        this.skeletons = [];

        for (let i = 0; i < 4; i++) {
            const enemyPoint = map.findObject('Objects', findFunction('sk' + i));
            this.skeletons.push(new Skeleton(this, enemyPoint.x, enemyPoint.y));
            this.physics.world.addCollider(this.skeletons[i].sprite, this.groundLayer);
        }
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.player.update();
        this.spider2.update();
        this.spider3.update();
        this.spider4.update();

        this.skeletons.forEach((skeleton) => {
            skeleton.update();
        });

        jump(this);

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            _.find(this.sceneState['potionGroup'], { destroyed: false, tag: potion.tag }).destroyed = true;
            this.player.addInventory('potions');
            potionSound(this);
            updateText(this);
            potion.disableBody(true, true);
        });

        this.metaText.setText('');
        this.physics.world.overlap(this.player.sprite, this.innerDoorGroup, (player, chest) => {
            if (this.player.isEntering) {
                this.dream2.stop();
                chestSound(this);
                gotoLevel(this, chest, 'SceneThree', levels);
            }
            this.metaText.setText('Leave the city. Enter? yes(Y) or no(N)');
        });
        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            _.find(this.sceneState['chestGroup'], { destroyed: false, tag: chest.tag }).destroyed = true;
            this.player.addInventory('gold', 10);
            updateText(this);
            chestSound(this);
            chest.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.doorGroup, (player, door) => {
            if (this.player.isEntering) {
                this.dream2.stop();
                this.musicHasStarted = false;
                chestSound(this);
                gotoLevel(this, door, 'Shop', levels);
            }
            this.metaText.setText('Alchemist shop. Enter? yes(Y) or no(N)');
        });
        updateText(this);
        death(this, this.skeletons);
    }
}
