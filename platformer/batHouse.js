import { jump, death, loadAssets, loadMapsAndSprites, findFunction, drawText, inventory, updateText, levels, gotoLevel } from './utils.js';
import Alchemist from './alchemist.js';
import Spider from './spider.js';
import Bat from './bat.js';

const sceneName = 'BatHouse';
export default class BatHouse extends Phaser.Scene {
    constructor() {
        super(sceneName);
    }

    preload() {
        loadAssets(this, 'bat-house');
    }

    create() {
        this.sceneState = levels[sceneName];
        this.sceneState.visited = true;
        this.script = 0;
        drawText(this, inventory);
        this.isPlayerDead = false;
        let map = loadMapsAndSprites(this, 'bat-house');

        const spawnPoint = map.findObject('Objects', findFunction('Alchemist Spawn'));
        this.alchemist = new Alchemist(this, spawnPoint.x, spawnPoint.y);
        this.physics.world.addCollider(this.alchemist.sprite, this.groundLayer);
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.bats = [];

        for (let i = 0; i < 1; i++) {
            const enemyPoint = map.findObject('Objects', findFunction('bat' + i));
            this.bats.push(new Bat(this, enemyPoint.x, enemyPoint.y));
            this.physics.world.addCollider(this.bats[i].sprite, this.groundLayer);
        }

        this.spiders = [];
        for (let i = 0; i < 5; i++) {
            const enemyPoint = map.findObject('Objects', findFunction('sp' + i));
            this.spiders.push(new Spider(this, enemyPoint.x, enemyPoint.y));
            this.physics.world.addCollider(this.spiders[i].sprite, this.groundLayer);
        }
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.player.update();
        this.alchemist.update();
        jump(this);

        this.bats.forEach((bat) => {
            bat.update();
        });

        this.spiders.forEach((spider) => {
            spider.update();
        });

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

        if (this.alchemist.keys.b.isDown && inventory.gold < 20) {
            this.script = 1;
        }

        if (this.alchemist.keys.b.isDown && inventory.gold > 19) {
            this.script = 2;
        }

        if (this.alchemist.keys.e.isDown && inventory.gold > 99) {
            inventory.earthSpell = true;
            inventory.gold = inventory.gold - 100;
            this.script = 5;
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
            _.find(this.sceneState['chestGroup'], { destroyed: false, tag: chest.tag }).destroyed = true;
            this.player.addInventory('gold', 10);
            updateText(this);
            chest.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.innerDoorGroup, (player, innerDoor) => {
            if (this.player.isEntering) {
                this.shop.stop();
                gotoLevel(this, innerDoor, levels[sceneName].fromScene, levels);
            }
            this.metaText.setText('Leave the Alchemist shop. Enter? yes(Y) or no(N)');
        });

        death(this, [...this.bats, ...this.spiders]);
        updateText(this);
    }
}
