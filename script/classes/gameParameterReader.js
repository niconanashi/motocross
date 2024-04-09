window.gLocalAssetContainer["gameParameterReader"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonParameterReader_1 = require("../commonNicowariGame/commonParameterReader");
var miscAssetInfo_1 = require("./miscAssetInfo");
/**
 * ゲーム固有パラメータの読み込みクラス
 * 省略されたパラメータ項目の補完などを行う
 */
var GameParameterReader = /** @class */ (function () {
    function GameParameterReader() {
    }
    /**
     * 起動パラメータから対応するメンバ変数を設定する
     * @param {g.Scene} _scene Sceneインスタンス
     */
    GameParameterReader.read = function (_scene) {
        this.startPixel = 0;
        if (!commonParameterReader_1.CommonParameterReader.nicowari) {
            if (commonParameterReader_1.CommonParameterReader.useDifficulty) {
                // 難易度指定によるパラメータを設定
                this.loadFromJson(_scene);
            }
            else {
                var param = _scene.game.vars.parameters;
                if (typeof param.startPixel === "number") {
                    this.startPixel = param.startPixel;
                }
            }
        }
    };
    /**
     * JSONから難易度指定によるパラメータを設定
     * @param {g.Scene} _scene Sceneインスタンス
     */
    GameParameterReader.loadFromJson = function (_scene) {
        var difficultyJson = JSON.parse(_scene
            .assets[miscAssetInfo_1.MiscAssetInfo.difficultyData.name].data);
        var difficultyList = difficultyJson.difficultyParameterList;
        if (difficultyList.length === 0) {
            return;
        }
        var index = 0;
        for (var i = difficultyList.length - 1; i >= 0; --i) {
            if (difficultyList[i].minimumDifficulty
                <= commonParameterReader_1.CommonParameterReader.difficulty) {
                index = i;
                // console.log("minimumDifficulty[" + i + "]:" + difficultyList[i].minimumDifficulty + ".");
                break;
            }
        }
        if (typeof difficultyList[index].startPixel === "number") {
            this.startPixel = difficultyList[index].startPixel;
        }
    };
    return GameParameterReader;
}());
exports.GameParameterReader = GameParameterReader;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}