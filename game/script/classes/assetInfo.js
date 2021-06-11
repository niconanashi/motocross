"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 画像アセット関連の静的情報
 */
var AssetInfo = /** @class */ (function () {
    function AssetInfo() {
    }
    // tslint:disable-next-line:typedef
    AssetInfo.numBlack = {
        img: "img_numbers_n",
        json: "json_numbers_n",
        numFrames: [
            "numbers_n_10.png",
            "numbers_n_01.png",
            "numbers_n_02.png",
            "numbers_n_03.png",
            "numbers_n_04.png",
            "numbers_n_05.png",
            "numbers_n_06.png",
            "numbers_n_07.png",
            "numbers_n_08.png",
            "numbers_n_09.png"
        ],
        frames: {
            cross: "numbers_n_11.png",
            plus: "numbers_n_12.png",
            minus: "numbers_n_13.png"
        },
        fontWidth: 26,
        fontHeight: 30
    };
    // tslint:disable-next-line:typedef
    AssetInfo.numRed = {
        img: "img_numbers_n_red",
        json: "json_numbers_n_red",
        numFrames: [
            "numbers_n_red_10.png",
            "numbers_n_red_01.png",
            "numbers_n_red_02.png",
            "numbers_n_red_03.png",
            "numbers_n_red_04.png",
            "numbers_n_red_05.png",
            "numbers_n_red_06.png",
            "numbers_n_red_07.png",
            "numbers_n_red_08.png",
            "numbers_n_red_09.png"
        ],
        frames: {
            cross: "numbers_n_red_11.png",
            plus: "numbers_n_red_12.png",
            minus: "numbers_n_red_13.png"
        },
        fontWidth: 26,
        fontHeight: 30
    };
    // tslint:disable-next-line:typedef
    AssetInfo.ui = {
        img: "img_ui",
        json: "json_ui",
        frames: {
            iconT: "icon_t.png",
            iconPt: "ui_icon_pt_export.png" // UIアイコン（pt）
        }
    };
    // tslint:disable-next-line:typedef
    AssetInfo.bgObj = {
        img: "img_bg_obj",
        json: "json_bg_obj",
        frames: {
            bgObj01: "bg_obj01.png",
            bgObj02: "bg_obj02.png",
            bgObj03: "bg_obj03.png",
            bgObj04: "bg_obj04.png",
            bgObj05: "bg_obj05.png",
            bgObj06: "bg_obj06.png",
            bgObj07: "bg_obj07.png",
            bgObj08: "bg_obj08.png",
            bgObj09: "bg_obj09.png" // 背景オブジェクト（モアイ2）
        }
    };
    return AssetInfo;
}());
exports.AssetInfo = AssetInfo;
