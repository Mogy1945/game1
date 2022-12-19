

//難易度選択の処理
const selectLevel = () => {
    let selectLevelFlag = false;
    const settings = {
        //enemy設定
        enemyAreaStartWidth: 5,
        enemyAreaMin: 1,
        enemyAreaMax: 35,
        enemyDisplaySpeed: 0,
        enemyMovingSpeed: 0,
        endLength: 2,
        //player設定
        playerAreaMin: 36,
        playerAreaMax: 40,
        //コンピューター設定
        judgeSpeed: 500,
    }

    //難易度選択時の処理
    $('#level_selected').on('change', function () {
        const level = $(this).find(':selected').val();

        //レベル別初期設定
        switch (level) {
            case 'easy':
                settings.enemyDisplaySpeed = 200;
                settings.enemyMovingSpeed = 200;
                selectLevelFlag = true;
                settings.endLength = 3;
                break;
            case 'normal':
                settings.enemyDisplaySpeed = 100;
                settings.enemyMovingSpeed = 100;
                settings.endLength = 4;
                selectLevelFlag = true;
                break;
            case 'hard':
                settings.enemyDisplaySpeed = 50;
                settings.enemyMovingSpeed = 50;
                settings.endLength = 4;
                selectLevelFlag = true;
                break;
            case 'legend':
                settings.enemyDisplaySpeed = 10;
                settings.enemyMovingSpeed = 10;
                settings.endLength = 4;
                selectLevelFlag = true;
                break;
            default:
                alert('難易度を選択してください。')
                selectLevelFlag = false;
                break;
        }

        selectLevelFlag ? $('.game-starter').removeClass('disabled') : $('.game-starter').addClass('disabled');

    });

    //ゲーム開始の処理
    $('.game-start-btn').on('click', function () {
        $('.start-display').hide();
        judgeGameControl(settings);
        enemyControl(settings);
        moving(settings);
    });

}



//エネミーの処理
const enemyControl = (settings) => {

    function _enemyGenerator(settings) {
        setInterval(function () {
            const randomNum = Math.floor(Math.random() * ((settings.enemyAreaStartWidth + 1) - 1)) + 1;
            const place_ENEMY = $(`[data-num="${randomNum}"]`).find('span')
            const place_ENEMY_ALREADY = place_ENEMY.hasClass('enemy');

            if (place_ENEMY_ALREADY) {
                return false;
            }

            place_ENEMY.addClass('enemy');
        }, settings.enemyDisplaySpeed)
    }

    function _enemyMoving(settings) {
        setInterval(function () {
            const randomNum = Math.floor(Math.random() * ((settings.enemyAreaMax + 1) - settings.enemyAreaMin)) + settings.enemyAreaMin;
            const place_ENEMY = $(`[data-num="${randomNum}"]`).find('span');
            const place_ENEMY_ALREADY = place_ENEMY.hasClass('enemy');

            if (place_ENEMY_ALREADY) {
                place_ENEMY.removeClass('enemy');

                $(`[data-num="${randomNum + 5}"]`).find('span').addClass('enemy');
            }

        }, settings.enemyMovingSpeed)
    }

    _enemyGenerator(settings);
    _enemyMoving(settings);
}

//プレイヤーの処理
const moving = (settings) => {
    $('.game-controller span').on('click', function () {
        const place_NOW = $('.player').closest('.square').data('num');
        const squeare_LENGTH = $('.square').length;
        let place_NEXT = 0;
        let way = $(this).data('way');
    
        switch (way) {
            case 'up':
                place_NEXT = place_NOW - 5;
                break
            case 'left':
                place_NEXT = place_NOW - 1;
                break
            case 'right':
                place_NEXT = place_NOW + 1;
                break
            case 'down':
                place_NEXT = place_NOW + 5;
                break
        }

        // if (place_NEXT <= 0 || place_NEXT > squeare_LENGTH) {
        //     return false;
        // }
        if (place_NEXT < settings.playerAreaMin || place_NEXT > settings.playerAreaMax) {
            return false;
        }

        $('.player').removeClass('player');
        $(`[data-num="${place_NEXT}"]`).find('span').addClass('player');
    })

}

//勝ち負け判定の処理
const judgeGameControl = (settings) => {

    const _startJudgeTimer = (settings) => {
        const judgeTimer = setInterval(function () {
            $('.square span').each(function () {
                const $this = $(this);
                const playerFlag = $this.hasClass('player');
                const enemyFlag = $this.hasClass('enemy');
                const $endDisplay = $('.end-display');

                //負け
                if (playerFlag && enemyFlag) {
                    $endDisplay.addClass('lose');
                    $endDisplay.find('p').text('You are LOOSER!!!!');

                    _stopJudgeTimer();

                    $endDisplay.find('p').on('click', function () {
                        location.reload();
                    })
                } else {
                    //勝ち
                    const end_LENGTH = $('.end-game-box .square').has('.enemy').length;
                    if (end_LENGTH === settings.endLength) {
                        $endDisplay.addClass('win');
                        $endDisplay.find('p').text('You are WINNERR!!!!');

                        _stopJudgeTimer();

                        $endDisplay.find('p').on('click', function () {
                            location.reload();
                        })
                    }
                }
            });
        }, settings.judgeSpeed)
    }

    function _stopJudgeTimer() {
        clearInterval(judgeTimer);
    }

    _startJudgeTimer(settings);
}



//実行
$(function () {
    selectLevel();
});