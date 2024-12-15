let page =0;

carousel(page);
function carousel(idx){
    let imgArr = document.getElementsByClassName('imgs');
    let tot = imgArr.length;
    if(idx >= tot) page = idx = 0;
    if(idx < 0) page = idx = tot-1;
    for(let i =0;i<tot;i++){
        if(i === idx){
            imgArr[i].style.display = 'block';
            imgArr[i].style.opacity = 0.75;
            setTimeout(() => {
                imgArr[i].style.transition = 'opacity 1s ease';
                imgArr[i].style.opacity = 1;
            }, 50);
        }
        else imgArr[i].style.display = 'none';
    }
}

setInterval(nextPage,5000);


function nextPage(){
    page+=1;
    carousel(page);
}
