import SceneTwo from './sceneTwo.js';
import SceneOne from './sceneOne.js';

window.onload = function () {
    let config = {
        type: Phaser.AUTO,
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
        scene: [SceneOne, SceneTwo]
    };

    new Phaser.Game(config);
    window.focus();
};