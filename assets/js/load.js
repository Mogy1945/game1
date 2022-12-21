//フィールドを生成する処理
const squareGenerater = () => {
    // 管理者設定 //
    const squareSettings = {
        row: 10, //行
        column: 20, //列
    };
    // 管理者設定 //
    let destData = "";
    let td_num = 0;

    for (let i = 1; i <= squareSettings.row; i++) {
        if (i === squareSettings.row) {
            destData += '<tr class="end-game-box">';
        } else {
            destData += "<tr>";
        }
        for (let i = 1; i <= squareSettings.column; i++) {
            destData += `<td class="square" data-num="${i + td_num
                }"><span></span></td>`;
            if (i === 20) {
                td_num += 20;
            }
        }
        destData += "</tr>";
    }
    $(".square-table").append(destData);

    //プレイヤーセット
    $("tr:last-of-type td:last-of-type").addClass("player");
};

//ランキングを生成
const rankingControl = () => {

    const $arr = $('.game-ranking ul li').sort(function (a, b) {
        return (Number($(a).find('.game-points').text()) < Number($(b).find('.game-points').text()) ? 1 : -1);  //ソート条件
    });

    $('.game-ranking ul li').remove();

    //ソートした結果をコンソールに出力する
    const topFive = $arr.splice(0,5);
    $.each(topFive,function(){
        $('.game-ranking ul').append($(this));
    })
}
