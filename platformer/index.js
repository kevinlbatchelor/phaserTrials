import SceneTwo from './sceneTwo.js';
import SceneOne from './sceneOne.js';

window.onload = function () {
    let config = {
        type: Phaser.AUTO,
        width: 1480,
        height: 800,
        parent: 'game-container',
        pixelArt: false,
        backgroundColor: '#1d212d',
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