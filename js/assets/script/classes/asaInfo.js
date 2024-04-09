window.gLocalAssetContainer["asaInfo"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * asapj関連の静的情報
 */
var AsaInfo = /** @class */ (function () {
    function AsaInfo() {
    }
    // tslint:disable-next-line:typedef
    AsaInfo.surfing = {
        pj: "pj_surfing",
        anim: {
            waveFlat: "wave_flat",
            waveSL: "wave_move_s_l",
            waveLS: "wave_move_l_s",
            waveLowerMost: "wave_lowermost",
            pcNormal: "pc_nomal",
            pcDamage: "pc_damage",
            pcReturn: "pc_return",
            pcRunup: "pc_strongest" // ＰＣ（復帰後の無敵状態）
        }
    };
    // tslint:disable-next-line:typedef
    AsaInfo.obstacle = {
        pj: "pj_obstacle",
        anim: {
            gull: "enemy_01_a",
            rock: "enemy_02_a",
            shark: "enemy_03_a",
            pteranodon: "enemy_04_a" // 障害物Ｄ（プテラノドン）
        }
    };
    return AsaInfo;
}());
exports.AsaInfo = AsaInfo;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}