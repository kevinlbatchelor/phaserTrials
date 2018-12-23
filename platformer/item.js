export default class Item {
    constructor(scene, spriteTag, group, tileTag) {

        scene[group] = scene.physics.add.staticGroup();
        scene.groundLayer.forEachTile((tile) => {
            if (tile.properties[tileTag]) {
                console.log('fired');
                const item = scene[group].create(tile.getCenterX(), tile.getCenterY(), spriteTag);

                // The map may have items rotated in Tiled (z key), so parse out that angle to the correct body placement
                item.rotation = tile.rotation;
                if (item.angle === 0) item.body.setSize(32, 6).setOffset(0, 26);
                else if (item.angle === -90) item.body.setSize(6, 32).setOffset(26, 0);
                else if (item.angle === 90) item.body.setSize(6, 32).setOffset(0, 0);

                scene.groundLayer.removeTileAt(tile.x, tile.y);
            }
        });
    }
}
