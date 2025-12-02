//funcion de visibilidad del ojito

document.getElementById('toggle-password').addEventListener('click',function(){
    const passwordInput=document.getElementById('password');
    const eyeOpen=document.getElementById('eye-icon-open');
    const eyeClosed=document.getElementById('eye-icon-closed');

    //verificacion y la contraseña esta oculta 

    const isHidden =passwordInput.type==='password';

    //Cambiar del password a texto 

    passwordInput.type=isHidden ? 'text':'password';

    //Alteracion de iconos segun el estado

    eyeOpen.classList.toggle('hidden',!isHidden);
    eyeClosed.classList.toggle('hidden', isHidden);
});
