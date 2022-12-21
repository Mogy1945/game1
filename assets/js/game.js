

//難易度選択&ゲーム開始の処理
const selectLevel = (fn) => {
  let selectLevelFlag = false;
  let inputNameFlag = false;
  const settings = {
    //enemy設定
    enemyAreaStartWidth: 20,
    enemyAreaMin: 1,
    enemyAreaMax: 180,
    enemyDisplaySpeed: 0,
    enemyMovingSpeed: 0,
    //player設定
    playerAreaMin: 181,
    playerAreaMax: 200,
    attackSpeed: 1000, //attackの移動速度
    //コンピューター設定
    judgeSpeed: 500, //勝敗を監視する時間間隔
    collisionSpeed: 50, //enemyとattackの衝突を監視する時間間隔
    collisionBombTime: 500, //衝突の演出を監視する時間間隔
    endLength: 1,
    attackTargetNum: 15,
    setAttackSpeed: 1000, //attackの再装填時間
    survivalMode: false, //サバイバルモードのON/OFF
  };

  //難易度選択時の処理
  $("#level_selected").on("change", function () {
    const level = $(this).find(":selected").val();

    //レベル別初期設定
    switch (level) {
      case "easy":
        settings.enemyDisplaySpeed = 30;
        settings.enemyMovingSpeed = 30;

        selectLevelFlag = true;
        break;
      case "normal":
        settings.enemyDisplaySpeed = 20;
        settings.enemyMovingSpeed = 20;

        selectLevelFlag = true;
        break;
      case "hard":
        settings.enemyDisplaySpeed = 15;
        settings.enemyMovingSpeed = 15;

        selectLevelFlag = true;
        break;
      case "legend":
        settings.enemyDisplaySpeed = 10;
        settings.enemyMovingSpeed = 10;

        selectLevelFlag = true;
        break;
      case "survival":
        settings.enemyDisplaySpeed = 10;
        settings.enemyMovingSpeed = 10;
        settings.survivalMode = true;

        selectLevelFlag = true;
        break;
      default:
        alert("難易度を選択してください。");
        selectLevelFlag = false;
        break;
    }

    selectLevelFlag && inputNameFlag
      ? $(".game-starter").removeClass("disabled")
      : $(".game-starter").addClass("disabled");
  });

  //名前入力の処理
  $('.user-settings input').on('change', function () {
    const name = $(this).val();

    if (name.length > 0) {
      inputNameFlag = true;
    } else {
      inputNameFlag = false;
    }

    selectLevelFlag && inputNameFlag
      ? $(".game-starter").removeClass("disabled")
      : $(".game-starter").addClass("disabled");
  });

  //ゲーム開始の処理
  $(".game-start-btn").on("click", function () {
    const userName = $('#user-name').val();
    $(".point-display").show();
    $(".start-display").hide();
    $(".game-prev-box").hide();
    judgeGameControl(settings);
    enemyControl(settings);
    moving(settings);
    attackMoving(settings);
    collisionControl(settings);
    setAttackControl(settings);
    endGame(settings, fn, userName);
    //サバイバルモードの時は残機数テキストを初期化
    if (settings.survivalMode) {
      $(".point-display").find("span").text("撃破数");
      $(".point-display").find("p").text("0");
    }
  });
};

//エネミーの処理
const enemyControl = (settings) => {
  function _enemyGenerator(settings) {
    setInterval(function () {
      const randomNum =
        Math.floor(Math.random() * (settings.enemyAreaStartWidth + 1 - 1)) + 1;
      const place_ENEMY = $(`[data-num="${randomNum}"]`).find("span");
      const place_ENEMY_ALREADY = place_ENEMY.hasClass("enemy");

      if (place_ENEMY_ALREADY) {
        return false;
      }

      place_ENEMY.addClass("enemy");
    }, settings.enemyDisplaySpeed);
  }

  function _enemyMoving(settings) {
    setInterval(function () {
      const randomNum =
        Math.floor(
          Math.random() * (settings.enemyAreaMax + 1 - settings.enemyAreaMin)
        ) + settings.enemyAreaMin;
      const place_ENEMY = $(`[data-num="${randomNum}"]`).find("span");
      const place_ENEMY_ALREADY = place_ENEMY.hasClass("enemy");

      if (place_ENEMY_ALREADY) {
        place_ENEMY.removeClass("enemy");

        $(`[data-num="${randomNum + settings.enemyAreaStartWidth}"]`)
          .find("span")
          .addClass("enemy");
      }
    }, settings.enemyMovingSpeed);
  }

  _enemyGenerator(settings);
  _enemyMoving(settings);
};

