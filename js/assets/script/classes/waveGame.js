window.gLocalAssetContainer["waveGame"] = function(g) { (function(exports, require, module, __filename, __dirname) {
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
var assetInfo_1 = require("./assetInfo");
var soundInfo_1 = require("./soundInfo");
var entityUtil_1 = require("../util/entityUtil");
var spriteUtil_1 = require("../util/spriteUtil");
var gameUtil_1 = require("../util/gameUtil");
var audioUtil_1 = require("../util/audioUtil");
var timerLabel_1 = require("./timerLabel");
var waveManager_1 = require("./waveManager");
var obstacleManager_1 = require("./obstacleManager");
var gameParameterReader_1 = require("./gameParameterReader");
var gameBase_1 = require("../commonNicowariGame/gameBase");
var commonParameterReader_1 = require("../commonNicowariGame/commonParameterReader");
/**
 * ニコニコウェーブゲームの実体を実装するクラス
 */
var WaveGame = /** @class */ (function (_super) {
    __extends(WaveGame, _super);
    /**
     * コンストラクタ
     * @param  {g.Scene} _scene Sceneインスタンス
     */
    function WaveGame(_scene) {
        return _super.call(this, _scene) || this;
    }
    /**
     * このクラスで使用するオブジェクトを生成するメソッド
     * Scene#loadedを起点とする処理からコンストラクタの直後に呼ばれる。
     * このクラスはゲーム画面終了時も破棄されず、次のゲームで再利用される。
     * そのためゲーム状態の初期化はinitではなくshowContentで行う必要がある。
     * @override
     */
    WaveGame.prototype.init = function () {
        _super.prototype.init.call(this);
        var scene = this.scene;
        var spoUi = spriteUtil_1.spriteUtil.createSpriteParameter(assetInfo_1.AssetInfo.ui);
        var sfmUi = spriteUtil_1.spriteUtil.createSpriteFrameMap(assetInfo_1.AssetInfo.ui);
        gameParameterReader_1.GameParameterReader.read(scene);
        var landmarkLayer = new g.E({ scene: scene });
        var swimmerLayer = new g.E({ scene: scene });
        var fryerLayer = new g.E({ scene: scene });
        landmarkLayer.moveTo(define_1.define.OFFSET_X, 0);
        swimmerLayer.moveTo(define_1.define.OFFSET_X, 0);
        fryerLayer.moveTo(define_1.define.OFFSET_X, 0);
        entityUtil_1.entityUtil.appendEntity(landmarkLayer, this);
        entityUtil_1.entityUtil.appendEntity(swimmerLayer, this);
        var obstacleManager = this.obstacleManager =
            new obstacleManager_1.ObstacleManager(scene);
        obstacleManager.moveTo(define_1.define.OFFSET_X, 0);
        obstacleManager.init(landmarkLayer, swimmerLayer, fryerLayer);
        entityUtil_1.entityUtil.appendEntity(obstacleManager, this);
        var waveManager = this.waveManager = new waveManager_1.WaveManager(scene);
        waveManager.moveTo(define_1.define.OFFSET_X, 0);
        waveManager.init();
        entityUtil_1.entityUtil.appendEntity(waveManager, this);
        entityUtil_1.entityUtil.appendEntity(fryerLayer, this);
        var iconT = spriteUtil_1.spriteUtil.createFrameSprite(spoUi, sfmUi, assetInfo_1.AssetInfo.ui.frames.iconT);
        iconT.moveTo(define_1.define.ICON_T_X, define_1.define.ICON_T_Y);
        entityUtil_1.entityUtil.appendEntity(iconT, this);
        var iconPt = spriteUtil_1.spriteUtil.createFrameSprite(spoUi, sfmUi, assetInfo_1.AssetInfo.ui.frames.iconPt);
        iconPt.moveTo(define_1.define.ICON_PT_X, define_1.define.ICON_PT_Y);
        entityUtil_1.entityUtil.appendEntity(iconPt, this);
        var timer = this.timerLabel = new timerLabel_1.TimerLabel(this.scene);
        timer.createLabel(assetInfo_1.AssetInfo.numBlack, assetInfo_1.AssetInfo.numRed);
        timer.moveLabelTo(define_1.define.GAME_TIMER_X, define_1.define.GAME_TIMER_Y);
        entityUtil_1.entityUtil.appendEntity(timer, this);
        var fontBlack = gameUtil_1.gameUtil.createNumFontWithAssetInfo(assetInfo_1.AssetInfo.numBlack);
        var score = this.scoreLabel = entityUtil_1.entityUtil.createNumLabel(this.scene, fontBlack, define_1.define.GAME_SCORE_DIGIT);
        entityUtil_1.entityUtil.moveNumLabelTo(score, define_1.define.GAME_SCORE_X, define_1.define.GAME_SCORE_Y);
        entityUtil_1.entityUtil.appendEntity(score, this);
    };
    /**
     * 表示系以外のオブジェクトをdestroyするメソッド
     * 表示系のオブジェクトはg.Eのdestroyに任せる。
     * @override
     */
    WaveGame.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    /**
     * タイトル画面のBGMのアセット名を返すメソッド
     * 共通フロー側でBGMを鳴らさない場合は実装クラスでオーバーライドして
     * 空文字列を返すようにする
     * @return {string} アセット名
     * @override
     */
    WaveGame.prototype.getTitleBgmName = function () {
        return soundInfo_1.SoundInfo.bgmSet.title;
    };
    /**
     * ゲーム中のBGMのアセット名を返すメソッド
     * 共通フロー側でBGMを鳴らさない場合は実装クラスでオーバーライドして
     * 空文字列を返すようにする
     * @return {string} アセット名
     * @override
     */
    WaveGame.prototype.getMainBgmName = function () {
        return soundInfo_1.SoundInfo.bgmSet.main;
    };
    /**
     * 表示を開始するメソッド
     * ゲーム画面に遷移するワイプ演出で表示が始まる時点で呼ばれる。
     * @override
     */
    WaveGame.prototype.showContent = function () {
        this.inGame = false;
        this.inMiss = false;
        this.inHold = false;
        this.touchCoolingFrames = 0;
        this.obstacleManager.showContent();
        this.waveManager.showContent();
        this.scoreValue = 0;
        entityUtil_1.entityUtil.setLabelText(this.scoreLabel, String(this.scoreValue));
        var timeLimit = define_1.define.GAME_TIME;
        if (commonParameterReader_1.CommonParameterReader.useGameTimeLimit) {
            timeLimit = commonParameterReader_1.CommonParameterReader.gameTimeLimit;
            if (timeLimit > define_1.define.GAME_TIME_MAX) {
                timeLimit = define_1.define.GAME_TIME_MAX;
            }
        }
        this.timerLabel.setTimeCount(timeLimit);
        this.timerLabel.timeCaution.handle(this, this.onTimeCaution);
        this.timerLabel.timeCautionCancel.handle(this, this.onTimeCautionCancel);
        _super.prototype.showContent.call(this);
        this.waveManager.onUpdate();//リスタート時の位置ズレ修正
    };
    /**
     * ゲームを開始するメソッド
     * ReadyGo演出が完了した時点で呼ばれる。
     * @override
     */
    WaveGame.prototype.startGame = function () {
        this.inGame = true;
        this.obstacleManager.startScroll();
        this.waveManager.startGame();
        this.scene.pointDownCapture.handle(this, this.onTouch);
        if (define_1.define.DEBUG_HOLD_TO_UP) {
            this.scene.pointUpCapture.handle(this, this.onTouchOff);
        }
        if (typeof window !== "undefined" && window.RPGAtsumaru) {
            var scoreboards = window.RPGAtsumaru.experimental.scoreboards;
            let date = new Date();
     scoreboards.setRecord(2,date.getFullYear()*100000000+(date.getMonth()+1)*1000000+date.getDate()*10000 + date.getHours()*100 + date.getMinutes());
       }
    };
    /**
     * 表示を終了するメソッド
     * このサブシーンから遷移するワイプ演出で表示が終わる時点で呼ばれる。
     * @override
     */
    WaveGame.prototype.hideContent = function () {
        this.obstacleManager.hideContent();
        this.timerLabel.timeCaution.removeAll(this);
        this.timerLabel.timeCautionCancel.removeAll(this);
        _super.prototype.hideContent.call(this);
    };
    /**
     * Scene#updateを起点とする処理から呼ばれるメソッド
     * ゲーム画面でない期間には呼ばれない。
     * @override
     */
    WaveGame.prototype.onUpdate = function () {
        if (this.inGame) {
            if (!this.inMiss) {
                this.obstacleManager.onUpdate(this.waveManager.getScrollFactor());
                this.checkScrolledMeter();
            }
            this.timerLabel.tick();
            if (!this.inMiss) {
                if (this.timerLabel.getTimeCount() === 0) {
                    this.finishGame();
                }
            }
        }
        if (this.inGame) {
            if (this.touchCoolingFrames > 0) {
                --this.touchCoolingFrames;
            }
            if (define_1.define.DEBUG_HOLD_TO_UP) {
                if (this.inHold && this.waveManager.isTouchable()) {
                    this.waveManager.onTouch();
                }
            }
            this.waveManager.onUpdate();
            if (this.inMiss) {
                if (this.waveManager.isTouchable()) {
                    // ミス処理終了時
                    this.inMiss = false;
                }
                else if (this.waveManager.isStartedPcReturn()) {
                    // PC復帰演出開始時
                }
            }
            else {
                this.checkCollision(); // PCと障害物のあたり判定
            }
        }
    };
    /**
     * TimerLabel#timeCautionのハンドラ
     */
    WaveGame.prototype.onTimeCaution = function () {
        this.timeCaution.fire();
    };
    /**
     * TimerLabel#timeCautionCancelのハンドラ
     */
    WaveGame.prototype.onTimeCautionCancel = function () {
        this.timeCautionCancel.fire();
    };
    /**
     * 必要に応じてメートル数表示を更新するメソッド
     */
    WaveGame.prototype.checkScrolledMeter = function () {
        var scrolledMeter = this.obstacleManager.getScrolledMeter();
        if (this.scoreValue !== scrolledMeter) {
            this.scoreValue = scrolledMeter;
            if (this.scoreValue > define_1.define.SCORE_LIMIT) {
                this.scoreValue = define_1.define.SCORE_LIMIT;
            }
            gameUtil_1.gameUtil.updateGameStateScore(this.scoreValue);
            entityUtil_1.entityUtil.setLabelText(this.scoreLabel, String(this.scoreValue));
        }
    };
    /**
     * PCと障害物のあたり判定を行うメソッド
     */
    WaveGame.prototype.checkCollision = function () {
        if (this.waveManager.isRunup()) {
            return;
        }
        var pos = this.waveManager.getPcPosition();
        var rect = {
            x: pos.x + define_1.define.COLLISION_PC.x,
            y: pos.y + define_1.define.COLLISION_PC.y,
            width: define_1.define.COLLISION_PC.width,
            height: define_1.define.COLLISION_PC.height
        };
        if (this.obstacleManager.checkCollision(rect)) {
            // ミス処理
            audioUtil_1.audioUtil.play(soundInfo_1.SoundInfo.seSet.miss);
            this.inMiss = true;
            this.waveManager.onMiss();
        }
    };
    /**
     * ゲームを終了するメソッド
     * gameUtil.setGameScoreしたスコアが結果画面で表示される。
     * @param {boolean = false} opt_isLifeZero
     * (optional)ライフ消滅によるゲーム終了の場合はtrue
     */
    WaveGame.prototype.finishGame = function (opt_isLifeZero) {
        if (opt_isLifeZero === void 0) { opt_isLifeZero = false; }
        this.inGame = false;
        this.obstacleManager.stopScroll();
        this.scene.pointDownCapture.removeAll(this);
        if (define_1.define.DEBUG_HOLD_TO_UP) {
            this.scene.pointUpCapture.removeAll(this);
        
        }
        gameUtil_1.gameUtil.setGameScore(this.scoreValue);
        // 呼び出すトリガーによって共通フローのジングルアニメが変化する
        if (opt_isLifeZero) {
            this.gameOver.fire();
            this.timerLabel.forceStopBlink();
            audioUtil_1.audioUtil.play(soundInfo_1.SoundInfo.seSet.gameover);
        }
        else {
            this.timeup.fire();
        }
    };
    /**
     * Scene#pointDownCaptureのハンドラ
     * @param {g.PointDownEvent} _e イベントパラメータ
     * @return {boolean} ゲーム終了時はtrueを返す
     */
    WaveGame.prototype.onTouch = function (_e) {
        if (!this.inGame) {
            return true;
        }
        if (define_1.define.DEBUG_HOLD_TO_UP) {
            this.inHold = true;
        }
        if (this.inMiss || (this.touchCoolingFrames > 0)) {
            return false;
        }
        audioUtil_1.audioUtil.play(soundInfo_1.SoundInfo.seSet.tap);
        if (this.waveManager.isTouchable()) {
            this.waveManager.onTouch();
            this.touchCoolingFrames = define_1.define.TOUCH_COOLING_FRAMES;
        }
        return false;
    };
    /**
     * Scene#pointUpCaptureのハンドラ
     * @param {g.PointUpEvent} _e イベントパラメータ
     * @return {boolean} ゲーム終了時はtrueを返す
     */
    WaveGame.prototype.onTouchOff = function (_e) {
        if (!this.inGame) {
            return true;
        }
        if (define_1.define.DEBUG_HOLD_TO_UP) {
            this.inHold = false;
        }
        return false;
    };
    return WaveGame;
    
}(gameBase_1.GameBase));
exports.WaveGame = WaveGame;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}
