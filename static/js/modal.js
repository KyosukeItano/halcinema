let pageCount = 1;
const guideImage = document.getElementById('img');
const nextBtn = document.getElementById('nextBtn');
const blackBg = document.getElementById('js-black-bg');
const closeBtn = document.getElementById('js-close-btn');
const showBtn = document.getElementById('js-show-popup');
const popup = document.getElementById('js-popup');
/* modalWindow 切り替え */
function popupImage() {
    if(!popup) return;

    closePopUp(blackBg);
    closePopUp(closeBtn);
    closePopUp(showBtn);
    function closePopUp(elem) {
        if(!elem) return;
        elem.addEventListener('click', function() {
            popup.classList.toggle('is-show');
        });
    }
}
popupImage();
/* 画像のリセット */
function imgReset(){
    guideImage.src = '../images/guide1.png';
    nextBtn.innerHTML = '次へ';
}
/* 画像の切り替え */
function nextPage() {
    if(pageCount === 2){
        nextBtn.innerHTML = '閉じる';
    }
    if(pageCount === 3){
        popup.classList.toggle('is-show');
        pageCount = 1;
        setTimeout("imgReset()", 600);
        return;
    }
    pageCount++;
    guideImage.src = '../images/guide'+ pageCount +'.png';
}
  
  