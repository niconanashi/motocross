window.gLocalAssetContainer["sceneController"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sceneの生成と各種ハンドラ設定を行う抽象クラス
 * このクラスのインスタンスはcreateSceneで生成したSceneのTriggerなどから
 * 参照されることによって保持される。
 */
var SceneController = /** @class */ (function () {
    function SceneController() {
        // NOP
    }
    return SceneController;
}());
exports.SceneController = SceneController;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}