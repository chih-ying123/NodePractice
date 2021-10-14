async function loginfunction() {
        let open_login = document.getElementById('open_login');
        let hide_login = document.getElementById('hide_login');
        let close_login = document.getElementById('close_login');
        let sign_out = document.getElementById('sign_out');
   

        open_login.addEventListener('click', function(){
            hide_login.style.display='block';
        })
        close_login.addEventListener('click', function(){
            hide_login.style.display='none';
        })
        sign_out.addEventListener('click',async function(){
            let response = await fetch('/member/signout');
            let jsonData = await response.json();

            window.location.reload();
        });
};
loginfunction();

//let memberLoginForm = document.getElementById('memberLoginForm');
    memberLoginForm.addEventListener('submit', async function(e) {

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let postBody = `email=${email}&password=${password}`;

        e.preventDefault();

        let postOptions = {
            method: 'POST',
            body: postBody,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        let action = memberLoginForm.action;

        let response = await fetch(action, postOptions);
        let jsonData = await response.json();

        if ( jsonData.resultCode === 0 ) {
            alert( jsonData.resultMessage );
            hide_login.style.display='none';
            open_login.style.display='none';
            sign_out.style.display='block';
            isLogin();
        }
        else {
            alert( jsonData.resultMessage );
        }
            
    });

    async function isLogin() {
            
        let response = await fetch('/member/info');
        let jsonData = await response.json();
        

        if ( jsonData.resultCode === 0 ) {
            
            open_login.style.display='none';
            sign_out.style.display='block';
        }

    };
    isLogin()