//プレイヤーの処理
const moving = (settings) => {
  //キーボードをクリックしたとき
  $("body").on("keydown", function (e) {
    movingAction(e, "keydown");
    attackAction(e, "keydown");
  });

  // コントローラーをクリックしたとき
  $(".game-controller span").on("click", function () {
    movingAction($(this), "click");
  });

  //移動の処理
  const movingAction = ($this, enterWay) => {
    const place_NOW = $(".player").closest(".square").data("num");
    let place_NEXT = 0;
    let way = enterWay === "click" ? $this.data("way") : $this.key;

    switch (way) {
      case "up":
        place_NEXT = place_NOW - 5;
        break;
      case "left":
      case "ArrowLeft":
        place_NEXT = place_NOW - 1;
        break;
      case "right":
      case "ArrowRight":
        place_NEXT = place_NOW + 1;
        break;
      case "down":
        place_NEXT = place_NOW + 5;
        break;
    }

    // if (place_NEXT <= 0 || place_NEXT > squeare_LENGTH) {
    //     return false;
    // }
    if (
      place_NEXT < settings.playerAreaMin ||
      place_NEXT > settings.playerAreaMax
    ) {
      return false;
    }

    $(".player").removeClass("player");
    $(`[data-num="${place_NEXT}"]`).find("span").addClass("player");
  };

  //攻撃の処理
  const attackAction = ($this, enterWay) => {
    const place_NOW = $(".player").closest(".square").data("num");
    let place_Attack = 0;
    let way = enterWay === "click" ? $this.data("way") : $this.key;

    switch (way) {
      case "z":
        if (flagAttack && !flagEnd) {
          place_Attack = place_NOW - settings.enemyAreaStartWidth;
          $(`[data-num="${place_Attack}"]`).find("span").addClass("attack");
          flagAttack = false;
        }
        break;
      default:
    }
  };
};

//ミサイルの再装填時間を管理
const setAttackControl = (settings) => {
  setInterval(function () {
    if (!flagAttack) {
      flagAttack = true;
    }
  }, settings.setAttackSpeed);
};

//ミサイルの移動処理
const attackMoving = (settings) => {
  setInterval(function () {
    $(".attack").each(function () {
      const $attack = $(this);
      const $square = $attack.closest(".square");
      const place_NOW = $square.data("num");

      $attack.removeClass("attack");
      $(`[data-num="${place_NOW - settings.enemyAreaStartWidth}"]`)
        .find("span")
        .addClass("attack");
    });
  }, settings.attackSpeed);

};

//ミサイル当たり判定の処理
const collisionControl = (settings) => {
  setInterval(function () {
    if (!flagEnd) {
      $(".square span").each(function () {
        const $this = $(this);
        const attackFlag = $this.hasClass("attack");
        const enemyFlag = $this.hasClass("enemy");

        //あたり
        if (attackFlag && enemyFlag) {
          destroyNum++;
          if (leftNum === 0) {
            leftNum = 0;
          } else {
            leftNum--;
          }
          //サバイバルモードの時は撃破数、違う場合は敵の残機数
          if (settings.survivalMode) {
            $(".point-display").find("p").text(destroyNum);
          } else {
            $(".point-display").find("p").text(leftNum);
          }
          $this.removeClass("attack");
          $this.removeClass("enemy");
          $this.closest(".square").css("background-color", "red");
          setTimeout(function () {
            $this.closest(".square").css("background-color", "inherit");
          }, settings.collisionBombTime);
        }
      });
    }

  }, settings.collisionSpeed);
};

//勝ち負け判定の処理
const judgeGameControl = (settings) => {
  const _startJudgeTimer = (settings) => {
    const judgeTimer = setInterval(function () {
      $(".square span").each(function () {
        const $this = $(this);
        const playerFlag = $this.hasClass("player");
        const enemyFlag = $this.hasClass("enemy");
        const $endDisplay = $(".end-display");

        //playerとenemyが接触したら負け
        if (playerFlag && enemyFlag) {
          $endDisplay.addClass("lose");
          $endDisplay.find("p").text("You are LOOSER!!!!");
          flagEnd = true;

          _stopJudgeTimer();

        } else {
          const end_LENGTH = $(".end-game-box .square").has(".enemy").length;
          //enemyが最下部に到着したら負け
          if (end_LENGTH === settings.endLength) {
            $endDisplay.addClass("lose");
            $endDisplay.find("p").text("You are LOOSER!!!!");
            flagEnd = true;

            _stopJudgeTimer();
          }

          //撃破数が目標を上回ったら勝ち(サバイバルモードの時は勝ち無し)
          if (!settings.survivalMode) {
            if (settings.attackTargetNum <= destroyNum) {
              $endDisplay.addClass("win");
              $endDisplay.find("p").text("You are WINNERR!!!!");

              _stopJudgeTimer();

              $endDisplay.on("click", function () {
                location.reload();
              });
            }
          }

        }
      });
    }, settings.judgeSpeed);

    function _stopJudgeTimer() {
      clearInterval(judgeTimer);
    }
  };

  _startJudgeTimer(settings);
};


//ゲーム終了後の処理
const endGame = (settings, fn, userName) => {
  const $endDisplay = $(".end-display");
  //firebaseドキュメント追加
  const data = {
    name: userName,
    point: 0
  };
  //firebaseドキュメント追加

  $endDisplay.on("click", function () {
    //サバイバルモードの時だけランキングに記録
    if (settings.survivalMode) {
      data.point = Number($('.point-display').find('p').text());
      fn(data);
    }

    setTimeout(function () {
      location.reload();
    }, 1000);
  })
}
