window.gLocalAssetContainer["gameCreator"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var waveGame_1 = require("./waveGame");
/**
 * GameBaseの実装クラスのインスタンス生成を行うだけのクラス
 * GameSubsceneに対して実装クラスの名前を隠ぺいする
 */
var GameCreator = /** @class */ (function () {
    function GameCreator() {
    }
    /**
     * GameBaseの実装クラスのインスタンスを生成する
     * @param {g.Scene}  _scene インスタンス生成に使用するScene
     * @return {GameBase} 生成されたインスタンス
     */
    GameCreator.createGame = function (_scene) {
        return new waveGame_1.WaveGame(_scene);
    };
    return GameCreator;
}());
exports.GameCreator = GameCreator;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}