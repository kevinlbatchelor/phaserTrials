import { jump, death, loadAssets, loadMapsAndSprites } from './utils.js';

export default class Shop extends Phaser.Scene {
    constructor() {
        super('Shop');
    }

    preload() {
        loadAssets(this, 'shop');
    }

    create() {
        this.score = 0;
        this.scoreText = this.add.text(40, 40, 'I see you are an alchemist, Are you here to buy or sell? ', {
            font: '18px monospace',
            fill: '#ffffff',
            padding: { x: 32, y: 32 }
        }).setScrollFactor(0).setDepth(30);
        this.isPlayerDead = false;
        loadMapsAndSprites(this, 'shop');
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.physics.world.addCollider(this.spider.sprite, this.groundLayer);
    }

    update(time, delta) {
        if (this.isPlayerDead) return;
        this.spider.update();
        this.player.update();
        jump(this);

        // Add a colliding tile at the mouse position
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);

        if (pointer.isDown && this.score > 0) {
            draw(this, worldPoint);
        }

        this.physics.world.overlap(this.player.sprite, this.potionGroup, (player, potion) => {
            this.score = this.score + 1;
            this.scoreText.setText('Potions:' + this.score);
            potion.disableBody(true, true);
        });

        this.physics.world.overlap(this.player.sprite, this.chestGroup, (player, chest) => {
            this.scene.start('SceneTwo');
        });
        death(this);
    }
}

const draw = _.throttle((scene, worldPoint) => {
    const tile = scene.groundLayer.putTileAtWorldXY(348, worldPoint.x, worldPoint.y);
    tile.setCollision(true);
    scene.score = scene.score - 1;
    scene.scoreText.setText('Potions:' + scene.score);
}, 500, { leading: true, trailing: false });
