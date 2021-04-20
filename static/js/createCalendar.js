// https://qiita.com/kan_dai/items/b1850750b883f83b9bee


const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()
//dateobject.getFullYear() 地方に基づいてyyyyでreturn
let year = date.getFullYear()
//0 ~ 11 を return するから1をタス
let month = date.getMonth() + 1
//カレンダーの数を設定する変数
const config = {
    show: 2,
}
// configオブジェクトのshowプロパティをconsole.log()
// console.log(config.show);

// ----------変数------------------------------------
// weeks ['日', '月', '火', '水', '木', '金', '土']
// year 2020
// month 7
// config {show:2}

// year,month変数を引数としてshowCalendarを実行
function showCalendar(year, month) {
    //カレンダーをいくつ作るか configオブジェクトのshowプロパティで設定
    for (i = 0; i < config.show; i++) {
        //calendarHTMLにカレンダーtableを作成 自分で定義したcreateCalendarを使用
        const calendarHtml = createCalendar(year, month)
        //変数secにcreateElement('section')
        const sec = document.createElement('section')
        //変数secのinnerHTMLをcalenderHTMLに
        sec.innerHTML = calendarHtml
        //元々あるhtmlのid calendarに作ったsecを追加(appnedChild)
        document.querySelector('#calendar').appendChild(sec)

        //月変数に1をたす
        month++
        //月が13月にならないようにmonth変数が12になった時に月を1にして年をリセット
        if (month > 12) {
            year++
            month = 1
        }
    }
}

function createCalendar(year, month) {
    // monthは0スタートなので最初に足した1ぶんここで引いている
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    //date()の第三引数を0にすると指定月の前月の最終日が取得できる
    const endDate = new Date(year, month, 0) // 月の最後の日を取得

    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 2, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数

    // ----------変数------------------------------------
    // weeks ['日', '月', '火', '水', '木', '金', '土']
    // year 2020
    // month 7
    // endDayCount 31

    calendarHtml += '<h3>' + year + '/' + month + '</h3>'
    calendarHtml += '<table>'

    // 曜日の行(1行目)を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td>' + weeks[i] + '</td>'
    }

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>'

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                calendarHtml += '<td class="is-disabled"> ー </td>'
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                calendarHtml += '<td class="is-disabled"> ー </td>'
                dayCount++
            } else {
                calendarHtml += `<td class="calendar_td" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`
                dayCount++
            }
        }
        calendarHtml += '</tr>'
    }
    calendarHtml += '</table>'

    return calendarHtml
}

function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = ''

    if (e.target.id === 'prev') {
        month--

        if (month < 1) {
            year--
            month = 12
        }
    }

    if (e.target.id === 'next') {
        month++

        if (month > 12) {
            year++
            month = 1
        }
    }

    showCalendar(year, month)
}

//moveCalenderメソッドを#prevをクリックしたら実行
document.querySelector('#prev').addEventListener('click', moveCalendar)
//moveCalenderメソッドを#prevをクリックしたら実行
document.querySelector('#next').addEventListener('click', moveCalendar)

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("calendar_td")) {
        alert('クリックした日付は' + e.target.dataset.date + 'です')
        const pathDate = e.target.dataset.date.replace(/\//g, "-")
        window.location.href = `/admin/screen_schedule/${pathDate}`;
    }
})

// 最初にページにアクセスした時にshowCalendarを実行
showCalendar(year, month)