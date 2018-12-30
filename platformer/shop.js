import { jump, death, loadAssets, loadMapsAndSprites, findFunction, draw} from './utils.js';
import Alchemist from './alchemist.js';

export default class Shop extends Phaser.Scene {
    constructor() {
        super('Shop');
    }

    preload() {
        loadAssets(this, 'shop');
    }

    create() {
        this.score = 0;
        this.scoreText = this.add.text(40, 40, '', {
            font: '18px monospace',
            fill: '#ffffff',
            padding: { x: 32, y: 32 }
        }).setScrollFactor(0).setDepth(30);
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

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        if (pointer.isDown && this.player.getInventory().potions > 0) {
            draw(this, worldPoint);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.player.addInventory('potions');

            this.scoreText.setText('Potions:' + this.player.getInventory().potions);
            potion.disableBody(true, true);
        });

        this.alchemist.isSpeaking = false;

        this.scoreText.setText('');
        this.physics.world.overlap(this.player.sprite, this.alchemist.sprite, (player, alchemist) => {
            this.alchemist.isSpeaking = true;
            this.scoreText.setText('I see you are an alchemist, Are you here to buy or sell?');
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.scene.start('SceneTwo');
        });
        death(this);
    }
}
