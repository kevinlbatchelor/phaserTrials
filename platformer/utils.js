import Player from './player.js';
import Spider from './spider.js';
import Item from './item.js';

export function death(scene) {
    if (scene.player.sprite.y > scene.groundLayer.height ||
        scene.physics.world.overlap(scene.player.sprite, scene.spikeGroup)) {
        die();
    }

    if (scene.spider) {
        if (
            scene.physics.world.overlap(scene.player.sprite, scene.spider.sprite)) {
            die();
        }
    }

    function die() {
        inventory.potions = 0;

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
        'npc',
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

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = map.findObject('Objects', findFunction('Player Spawn'));
    const enemyPoint = map.findObject('Objects', findFunction('Enemy Spawn'));

    if (enemyPoint) {
        scene.spider = new Spider(scene, enemyPoint.x, enemyPoint.y);
    }

    // Collide the player against the ground layer - here we are grabbing the sprite property from the player (since the Player class is not a Phaser.Sprite).
    scene.groundLayer.setCollisionByProperty({ collides: true });
    scene.doorLayer.setCollisionByProperty({ collides: true });

    new Item(scene, 'spike', 'spikeGroup', 'isSpike', 'groundLayer', { width: 32, height: 6 });
    new Item(scene, 'potion', 'potionGroup', 'isPotion');
    new Item(scene, 'chest', 'chestGroup', 'isChest');

    let { x, y } = spawnPoint;

    if (scene.sceneState.exitPostion) {
        x = scene.sceneState.exitPostion.x;
        y = scene.sceneState.exitPostion.y;
    }
    scene.player = new Player(scene, x, y, inventory);
    scene.cameras.main.startFollow(scene.player.sprite);
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    debug(scene);
    return map;
}

function debug(scene) {
    scene.input.keyboard.once('keydown_D', (event) => {
        // Turn on physics debugging to show player's hitbox
        scene.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = scene.add.graphics().setAlpha(0.75).setDepth(20);
        scene.groundLayer.renderDebug(graphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
    });
}

export function findFunction(name) {
    return (obj) => {
        return obj.name === name;
    };
}

export let inventory = {
    potions: 0,
    gold: 40,
    weapons: [],
    spells: []
};

export let levels = {
    SceneOne: { visited: false },
    SceneTwo: { visited: false },
    SceneThree: { visited: false },
    Shop: { visited: false }
};

export const draw = _.throttle((scene, worldPoint) => {
    const tile = scene.platformLayer.putTileAtWorldXY(348, worldPoint.x, worldPoint.y);
    tile.setCollision(true);
    scene.player.deleteInventory('potions');
    updateText(scene);
}, 500, { leading: true, trailing: false });

export function drawText(scene, inventory) {
    let w = scene.game.config.width - 150;
    scene.metaText = scene.add.text(20, 40, '', {
        font: '18px monospace',
        fill: '#ffffff',
        padding: { x: 32, y: 32 }
    }).setScrollFactor(0).setDepth(30);

    scene.gold = scene.add.text(w, 10, 'Gold:' + inventory.gold, {
        font: '18px monospace',
        fill: '#ffffff',
        padding: { x: 0, y: 0 }
    }).setScrollFactor(0).setDepth(30);

    scene.potions = scene.add.text(w, 30, 'Potions:' + inventory.potions, {
        font: '18px monospace',
        fill: '#ffffff',
        padding: { x: 0, y: 0 }
    }).setScrollFactor(0).setDepth(30);
}

export function updateText(scene) {
    scene.potions.setText('Potions:' + _.toString(scene.player.getInventory().potions));
    scene.gold.setText('Gold:' + _.toString(scene.player.getInventory().gold));
}

export function gotoLevel(scene, door, gotoScene, levels) {
    let position = {};
    position.x = door.body.center.x;
    position.y = door.body.center.y;
    levels[gotoScene].fromScene = scene.scene.key;
    scene.sceneState.exitPostion = position;
    scene.scene.start(gotoScene);
}

export function createAnimation(scene, animationObj){
    const anims = scene.scene.anims;
    let keyFound = Object.keys(scene.scene.anims.game.anims.anims.entries).find((item) => {
        return item === animationObj.key
    });
    if(!keyFound){
        anims.create(animationObj);
    }
}