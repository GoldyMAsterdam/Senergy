const menu = document.getElementById('Hamburber-Menu');
const body = document.body;
const nav = document.getElementById('dataSelection')
menu.addEventListener('click', ()=>{
    // if(body.style.backgroundColor == "red"){
    //     body.style.backgroundColor = "white";
    // }else{
    //     body.style.backgroundColor = "red";
    // }
    visibilityToggle(nav);
})

function visibilityToggle(Element){
    if(!(Element.style.visibility == 'visible')){
        Element.style.visibility = 'visible';
    }else{
        Element.style.visibility = 'hidden';
    }
}