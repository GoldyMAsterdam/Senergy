const menu = document.getElementById('Hamburber-Menu');
const body = document.body;
menu.addEventListener('click', ()=>{
    if(body.style.backgroundColor == "red"){
        body.style.backgroundColor = "white";
    }else{
        body.style.backgroundColor = "red";
    }
})