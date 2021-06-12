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
var entityUtil_1 = require("../util/entityUtil");
var gameUtil_1 = require("../util/gameUtil");
var asaEx_1 = require("../util/asaEx");
/** PC状態 */
var PcState;
(function (PcState) {
    /** 通常 */
    PcState[PcState["NORMAL"] = 0] = "NORMAL";
    /** ダメージ */
    PcState[PcState["DAMAGE"] = 1] = "DAMAGE";
    /** 復帰 */
    PcState[PcState["RETURN"] = 2] = "RETURN";
})(PcState = exports.PcState || (exports.PcState = {}));
/** 波状態 */
var WaveState;
(function (WaveState) {
    /** 上昇 */
    WaveState[WaveState["UP"] = 0] = "UP";
    /** 下降 */
    WaveState[WaveState["DOWN"] = 1] = "DOWN";
    /** 底 */
    WaveState[WaveState["FLOOR"] = 2] = "FLOOR";
})(WaveState = exports.WaveState || (exports.WaveState = {}));
/**
 * PC/波/水面を表示、管理するクラス
 */
var WaveManager = /** @class */ (function (_super) {
    __extends(WaveManager, _super);
    /**
     * コンストラクタ
     * @param  {g.Scene} _scene Sceneインスタンス
     */
    function WaveManager(_scene) {
        return _super.call(this, { scene: _scene }) || this;
    }
    /**
     * このクラスで使用するオブジェクトを生成するメソッド
     */
    WaveManager.prototype.init = function () {
        this.touchable = false;
        this.pcState = PcState.NORMAL;
        this.isStartedPcReturn_ = false;
        this.runupFrames = 0;
        this.waveState = WaveState.FLOOR;
        this.upCount = 0;
        var actorPC = this.actorPC =
            new asaEx_1.asaEx.Actor(this.scene, asaInfo_1.AsaInfo.surfing.pj, asaInfo_1.AsaInfo.surfing.anim.pcNormal);
        if (define_1.define.DEBUG_SHOW_COLLISION_RECT) {
            var rectCollision = new g.FilledRect({
                scene: this.scene,
                cssColor: define_1.define.DEBUG_COLLISION_RECT_COLOR,
                width: define_1.define.COLLISION_PC.width,
                height: define_1.define.COLLISION_PC.height
            });
            rectCollision.x = define_1.define.COLLISION_PC.x;
            rectCollision.y = define_1.define.COLLISION_PC.y;
            rectCollision.opacity = define_1.define.DEBUG_COLLISION_RECT_OPACITY;
            entityUtil_1.entityUtil.appendEntity(rectCollision, actorPC);
        }
        var attachmentPC = this.attachmentPC =
            new asaEx_1.asaEx.ActorAttachment(actorPC);
        attachmentPC.cancelParentSR = true;
        var actorWave = this.actorWave =
            new asaEx_1.asaEx.Actor(this.scene, asaInfo_1.AsaInfo.surfing.pj, asaInfo_1.AsaInfo.surfing.anim.waveLowerMost);
        actorWave.x = define_1.define.SURFING_X;
        actorWave.y = define_1.define.SURFING_Y;
        actorWave.attach(attachmentPC, define_1.define.PC_PIVOT_NAME);
        entityUtil_1.entityUtil.appendEntity(actorWave, this);
        var actorPlane = this.actorPlane =
            new asaEx_1.asaEx.Actor(this.scene, asaInfo_1.AsaInfo.surfing.pj, asaInfo_1.AsaInfo.surfing.anim.waveFlat);
        actorPlane.x = define_1.define.SURFING_X;
        actorPlane.y = define_1.define.SURFING_Y;
        entityUtil_1.entityUtil.appendEntity(actorPlane, this);
    };
    /**
     * 初期表示を行うメソッド
     */
    WaveManager.prototype.showContent = function () {
        this.touchable = false;
        this.pcState = PcState.NORMAL;
        this.isStartedPcReturn_ = false;
        this.runupFrames = 0;
        this.waveState = WaveState.FLOOR;
        this.upCount = 0;
        this.actorPC.play(asaInfo_1.AsaInfo.surfing.anim.pcNormal, 0, true, 1);
        this.actorWave.play(asaInfo_1.AsaInfo.surfing.anim.waveLowerMost, 0, true, 1);
        this.actorPlane.play(asaInfo_1.AsaInfo.surfing.anim.waveFlat, 0, true, 1);
    };
    /**
     * ゲーム開始時の処理を行うメソッド
     */
    WaveManager.prototype.startGame = function () {
        this.touchable = true;
    };
    /**
     * タッチ可能状態かどうかを返すメソッド
     * @return {boolean} タッチ可能ならばtrue
     */
    WaveManager.prototype.isTouchable = function () {
        return this.touchable;
    };
    /**
     * PC状態がダメージから復帰に変わったフレームのみtrueを返すメソッド
     * onUpdateの後から次のonUpdate呼び出しまでが一つの判定区間
     * @return {boolean} 復帰に変わったフレームならばtrue
     */
    WaveManager.prototype.isStartedPcReturn = function () {
        return this.isStartedPcReturn_;
    };
    /**
     * 復帰後の無敵時間かどうかを返す返すメソッド
     * @return {boolean} 復帰後の無敵時間中ならばtrue
     */
    WaveManager.prototype.isRunup = function () {
        return (this.runupFrames > 0);
    };
    /**
     * PCの座標を取得するメソッド
     * @return {g.CommonOffset} thisの親を基準としたPCの座標
     */
    WaveManager.prototype.getPcPosition = function () {
        var actorWave = this.actorWave;
        var pos = actorWave.getBonePosition(define_1.define.PC_PIVOT_NAME);
        pos.x += actorWave.x + gameUtil_1.gameUtil.getMatrixDx(this.attachmentPC.matrix)
            + this.x;
        pos.y += actorWave.y;
        return pos;
    };
    /**
     * 波の高さに対応したスクロール加速割合を取得するメソッド
     * @return {number} スクロール加速割合（0～1）
     */
    WaveManager.prototype.getScrollFactor = function () {
        var framePosition = this.getUpFramePosition();
        var asaResource = asaEx_1.asaEx.ResourceManager.getResource(this.scene, asaInfo_1.AsaInfo.surfing.pj);
        var downFrames = asaResource.getAnimationByName(asaInfo_1.AsaInfo.surfing.anim.waveSL).frameCount;
        var middle = (downFrames - 1) * 0.5;
        var diff = Math.abs(framePosition - middle);
        var factor = (middle - diff) / middle;
        return (factor < 0) ? 0 : (factor > 1) ? 2 : factor;
    };
    /**
     * フレームごとの処理を行うメソッド
     */
    WaveManager.prototype.onUpdate = function () {
        if (this.pcState === PcState.NORMAL) {
            this.updateInNormal();
        }
        else {
            this.updateInMiss();
        }
    };
    /**
     * タッチした結果を処理するメソッド
     */
    WaveManager.prototype.onTouch = function () {
        if (this.waveState !== WaveState.UP) {
            this.changeWaveState(WaveState.UP);
        }
        this.upCount = define_1.define.UP_FRAMES_PER_TOUCH;
    };
    /**
     * ミス時の処理を行うメソッド
     */
    WaveManager.prototype.onMiss = function () {
        this.touchable = false;
        this.actorPC.play(asaInfo_1.AsaInfo.surfing.anim.pcDamage, 0, false, 1);
        this.pcState = PcState.DAMAGE;
    };
    /**
     * 通常時のフレームごとの処理を行うメソッド
     */
    WaveManager.prototype.updateInNormal = function () {
        if (this.runupFrames > 0) {
            --this.runupFrames;
            if (this.runupFrames <= 0) {
                this.actorPC.play(asaInfo_1.AsaInfo.surfing.anim.pcNormal, 0, true, 1);
            }
        }
        if (this.waveState === WaveState.UP) {
            --this.upCount;
            if ((this.upCount === 0) || (this.actorWave.currentFrame ===
                (this.actorWave.animation.frameCount - 1))) {
                this.upCount = 0;
                this.changeWaveState(WaveState.DOWN);
            }
        }
        else if (this.waveState === WaveState.DOWN) {
            if (this.actorWave.currentFrame ===
                (this.actorWave.animation.frameCount - 1)) {
                this.changeWaveState(WaveState.FLOOR);
            }
        }
        this.actorPC.modified();
        this.actorPC.calc();
        this.actorWave.modified();
        this.actorWave.calc();
        this.actorPlane.modified();
        this.actorPlane.calc();
        gameUtil_1.gameUtil.setMatrixDx(this.attachmentPC.matrix, define_1.define.PC_OVERHANG_MAX * this.getScrollFactor());
    };
    /**
     * ミス演出中のフレームごとの処理を行うメソッド
     */
    WaveManager.prototype.updateInMiss = function () {
        this.isStartedPcReturn_ = false;
        if (this.actorPC.currentFrame ===
            (this.actorPC.animation.frameCount - 1)) {
            if (this.pcState === PcState.DAMAGE) {
                // 復帰に移行する
                if (this.waveState !== WaveState.FLOOR) {
                    this.actorWave.play(asaInfo_1.AsaInfo.surfing.anim.waveLowerMost, 0, true, 1);
                    this.waveState = WaveState.FLOOR;
                    gameUtil_1.gameUtil.setMatrixDx(this.attachmentPC.matrix, 0);
                }
                this.actorPC.play(asaInfo_1.AsaInfo.surfing.anim.pcReturn, 0, false, 1);
                this.pcState = PcState.RETURN;
                this.isStartedPcReturn_ = true;
            }
            else {
                // 通常（復帰後の無敵状態）に移行する
                this.actorPC.play(asaInfo_1.AsaInfo.surfing.anim.pcRunup, 0, true, 1);
                this.pcState = PcState.NORMAL;
                this.runupFrames = define_1.define.RUNUP_FRAMES;
                this.upCount = 0;
                this.touchable = true;
            }
        }
        else {
            this.actorPC.modified();
            this.actorPC.calc();
        }
        // actorPCのアタッチ先のmodifiedを呼ばないと再描画されない
        this.actorWave.modified();
    };
    /**
     * 波の状態を切り替える
     * @param {WaveState} _newState 切り替え後の状態
     */
    WaveManager.prototype.changeWaveState = function (_newState) {
        // 現在の状態とアニメ位置から上昇アニメでの位置を求める
        var framePosition = this.getUpFramePosition();
        // 上昇アニメでの位置に応じて切り替え後のアニメ位置を設定する
        var asaResource = asaEx_1.asaEx.ResourceManager.getResource(this.scene, asaInfo_1.AsaInfo.surfing.pj);
        var downFrames = asaResource.getAnimationByName(asaInfo_1.AsaInfo.surfing.anim.waveLS).frameCount;
        switch (_newState) {
            case WaveState.UP:
                this.actorWave.play(asaInfo_1.AsaInfo.surfing.anim.waveSL, framePosition, false, define_1.define.PLAYSPEED_UP, true);
                break;
            case WaveState.DOWN:
                this.actorWave.play(asaInfo_1.AsaInfo.surfing.anim.waveLS, (downFrames - 1) - framePosition, false, define_1.define.PLAYSPEED_DOWN, true);
                break;
            case WaveState.FLOOR:
                this.actorWave.play(asaInfo_1.AsaInfo.surfing.anim.waveLowerMost, 0, true, 1, true);
                break;
        }
        this.waveState = _newState;
    };
    /**
     * 上昇アニメでの位置を求めるメソッド
     * @return {number} 上昇アニメでの位置
     */
    WaveManager.prototype.getUpFramePosition = function () {
        var framePosition = 0;
        switch (this.waveState) {
            case WaveState.UP:
                framePosition = this.actorWave.currentFrame;
                break;
            case WaveState.DOWN:
                framePosition = (this.actorWave.animation.frameCount - 1) -
                    this.actorWave.currentFrame;
                break;
            case WaveState.FLOOR:
                framePosition = 0;
                break;
        }
        return framePosition;
    };
    return WaveManager;
}(g.E));
exports.WaveManager = WaveManager;
