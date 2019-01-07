import { jump, death, loadAssets, loadMapsAndSprites, findFunction, addDrawLogic, drawText, inventory, updateText, levels, gotoLevel } from './utils.js';
import Alchemist from './alchemist.js';

const sceneName = 'Shop';
export default class Shop extends Phaser.Scene {
    constructor() {
        super(sceneName);
    }

    preload() {
        loadAssets(this, 'shop');
    }

    create() {
        this.sceneState = levels[sceneName];
        this.sceneState.visited = true;
        this.script = 0;
        drawText(this, inventory);
        this.isPlayerDead = false;
        let map = loadMapsAndSprites(this, 'shop');

        const spawnPoint = map.findObject('Objects', findFunction('Alchemist Spawn'));
        this.alchemist = new Alchemist(this, spawnPoint.x, spawnPoint.y);
        this.physics.world.addCollider(this.alchemist.sprite, this.groundLayer);
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.physics.world.addCollider(this.spider.sprite, this.groundLayer);
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.spider.update();
        this.player.update();
        this.alchemist.update();
        jump(this);

        addDrawLogic(this);

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');

            potion.disableBody(true, true);
        });

        this.alchemist.isSpeaking = false;

        this.metaText.setText('');
        this.physics.world.overlap(this.player.sprite, this.alchemist.sprite, (player, alchemist) => {
            this.alchemist.isSpeaking = true;

            this.metaText.setText(this.alchemist.scripts[this.script]);
        });

        if (!this.alchemist.isSpeaking) {
            this.script = 0;
        }

        if (this.alchemist.keys.b.isDown) {
            if (inventory.gold < 21) {
                this.script = 1;
            }
        }

        if (this.alchemist.keys.b.isDown) {
            if (inventory.gold > 20) {
                this.script = 2;
            }
        }

        if (this.alchemist.keys.p.isDown && inventory.gold > 19) {
            inventory.potions = inventory.potions + 1;
            inventory.gold = inventory.gold - 20;
            this.script = 5;
        }

        if (this.alchemist.keys.x.isDown && inventory.potions > 0) {
            inventory.potions = inventory.potions - 1;
            inventory.gold = inventory.gold + 10;
            this.script = 5;
        }

        if (this.alchemist.keys.s.isDown) {
            if (inventory.potions > 0) {
                this.script = 3;
            }
        }
        if (this.alchemist.keys.s.isDown) {
            if (inventory.potions < 1) {
                this.script = 4;
            }
        }

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.player.addInventory('gold', 10);
            updateText(this);
            chest.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.innerDoorGroup, (player, innerDoor) => {
            if (this.player.isEntering) {
                gotoLevel(this, innerDoor, levels[sceneName].fromScene, levels);
            }
            this.metaText.setText('Leave the Alchemist shop. Enter? yes(Y) or no(N)');
        });

        death(this);
        updateText(this);
    }
}
