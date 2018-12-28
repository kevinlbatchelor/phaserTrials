import Player from './player.js';
import Spider from './spider.js';
import Item from './item.js';

export function death(scene) {
    if (scene.player.sprite.y > scene.groundLayer.height || scene.physics.world.overlap(scene.player.sprite, scene.spikeGroup)) {
        // Flag that the player is dead so that we can stop update from running in the future
        scene.isPlayerDead = true;

        const cam = scene.cameras.main;
        cam.shake(100, 0.05);
        cam.fade(250, 0, 0, 0);
        cam.once('camerafadeoutcomplete', () => {
            scene.player.destroy();
            scene.scene.restart();
        });
    }
}

export function jump(scene) {
    if (scene.player.isJumping && scene.platformCollider) {
        scene.platformCollider.destroy();
        scene.platformCollider = null;
    } else if (!scene.player.isJumping && !scene.platformCollider) {
        scene.platformCollider = scene.physics.world.addCollider(scene.player.sprite, scene.platformLayer);
    }
}

export function loadAssets(scene, path) {
    scene.load.spritesheet(
        'player',
        'assets/spritesheets/rouge-sprite2.png',
        {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2
        }
    );
    scene.load.spritesheet(
        'spider',
        'assets/spritesheets/alchemist.png',
        {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2
        }
    );
    scene.load.image('door', 'assets/images/door.png');
    scene.load.image('spike', 'assets/images/spike.png');
    scene.load.image('potion', 'assets/images/potion.png');
    scene.load.image('chest', 'assets/images/chest.png');
    scene.load.image('tiles', 'assets/tilesets/tile-set-rouge.png');
    scene.load.tilemapTiledJSON(path, 'assets/tilemaps/' + path + '.json');
}

export function loadMapsAndSprites(scene, path) {
    const map = scene.make.tilemap({ key: path });
    const tiles = map.addTilesetImage('tile-set-rouge', 'tiles');
    map.createDynamicLayer('Background', tiles);
    scene.doorLayer = map.createDynamicLayer('Doors', tiles);
    scene.groundLayer = map.createDynamicLayer('Ground', tiles);
    scene.platformLayer = map.createDynamicLayer('PlatformLayer', tiles);
    scene.foregroundLayer = map.createDynamicLayer('Foreground', tiles);
    scene.foregroundLayer.setDepth(10);
    let findFunction = (obj) => {
        return obj.name === 'Spawn Point';
    };
    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = map.findObject('Objects', findFunction);
    scene.player = new Player(scene, spawnPoint.x, spawnPoint.y);
    scene.spider = new Spider(scene, spawnPoint.x+20, spawnPoint.y+20);

    scene.doorLayer.setCollisionByProperty({ collides: true });
    scene.physics.world.addCollider(scene.player.sprite, scene.doorLayer);
    scene.physics.world.addCollider(scene.spider.sprite, scene.doorLayer);

    // Collide the player against the ground layer - here we are grabbing the sprite property from the player (since the Player class is not a Phaser.Sprite).
    scene.groundLayer.setCollisionByProperty({ collides: true });

    new Item(scene, 'spike', 'spikeGroup', 'isSpike');
    new Item(scene, 'potion', 'potionGroup', 'isPotion');
    new Item(scene, 'chest', 'chestGroup', 'isChest');

    scene.cameras.main.startFollow(scene.player.sprite);
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // debug
    // const graphics = scene.add
    //     .graphics()
    //     .setAlpha(0.75)
    //     .setDepth(20);
    //
    // scene.groundLayer.renderDebug(graphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

}