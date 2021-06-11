"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 音声アセット関連の静的情報
 */
var SoundInfo = /** @class */ (function () {
    function SoundInfo() {
    }
    /** SE名のマップ */
    // tslint:disable-next-line:typedef
    SoundInfo.seSet = {
        tap: "se_wave_tap",
        gull: "se_comedy10",
        shark: "se_character16",
        pteranodon: "se_character03",
        miss: "se_No4_Miss",
        gameover: ""
    };
    /** BGM名のマップ */
    // tslint:disable-next-line:typedef
    SoundInfo.bgmSet = {
        title: "bgm_nico_wave",
        main: "bgm_nico_wave"
    };
    return SoundInfo;
}());
exports.SoundInfo = SoundInfo;
