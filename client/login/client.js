const handleLogin= (e) =>{
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() =='') {
        handleError("All fields are required");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize(), 'POST', "json", redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() ==''|| $("#pass2").val() =='') {
        handleError("All fields are required");
      return false;
    }

    if ($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match");
      return false;       
    }

    console.log($("input[name=_csrf]").val());

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize(), 'POST', "json", redirect);

    return false;
}

const LoginWindow = (props) => {
    return (
        <section id="login" className="container bg-white text-center mt-5">
        <form id="loginForm" name="loginForm" action="/login" method="POST" className="form-signin" onSubmit={handleLogin}>
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label for="username" className="sr-only">Username: </label>
        <input id="user" className="form-control" type="text" name="username" placeholder="username"/>
        <label for="pass" className="sr-only">Password: </label>
        <input id="pass" className="form-control" type="password" name="pass" placeholder="password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="btn btn-large btn-success" type="submit" value="Sign In" />
        </form>
        </section>
    );
};

const SignupWindow = (props) => {
    return (
        <section id="signup" className="container bg-white text-center mt-5">
        <form id="signupForm" name="signupForm" action="/signup" method="POST" className="form-signin" onSubmit={handleSignup}>
        <h1 className="h3 mb-3 font-weight-normal">Please create an account</h1>
        <label for="username" className="sr-only">Username: </label>
        <input id="user" className="form-control" type="text" name="username" placeholder="username"/>
        <label for="pass" className="sr-only">Password: </label>
        <input id="pass" className="form-control" type="password" name="pass" placeholder="password"/>
        <label for="pass2" className="sr-only">Password: </label>
        <input id="pass2" className="form-control" type="password" name="pass2" placeholder="retype password"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="btn btn-large btn-success" type="submit" value="Sign Up" />
        </form>
        </section>
    );
};

const createLoginWindow = (csrf) =>{
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

const createSignupWindow = (csrf) =>{
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

const setup=(csrf) => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('/getToken', null, 'GET', "json", (result) => {
        setup(result.csrf);
    });
};

$(document).ready(function() {
    getToken();
});