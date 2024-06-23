let imgList = Array.from(document.querySelectorAll('.photo img')),
    lightContainer = document.querySelector('.overlayPhoto'),
    lightItem = document.querySelector('.light-item'),
    btnExit = document.getElementById('exit'),
    btnRight = document.getElementById('arrow-right'),
    btnLeft = document.getElementById('arrow-left'),
    currentIndex = '';

for (let i = 0; i < imgList.length; i++) {
    imgList[i].addEventListener('click',function(e){
        currentIndex = imgList.indexOf(e.target)
        let currentSrc = e.target.getAttribute('src')
        lightItem.style.cssText = `
            background-image: url('${currentSrc}');
        `
        lightContainer.classList.replace('d-none','d-flex')
    })
}
/* Exit */
btnExit.addEventListener('click',function(){
    lightContainer.classList.replace('d-flex','d-none')
})
document.addEventListener('click',function(e){
    if(e.target == lightContainer){
        lightContainer.classList.replace('d-flex','d-none')
    }
})
document.addEventListener('keydown', (e)=>{
    if(e.key == "Escape"){
        lightContainer.classList.replace('d-flex','d-none')
    }
})
/* Exit */

/* Next */
btnRight.addEventListener('click',function(e){
    currentIndex++

    if(currentIndex == imgList.length){
        currentIndex = 0
    }

    let currentNextSrc = imgList[currentIndex].getAttribute('src')
    lightItem.style.cssText = `
        background-image: url('../${currentNextSrc}');
    `

})
/* Next */

/* Prev */
btnLeft.addEventListener('click',function(e){
    currentIndex--

    if(currentIndex < 0){
        currentIndex = imgList.length - 1
    }

    let currentNextSrc = imgList[currentIndex].getAttribute('src')
    lightItem.style.cssText = `
        background-image: url('../${currentNextSrc}');
    `

})
/* Prev */