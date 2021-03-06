import { jump, death, loadAssets, loadMapsAndSprites, updateText, levels, drawText, inventory, gotoLevel, chestSound, potionSound } from './utils.js';
import Item from './item.js';
import Spider from './spider.js';
import { findFunction } from './utils.js';

const sceneName = 'SceneTwo';

export default class SceneTwo extends Phaser.Scene {
    constructor() {
        super(sceneName);
    }

    preload() {
        loadAssets(this, 'rouge2');
    }

    create() {
        this.sceneState = levels[sceneName];
        this.sceneState.visited = true;

        drawText(this, inventory);
        this.isPlayerDead = false;
        let map = loadMapsAndSprites(this, 'rouge2');

        new Item(this, 'door', 'doorGroup', 'isDoor', 'doorLayer');
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.spiders = [];

        for (let i = 0; i < 11; i++) {
            const enemyPoint = map.findObject('Objects', findFunction('Enemy' + i));
            this.spiders.push(new Spider(this, enemyPoint.x, enemyPoint.y));
            this.physics.world.addCollider(this.spiders[i].sprite, this.groundLayer);
        }
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.spiders.forEach((spider) => {
            spider.update();
        });
        this.player.update();
        jump(this);

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');

            potionSound(this);
            updateText(this);
            potion.disableBody(true, true);
        });

        this.metaText.setText('');
        this.physics.world.overlap(this.player.sprite, this.innerDoorGroup, (player, chest) => {
            if (this.player.isEntering) {
                this.shop.stop();
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
                this.shop.stop();
                this.musicHasStarted = false;
                chestSound(this);
                gotoLevel(this, door, 'Shop', levels);
            }
            this.metaText.setText('Alchemist shop. Enter? yes(Y) or no(N)');
        });
        updateText(this);
        death(this, this.spiders);
    }
}
