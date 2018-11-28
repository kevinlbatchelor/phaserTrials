import Player from './player.js';

export default class sceneTwo extends Phaser.Scene {
    constructor() {
        super('SceneTwo');
    }

    preload() {
        this.load.image('tiles', 'town.png');
        this.load.tilemapTiledJSON('map2', 'assets/town-two.json');
        this.load.atlas('atlas', 'atlas.png', 'assets/atlas.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'map2' });
        const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');
        const belowLayer = map.createStaticLayer('Below Player', tileset, 0, 0);
        const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
        const aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });
        aboveLayer.setDepth(10);

        const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        // Watch the player and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.player.sprite, worldLayer);

        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {
        this.player.update();
    }
}