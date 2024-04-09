window.gLocalAssetContainer["obstacleManager"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var define_1 = require("./define");
var asaInfo_1 = require("./asaInfo");
var miscAssetInfo_1 = require("./miscAssetInfo");
var soundInfo_1 = require("./soundInfo");
var assetInfo_1 = require("./assetInfo");
var entityUtil_1 = require("../util/entityUtil");
var spriteUtil_1 = require("../util/spriteUtil");
var tiledUtil_1 = require("../util/tiledUtil");
var audioUtil_1 = require("../util/audioUtil");
var asaEx_1 = require("../util/asaEx");
var gameParameterReader_1 = require("./gameParameterReader");
var commonParameterReader_1 = require("../commonNicowariGame/commonParameterReader");
/** 障害物種別 */
var ObstacleType;
(function (ObstacleType) {
    /** enemy_01 */
    ObstacleType[ObstacleType["GULL"] = 0] = "GULL";
    /** enemy_02 */
    ObstacleType[ObstacleType["ROCK"] = 1] = "ROCK";
    /** enemy_03 */
    ObstacleType[ObstacleType["SHARK"] = 2] = "SHARK";
    /** enemy_04 */
    ObstacleType[ObstacleType["PTERANODON"] = 3] = "PTERANODON";
})(ObstacleType = exports.ObstacleType || (exports.ObstacleType = {}));
/**
 * スクロールを管理し、障害物を表示、管理するクラス
 */
var ObstacleManager = /** @class */ (function (_super) {
    __extends(ObstacleManager, _super);
    /**
     * コンストラクタ
     * @param  {g.Scene} _scene Sceneインスタンス
     */
    function ObstacleManager(_scene) {
        return _super.call(this, { scene: _scene }) || this;
    }
    /**
     * ObstaclePlaceInfoをx座標昇順でソートするためのコンパレータ関数
     * @param {ObstaclePlaceInfo} _a 比較するObstaclePlaceInfo
     * @param {ObstaclePlaceInfo} _b 比較するObstaclePlaceInfo
     * @return {number} 比較結果
     */
    ObstacleManager.compareObstaclePlaceInfo = function (_a, _b) {
        return (_a.x - _b.x);
    };
    /**
     * このクラスで使用するオブジェクトを生成するメソッド
     * @param {g.E} _landmarkLayer 背景物用のレイヤー
     * @param {g.E} _swimmerLayer 水中障害物用のレイヤー
     * @param {g.E} _fryerLayer 空中障害物用のレイヤー
     */
    ObstacleManager.prototype.init = function (_landmarkLayer, _swimmerLayer, _fryerLayer) {
        this.landmarkLayer = _landmarkLayer;
        this.swimmerLayer = _swimmerLayer;
        this.fryerLayer = _fryerLayer;
        this.obstaclePlaceInfos = this.makeObstaclePlaceInfos();
        this.liveObstacles = [];
        this.liveLandmarks = [];
        this.spoLandmark = spriteUtil_1.spriteUtil.createSpriteParameter(assetInfo_1.AssetInfo.bgObj);
        this.sfmLandmark = spriteUtil_1.spriteUtil.createSpriteFrameMap(assetInfo_1.AssetInfo.bgObj);
    };
    /**
     * 初期表示時の処理を行うメソッド
     */
    ObstacleManager.prototype.showContent = function () {
        this.isScrolling = false;
        this.scrolledPixelCount = gameParameterReader_1.GameParameterReader.startPixel;
        this.scrolledSubPixel = 0;
        this.scrolledMeterCount = 0;
        this.scrolledSubMeter = 0;
        entityUtil_1.entityUtil.setX(this, this.scene.game.width);
        entityUtil_1.entityUtil.setX(this.landmarkLayer, this.x);
        entityUtil_1.entityUtil.setX(this.swimmerLayer, this.x);
        entityUtil_1.entityUtil.setX(this.fryerLayer, this.x);
        entityUtil_1.entityUtil.setX(this, this.scene.game.width - this.scrolledPixelCount);
        entityUtil_1.entityUtil.setX(this.landmarkLayer, this.scene.game.width - ((this.scrolledPixelCount *
            define_1.define.LANDMARK_SCROLL_RATE) | 0));
        entityUtil_1.entityUtil.setX(this.swimmerLayer, this.x);
        entityUtil_1.entityUtil.setX(this.fryerLayer, this.x);
        this.landmarkInfoIndex = 0;
        this.checkLandmarkPlaceInfo(); // 背景物の表示開始判定
        this.placeInfoIndex = 0;
        this.checkObstaclePlaceInfo(); // 障害物の表示開始判定
        this.checkObstaclePlaceInfo(); // 障害物の表示開始判定
        // 表示中の障害物のactorのmodified/calcを行う
        this.updateObstacleActor();
    };
    /**
     * 表示終了時の処理を行うメソッド
     */
    ObstacleManager.prototype.hideContent = function () {
        this.clearLandmarks(); // 表示中の背景物情報をクリアする
        this.clearObstacles(); // 表示中の障害物情報をクリアする
    };
    /**
     * スクロールを開始するメソッド
     */
    ObstacleManager.prototype.startScroll = function () {
        this.isScrolling = true;
    };
    /**
     * スクロールを停止するメソッド
     */
    ObstacleManager.prototype.stopScroll = function () {
        this.isScrolling = false;
    };
    /**
     * スクロールしたメートル数を取得するメソッド
     * @return {number} スクロールしたメートル数
     */
    ObstacleManager.prototype.getScrolledMeter = function () {
        return this.scrolledMeterCount;
    };
    /**
     * フレームごとの処理を行うメソッド
     * @param {number} _scrollFactor スクロール加速割合（0～1）
     */
    ObstacleManager.prototype.onUpdate = function (_scrollFactor) {
        if (this.isScrolling) {
            this.incrementScrollFrame(_scrollFactor);
            entityUtil_1.entityUtil.setX(this, this.scene.game.width - this.scrolledPixelCount);
            entityUtil_1.entityUtil.setX(this.landmarkLayer, this.scene.game.width - ((this.scrolledPixelCount *
                define_1.define.LANDMARK_SCROLL_RATE) | 0));
            entityUtil_1.entityUtil.setX(this.swimmerLayer, this.x);
            entityUtil_1.entityUtil.setX(this.fryerLayer, this.x);
            this.checkLandmarkLifeTime(); // 表示中の背景物の表示終了判定
            this.checkLandmarkPlaceInfo(); // 背景物の表示開始判定
            this.checkObstacleLifeTime(); // 表示中の障害物の表示終了判定
            this.checkObstaclePlaceInfo(); // 障害物の表示開始判定
            // 表示中の障害物のactorのmodified/calcを行う
            this.updateObstacleActor();
        }
    };
    /**
     * PCと障害物の衝突判定を行うメソッド
     * @param {g.CommonArea} _pcRect PCの衝突判定領域
     * @return {boolean} 障害物に衝突した場合はtrue
     */
    ObstacleManager.prototype.checkCollision = function (_pcRect) {
        if (define_1.define.DEBUG_COLLISION) {
            return false;
        }
        var lives = this.liveObstacles;
        var iEnd = lives.length;
        for (var i = 0; i < iEnd; ++i) {
            var actor = lives[i].actor;
            var pos = {
                x: actor.x + this.x,
                y: actor.y + this.y
            };
            var info = this.obstaclePlaceInfos[lives[i].placeInfoIndex];
            if (info.type === ObstacleType.PTERANODON) {
                var offset = actor.getBonePosition(define_1.define.PTERANODON_PIVOT_NAME);
                pos.x += offset.x;
                pos.y += offset.y;
            }
            if (this.checkCollisionCore(_pcRect, pos, lives[i].collisions)) {
                this.playCollisionSe(info.type);
                return true;
            }
        }
        return false;
    };
    /**
     * 障害物配置情報を生成するメソッド
     * @return {ObstaclePlaceInfo[]} 障害物配置情報配列
     */
    ObstacleManager.prototype.makeObstaclePlaceInfos = function () {
        var objectType = miscAssetInfo_1.MiscAssetInfo.mapData.objectType;
        var typeTable = {};
        typeTable[objectType.gull] = ObstacleType.GULL;
        typeTable[objectType.rock] = ObstacleType.ROCK;
        typeTable[objectType.shark] = ObstacleType.SHARK;
        typeTable[objectType.pteranodon] = ObstacleType.PTERANODON;
        var placeInfos = [];
        var objects = tiledUtil_1.tiledUtil.getObjects(miscAssetInfo_1.MiscAssetInfo.mapData.name, undefined, false, true);
        var iEnd = objects.length;
        for (var i = 0; i < iEnd; ++i) {
            var object = objects[i];
            if (!typeTable.hasOwnProperty(object.type)) {
                continue;
            }
            placeInfos[placeInfos.length] = {
                type: typeTable[object.type],
                x: object.x,
                y: object.y
            };
        }
        placeInfos.sort(ObstacleManager.compareObstaclePlaceInfo);
        return placeInfos;
    };
    /**
     * スクロールを1フレーム分進めるメソッド
     * @param {number} _scrollFactor スクロール加速割合（0～1）
     */
    ObstacleManager.prototype.incrementScrollFrame = function (_scrollFactor) {
        // ニコ割ではない場合かつマップ終端に到達した場合、マップを繰り返す
        if (!commonParameterReader_1.CommonParameterReader.nicowari) {
            if (this.scrolledPixelCount > define_1.define.MAP_END_PIXEL) {
                this.scrolledPixelCount = define_1.define.MAP_REPEATED_START_PIXEL;
                this.scrolledSubPixel = 0;
                this.landmarkInfoIndex = 0;
                this.placeInfoIndex = 0;
                this.clearObstacles();
                this.clearLandmarks();
            }
        }
        var pixelAdder = (define_1.define.SCROLL_FACTOR_MAX - 1) * _scrollFactor *
            define_1.define.SCROLL_PX_PER_FRAME_NUM;
        // console.log("incrementScrollFrame: pixelAdder:" + pixelAdder + ", _scrollFactor:" + _scrollFactor + ".");
        this.scrolledSubPixel += define_1.define.SCROLL_PX_PER_FRAME_NUM + pixelAdder;
        while (this.scrolledSubPixel >= define_1.define.SCROLL_PX_PER_FRAME_DENOM) {
            ++this.scrolledPixelCount;
            this.scrolledSubPixel -= define_1.define.SCROLL_PX_PER_FRAME_DENOM;
            this.scrolledSubMeter += define_1.define.SCROLL_METER_PER_PX_NUM;
            while (this.scrolledSubMeter >= define_1.define.SCROLL_METER_PER_PX_DENOM) {
                ++this.scrolledMeterCount;
                this.scrolledSubMeter -= define_1.define.SCROLL_METER_PER_PX_DENOM;
            }
        }
    };
    /**
     * スクロール位置に対応した背景物表示開始判定を行うメソッド
     */
    ObstacleManager.prototype.checkLandmarkPlaceInfo = function () {
        var appearLine = this.scrolledPixelCount *
            define_1.define.SCROLL_METER_PER_PX_NUM /
            define_1.define.SCROLL_METER_PER_PX_DENOM;
        var infos = define_1.define.LANDMARK_PLACEINFO;
        var index = this.landmarkInfoIndex;
        while ((index < infos.length) && (infos[index].x < appearLine)) {
            this.appearLandmark(index);
            ++index;
            this.landmarkInfoIndex = index;
        }
    };
    /**
     * 背景物の表示開始処理を行うメソッド
     * @param {number} _index 対象の背景物配置情報のインデックス
     */
    ObstacleManager.prototype.appearLandmark = function (_index) {
        var info = define_1.define.LANDMARK_PLACEINFO[_index];
        var sprite = spriteUtil_1.spriteUtil.createFrameSprite(this.spoLandmark, this.sfmLandmark, info.frameName);
        sprite.x = info.x * define_1.define.LANDMARK_SCROLL_RATE /
            define_1.define.SCROLL_METER_PER_PX_NUM *
            define_1.define.SCROLL_METER_PER_PX_DENOM;
        sprite.y = define_1.define.LANDMARK_BOTTOM_Y - sprite.height;
        entityUtil_1.entityUtil.appendEntity(sprite, this.landmarkLayer);
        this.liveLandmarks[this.liveLandmarks.length] = {
            placeInfoIndex: _index,
            sprite: sprite
        };
    };
    /**
     * 表示中の背景物の表示終了判定と表示終了処理を行うメソッド
     */
    ObstacleManager.prototype.checkLandmarkLifeTime = function () {
        var deadLine = 0 - this.landmarkLayer.x;
        var survivals = [];
        var lives = this.liveLandmarks;
        var iEnd = lives.length;
        for (var i = 0; i < iEnd; ++i) {
            var survived = true;
            if ((lives[i].sprite.x + lives[i].sprite.width) < deadLine) {
                survived = false;
            }
            if (survived) {
                survivals[survivals.length] = lives[i];
            }
            else {
                lives[i].sprite.destroy();
                lives[i].sprite = null;
            }
        }
        this.liveLandmarks.length = 0;
        this.liveLandmarks = survivals;
    };
    /**
     * スクロール位置に対応した障害物表示開始判定を行うメソッド
     */
    ObstacleManager.prototype.checkObstaclePlaceInfo = function () {
        var appearLine = define_1.define.OBSTACLE_APPEAR_AREA_WIDTH +
            this.scrolledPixelCount;
        var infos = this.obstaclePlaceInfos;
        var index = this.placeInfoIndex;
        while ((index < infos.length) && (infos[index].x < appearLine)) {
            this.appearObstacle(index);
            ++index;
            this.placeInfoIndex = index;
        }
    };
    /**
     * 障害物の表示開始処理を行うメソッド
     * @param {number} _index 対象の障害物配置情報のインデックス
     */
    ObstacleManager.prototype.appearObstacle = function (_index) {
        var info = this.obstaclePlaceInfos[_index];
        var animName = asaInfo_1.AsaInfo.obstacle.anim.gull;
        var collisions = [];
        var parent = this;
        switch (info.type) {
            case ObstacleType.GULL:
                animName = asaInfo_1.AsaInfo.obstacle.anim.gull;
                collisions = define_1.define.COLLISIONS_GULL;
                parent = this.fryerLayer;
                break;
            case ObstacleType.ROCK:
                animName = asaInfo_1.AsaInfo.obstacle.anim.rock;
                collisions = define_1.define.COLLISIONS_ROCK;
                parent = this.swimmerLayer;
                break;
            case ObstacleType.SHARK:
                animName = asaInfo_1.AsaInfo.obstacle.anim.shark;
                collisions = define_1.define.COLLISIONS_SHARK;
                parent = this.fryerLayer;
                break;
            case ObstacleType.PTERANODON:
                animName = asaInfo_1.AsaInfo.obstacle.anim.pteranodon;
                collisions = define_1.define.COLLISIONS_PTERANODON;
                parent = this.fryerLayer;
                break;
        }
        var actor = new asaEx_1.asaEx.Actor(this.scene, asaInfo_1.AsaInfo.obstacle.pj, animName);
        actor.x = info.x;
        actor.y = info.y;
        entityUtil_1.entityUtil.appendEntity(actor, parent);
        if (define_1.define.DEBUG_SHOW_COLLISION_RECT) {
            for (var i = 0; i < collisions.length; ++i) {
                var rectCollision = new g.FilledRect({
                    scene: this.scene,
                    cssColor: define_1.define.DEBUG_COLLISION_RECT_COLOR,
                    width: collisions[i].width,
                    height: collisions[i].height
                });
                rectCollision.x = collisions[i].x;
                rectCollision.y = collisions[i].y;
                rectCollision.opacity = define_1.define.DEBUG_COLLISION_RECT_OPACITY;
                entityUtil_1.entityUtil.appendEntity(rectCollision, actor);
            }
        }
        if (info.type === ObstacleType.PTERANODON) {
            actor.modified();
            actor.calc();
            actor.pause = true;
            actor.loop = false;
        }
        this.liveObstacles[this.liveObstacles.length] = {
            placeInfoIndex: _index,
            actor: actor,
            collisions: collisions
        };
        // console.log(this.fryerLayer.children.length);
    };
    /**
     * 表示中の障害物の表示終了判定と表示終了処理を行うメソッド
     */
    ObstacleManager.prototype.checkObstacleLifeTime = function () {
        var deadLine = (0 - this.scene.game.width -
            define_1.define.OBSTACLE_WIDTH_TO_VANISH_AREA) +
            this.scrolledPixelCount;
        var survivals = [];
        var lives = this.liveObstacles;
        var iEnd = lives.length;
        for (var i = 0; i < iEnd; ++i) {
            var survived = true;
            if (lives[i].actor.x > deadLine) {
                if (!this.checkPteranodonLifeCycle(lives[i])) {
                    survived = false;
                }
            }
            if (survived) {
                survivals[survivals.length] = lives[i];
            }
            else {
                lives[i].actor.destroy();
                lives[i].actor = null;
            }
        }
        this.liveObstacles.length = 0;
        this.liveObstacles = survivals;
    };
    /**
     * プテラノドン固有の状態変化処理を行うメソッド
     * @param {LiveObstacleInfo} _live 処理対象がのLiveObstacleInfo
     * @return {boolean} 処理対象がプテラノドンで、表示終了する場合はfalse
     */
    ObstacleManager.prototype.checkPteranodonLifeCycle = function (_live) {
        var info = this.obstaclePlaceInfos[_live.placeInfoIndex];
        if (info.type !== ObstacleType.PTERANODON) {
            return true;
        }
        var actor = _live.actor;
        if (actor.pause && (actor.currentFrame < (actor.animation.frameCount - 1))) {
            if ((actor.x + this.x) > define_1.define.PTERANODON_WAKE_X) {
                return true;
            }
            // アニメ開始位置まで到達した時の処理
            actor.pause = false;
        }
        else {
            if (actor.currentFrame === (actor.animation.frameCount - 1)) {
                // 表示終了する場合
                return false;
            }
        }
        actor.x = define_1.define.PTERANODON_WAKE_X - this.x;
        // この後modified/calcされるはずなのでここでのmodifiedは省略
        return true;
    };
    /**
     * 表示中の障害物のactorのmodified/calcを行うメソッド
     */
    ObstacleManager.prototype.updateObstacleActor = function () {
        var lives = this.liveObstacles;
        var iEnd = lives.length;
        for (var i = 0; i < iEnd; ++i) {
            var actor = lives[i].actor;
            actor.modified();
            actor.calc();
            if (define_1.define.DEBUG_SHOW_COLLISION_RECT) {
                var info = this.obstaclePlaceInfos[lives[i].placeInfoIndex];
                if (info.type === ObstacleType.PTERANODON) {
                    var offset = actor.getBonePosition(define_1.define.PTERANODON_PIVOT_NAME);
                    for (var j = 0; j < actor.children.length; ++j) {
                        entityUtil_1.entityUtil.setXY(actor.children[j], lives[i].collisions[j].x + offset.x, lives[i].collisions[j].y + offset.y);
                    }
                }
            }
        }
    };
    /**
     * 表示中の背景物をすべて消去するメソッド
     */
    ObstacleManager.prototype.clearLandmarks = function () {
        var lives = this.liveLandmarks;
        var iEnd = lives.length;
        for (var i = 0; i < iEnd; ++i) {
            lives[i].sprite.destroy();
            lives[i].sprite = null;
        }
        this.liveLandmarks.length = 0;
    };
    /**
     * 表示中の障害物をすべて消去するメソッド
     */
    ObstacleManager.prototype.clearObstacles = function () {
        var lives = this.liveObstacles;
        var iEnd = lives.length;
        for (var i = 0; i < iEnd; ++i) {
            lives[i].actor.destroy();
            lives[i].actor = null;
        }
        this.liveObstacles.length = 0;
    };
    /**
     * 矩形と障害物の衝突判定を行うメソッド
     * @param  {g.CommonArea} _rect 判定対象1の領域
     * @param  {g.CommonOffset} _pos 判定対象2の基準位置
     * @param  {g.CommonArea[]} _collisions _posからの相対領域配列
     * @return {boolean} 衝突した場合はtrue
     */
    ObstacleManager.prototype.checkCollisionCore = function (_rect, _pos, _collisions) {
        var iEnd = _collisions.length;
        for (var i = 0; i < iEnd; ++i) {
            var collision = {
                x: _pos.x + _collisions[i].x,
                y: _pos.y + _collisions[i].y,
                width: _collisions[i].width,
                height: _collisions[i].height
            };
            if (g.Collision.intersectAreas(_rect, collision)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 衝突時のSEを再生する
     * @param {ObstacleType} type 衝突した障害物の種別
     */
    ObstacleManager.prototype.playCollisionSe = function (type) {
        var seName = ""; // no sound
        switch (type) {
            case ObstacleType.GULL:
                seName = soundInfo_1.SoundInfo.seSet.gull;
                break;
            case ObstacleType.SHARK:
                seName = soundInfo_1.SoundInfo.seSet.shark;
                break;
            case ObstacleType.PTERANODON:
                seName = soundInfo_1.SoundInfo.seSet.pteranodon;
                break;
        }
        audioUtil_1.audioUtil.play(seName);
    };
    return ObstacleManager;
}(g.E));
exports.ObstacleManager = ObstacleManager;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}