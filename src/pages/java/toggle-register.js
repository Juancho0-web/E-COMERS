document.getElementById('toggle-password1').addEventListener('click',function(){
    const passwordInput1 =document.getElementById('password-confirm');
    const eyeOpen1 = document.getElementById('eye-icon-open1');
    const eyeClosed1 = document.getElementById('eye-icon-closed1');

    const isHidden = passwordInput1.type =='password';

    passwordInput1.type=isHidden ? 'text':'password';

    eyeOpen1.classList.toggle('hidden',!isHidden);
    eyeClosed1.classList.toggle('hidden', isHidden);
});