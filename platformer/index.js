import SceneTwo from './sceneTwo.js';
import Shop from './shop.js';
import SceneOne from './sceneOne.js';
import SceneThree from './sceneThree.js';
import SceneFour from './sceneFour.js';

window.onload = function () {
    let config = {
        type: Phaser.AUTO,
        autoFocus: true,
        width: 1470,
        height: 700,
        parent: 'game-container',
        pixelArt: false,
        backgroundColor: '#000000',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1000 }
            }
        },
        scene: [SceneFour]
    };

    new Phaser.Game(config);
    window.focus();
};