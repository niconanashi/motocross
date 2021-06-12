"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 画像以外のアセット関連の静的情報
 */
var MiscAssetInfo = /** @class */ (function () {
    function MiscAssetInfo() {
    }
    // tslint:disable-next-line:typedef
    MiscAssetInfo.mapData = {
        name: "json_map01",
        /** tiledデータのオブジェクト種別名 */
        objectType: {
            /** tiledデータのオブジェクト種別名：カモメ */
            gull: "enemy_01",
            /** tiledデータのオブジェクト種別名：岩 */
            rock: "enemy_02",
            /** tiledデータのオブジェクト種別名：サメ */
            shark: "enemy_03",
            /** tiledデータのオブジェクト種別名：プテラノドン */
            pteranodon: "enemy_04"
        }
    };
    // tslint:disable-next-line:typedef
    MiscAssetInfo.difficultyData = {
        name: "json_difficultyParameters"
    };
    return MiscAssetInfo;
}());
exports.MiscAssetInfo = MiscAssetInfo;
