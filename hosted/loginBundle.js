"use strict";

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#kitMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("All fields are required");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize(), 'POST', "json", redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#kitMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize(), 'POST', "json", redirect);

    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "section",
        { id: "login", className: "container bg-white text-center mt-5" },
        React.createElement(
            "form",
            { id: "loginForm", name: "loginForm", action: "/login", method: "POST", className: "form-signin", onSubmit: handleLogin },
            React.createElement(
                "h1",
                { className: "h3 mb-3 font-weight-normal" },
                "Please sign in"
            ),
            React.createElement(
                "label",
                { "for": "username", className: "sr-only" },
                "Username: "
            ),
            React.createElement("input", { id: "user", className: "form-control", type: "text", name: "username", placeholder: "username" }),
            React.createElement(
                "label",
                { "for": "pass", className: "sr-only" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", className: "form-control", type: "password", name: "pass", placeholder: "password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "btn btn-large btn-success", type: "submit", value: "Sign In" })
        )
    );
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "section",
        { id: "signup", className: "container bg-white text-center mt-5" },
        React.createElement(
            "form",
            { id: "signupForm", name: "signupForm", action: "/signup", method: "POST", className: "form-signin", onSubmit: handleSignup },
            React.createElement(
                "h1",
                { className: "h3 mb-3 font-weight-normal" },
                "Please create an account"
            ),
            React.createElement(
                "label",
                { "for": "username", className: "sr-only" },
                "Username: "
            ),
            React.createElement("input", { id: "user", className: "form-control", type: "text", name: "username", placeholder: "username" }),
            React.createElement(
                "label",
                { "for": "pass", className: "sr-only" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", className: "form-control", type: "password", name: "pass", placeholder: "password" }),
            React.createElement(
                "label",
                { "for": "pass2", className: "sr-only" },
                "Password: "
            ),
            React.createElement("input", { id: "pass2", className: "form-control", type: "password", name: "pass2", placeholder: "retype password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "btn btn-large btn-success", type: "submit", value: "Sign Up" })
        )
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
    var loginButton = document.querySelector('#loginButton');
    var signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

var getToken = function getToken() {
    sendAjax('/getToken', null, 'GET', "json", function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $('#errorModal').modal();
};

var redirect = function redirect(response) {
  $("#kitMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

// function responsible for sending AJAX requests to our server
// the external Imgur request is handled in another function
var sendAjax = function sendAjax(action, data, type, dataType, success) {
  console.dir(data);
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: dataType,
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};
