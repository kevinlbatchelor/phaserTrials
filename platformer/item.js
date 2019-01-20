export default class Item {
    constructor(scene, spriteTag, group, tileTag, layer = 'groundLayer', size = { width: 32, height: 32 }) {
        if (!scene.sceneState[group]) {
            scene.sceneState[group] = [];
            scene[group] = scene.physics.add.staticGroup();
            scene[layer].forEachTile((tile, i) => {
                if (tile.properties[tileTag]) {
                    const item = scene[group].create(tile.getCenterX(), tile.getCenterY(), spriteTag);
                    let tag = tileTag + i;
                    item.tag = tag;
                    const itemFrame = {
                        destroyed: false,
                        tag: tag
                    };
                    let offsetHeight = (32 - size.height);
                    let offsetWidth = (32 - size.width);
                    // The map may have items rotated in Tiled (z key), so parse out that angle to the correct body placement
                    item.rotation = tile.rotation;
                    if (item.angle === 0) item.body.setSize(size.width, size.height).setOffset(offsetWidth, offsetHeight);
                    else if (item.angle === -90) item.body.setSize(size.height, size.width).setOffset(26, offsetWidth);
                    else if (item.angle === 90) item.body.setSize(size.height, size.width).setOffset(0, 0);

                    scene.sceneState[group].push(itemFrame);
                    scene[layer].removeTileAt(tile.x, tile.y);
                }
            });
        } else {
            scene[group] = scene.physics.add.staticGroup();
            scene[layer].forEachTile((tile, i) => {
                if (tile.properties[tileTag] && _.find(scene.sceneState[group], { destroyed: false, tag: tileTag + i })) {

                    const item = scene[group].create(tile.getCenterX(), tile.getCenterY(), spriteTag);
                    let tag = tileTag + i;
                    item.tag = tag;
                    let offsetHeight = (32 - size.height);
                    let offsetWidth = (32 - size.width);
                    // The map may have items rotated in Tiled (z key), so parse out that angle to the correct body placement
                    item.rotation = tile.rotation;
                    if (item.angle === 0) item.body.setSize(size.width, size.height).setOffset(offsetWidth, offsetHeight);
                    else if (item.angle === -90) item.body.setSize(size.height, size.width).setOffset(26, offsetWidth);
                    else if (item.angle === 90) item.body.setSize(size.height, size.width).setOffset(0, 0);

                    scene[layer].removeTileAt(tile.x, tile.y);

                } else if (tile.properties[tileTag]) {
                    scene[layer].removeTileAt(tile.x, tile.y);
                }
            });
        }
    }
}
