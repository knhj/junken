$(document).ready(function () {
    /////////////////////////////////////

    var cnt_win = 0;
    var cnt_lose = 0;
    var cnt_draw = 0;

    var battle = new Audio("sound/RSBeatthemup.mp3");
    var kati = new Audio("sound/sword-slash1.mp3");
    var make = new Audio("sound/katana-slash4.mp3");
    var aiko = new Audio("sound/sword-clash2.mp3");
    var winner = new Audio("sound/winner.mp3");
    var loser = new Audio("sound/loser.mp3");

    var bnum = "";

    //敵のだす手→最初は1/3づつ
    var enemy_select = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2];

    /////////////////////////
    //じゃんけん部分の関数
    //ここではグー：０、チョキ：１、パー：２とする。
    function janken(e) {
        //   var rand = Math.floor(Math.random()*3 ) ; //012ランダム randは敵のだした手
        var rand = enemy_select[Math.floor(Math.random() * enemy_select.length)];
        var diff = (e - rand + 3) % 3; //diff 勝ち：２ あいこ：０ 負け：１で返す

        if (rand == 0 && diff == 1) {
            enemy_select.push(0);
        } else if (rand == 1 && diff == 1) {
            enemy_select.push(1);
        } else if (rand == 2 && diff == 1) {
            enemy_select.push(2);
        } else if (rand == 0 && diff == 2) {
            enemy_select.push(1);
            enemy_select.push(2);
        } else if (rand == 1 && diff == 2) {
            enemy_select.push(2);
            enemy_select.push(0);
        } else if (rand == 2 && diff == 2) {
            enemy_select.push(1);
            enemy_select.push(0);
        }

        var gu_num = 0;
        var cho_num = 0;
        var pa_num = 0;

        for (var i = 0; i < enemy_select.length; i++) {
            if (enemy_select[i] == 0) {
                gu_num++;
            } else if (enemy_select[i] == 1) {
                cho_num++;
            } else if (enemy_select[i] == 2) {
                pa_num++;
            }
        }

        $('#num1').text(Math.floor(gu_num / enemy_select.length * 100) + "%");
        $('#num2').text(Math.floor(cho_num / enemy_select.length * 100) + "%");
        $('#num3').text(Math.floor(pa_num / enemy_select.length * 100) + "%");

        var obj = {
            opp: rand,  //相手の手を返す
            result: diff    //勝ち負けの結果を返す
        }
        return obj;
    }

    //結果に対するメッセージとキャラの反応を返す
    function resultmess(e) {
        var aiko_img = [
            '<img src="img/005.png" alt="あいこ" >',
            '<img src="img/035.png" alt="あいこ" >'
        ];
        var kati_img = [
            '<img src="img/020.png" alt="ぐぬぬ" >',
            '<img src="img/018.png" alt="ショボーン" >'
        ];
        var make_img = [
            '<img src="img/017.png" alt="やった" >',
            '<img src="img/019.png" alt="はい負け" >'
        ];
        if (e == 0) {
            var obj = {
                msg: "あいこです。",
                msgimg: aiko_img[Math.floor(Math.random() * aiko_img.length)]
            }
            return obj;
        } else if (e == 2) {
            var obj = {
                msg: "あなたの勝ちです。",
                msgimg: kati_img[Math.floor(Math.random() * kati_img.length)]
            }
            return obj;
        } else if (e == 1) {
            var obj = {
                msg: "あなたの負けです。",
                msgimg: make_img[Math.floor(Math.random() * make_img.length)]
            }
            return obj;
        }
    }

    //キャラの出す手を返す
    function opponent(e) {
        var gu_img = [
            '<img src="img/002.png" alt="ぐー" >',
            '<img src="img/006.png" alt="ぐー2" >'
        ];
        var pa_img = [
            '<img src="img/004.png" alt="ぱー" >',
            '<img src="img/008.png" alt="パー2" >'
        ];
        var cho_img = [
            '<img src="img/003.png" alt="ちょき" >',
            '<img src="img/007.png" alt="チョキ2" >'
        ];

        if (e == 0) {
            return gu_img[Math.floor(Math.random() * gu_img.length)];
        } else if (e == 2) {
            return pa_img[Math.floor(Math.random() * pa_img.length)];
        } else if (e == 1) {
            return cho_img[Math.floor(Math.random() * cho_img.length)];
        }
    }

    //メイン部分の関数
    function main(e) {
        var OppResult = janken(e);

        // console.log(OppResult.result);
        var Resultmsg = resultmess(OppResult.result);
        $('#result_text').text(Resultmsg.msg);
        var Oppnent = opponent(OppResult.opp);
        $("#topimg").html(Oppnent);
        $('.btn').css("pointer-events", "none");

        setTimeout(function () {
            $("#topimg").html(Resultmsg.msgimg);
            $('.btn').css("pointer-events", "");
        }, 800);

        if (OppResult.result == 2) {
            kati.play();
            cnt_win++;
            $('#win').text(cnt_win);
        } else if (OppResult.result == 1) {
            make.play();
            cnt_lose++;
            $('#lose').text(cnt_lose);
        } else if (OppResult.result == 0) {
            aiko.play();
            cnt_draw++;
            $('#draw').text(cnt_draw);
        }

        if (cnt_win == bnum) {
            setTimeout(function () {
                $("#topimg").html('<img src="img/033.png" alt="強い・・・" >');
            }, 1000);
            battle.pause();
            winner.play();
            $(".modal").css("display", "block");
            $('#mess2').text("YOU WIN!!");
            $('#mess4').html('<div>もう一回する?</div>');
        } else if (cnt_lose == bnum) {
            setTimeout(function () {
                $("#topimg").html('<img src="img/034.png" alt="弱い・・・" >');
            }, 1000);
            battle.pause();
            loser.play();
            $(".modal").css("display", "block");
            $('#mess2').text("YOU LOSE");
            $('#mess4').html('<div>もう一回する?</div>');
        }

    }

    //一番最初のクリックからの画面変化
    function start() {
        battle.play();
        $(".modal").css("display", "none");
        $('#mess').css("display", "none");
        $('#mess3').css("display", "none");
        $('.flex').css("display", "none");
        $('.btn').css("pointer-events", "none");

        setTimeout(function () {
            $('#firstimg').fadeIn();
            $("#firstimg").fadeOut();
        }, 500);

        setTimeout(function () {
            $("#secondimg").fadeIn();
            $("#secondimg").fadeOut();
        }, 1500);

        setTimeout(function () {
            $("#thirdimg").fadeIn();
            $('.btn').css("pointer-events", "");
        }, 2500);

    }


    //ここから最初に実行される
    $("#three").on("click", function () {
        bnum = 3;
        start();
    });

    $("#five").on("click", function () {
        bnum = 5;
        start();

    });

    $("#ten").on("click", function () {
        bnum = 10;
        start();
    });




    //クリック発火イベント
    $(".gu").on("click", function () {
        var myhand = 0;
        main(myhand);
    });

    $(".choki").on("click", function () {
        var myhand = 1;
        main(myhand);
    });

    $(".pa").on("click", function () {
        var myhand = 2;
        main(myhand);
    });

    //結果終了後のリロード
    $("#mess4").on("click", function () {
        location.reload();
    });

    ///////////////////////
});