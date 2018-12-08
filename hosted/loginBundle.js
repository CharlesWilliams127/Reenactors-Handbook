"use strict";

var masonry = void 0;

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $('#errorModal').modal();
};

var redirect = function redirect(response) {
  $("#kitMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var KitList = function KitList(props) {
  if (props.kits.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No kits yet"
      )
    );
  }

  var kitNodes = props.kits.map(function (kit) {
    return React.createElement(
      "div",
      { className: "grid-item", key: kit._id },
      React.createElement("input", { type: "hidden", name: "kitOwner", id: "kitOwner", value: kit.owner }),
      React.createElement("input", { type: "hidden", name: "_csrf", id: "csrf", value: props.csrfToken }),
      React.createElement(
        "div",
        { className: "grid-item-overlay", id: "grid-item-overlay" },
        React.createElement(
          "h3",
          { className: "kitName text-center", id: "kitName" },
          kit.name
        ),
        kit.startTimePeriod && React.createElement(
          "h4",
          null,
          "Time Period: ",
          React.createElement(
            "span",
            { id: "kitStartTimePeriod" },
            kit.startTimePeriod
          ),
          kit.endTimePeriod && React.createElement(
            "span",
            null,
            kit.endTimePeriod,
            " - ",
            React.createElement(
              "span",
              { id: "kitEndTimePeriod" },
              kit.endTimePeriod
            )
          ),
          " "
        ),
        kit.description && React.createElement(
          "p",
          null,
          "Description: ",
          React.createElement(
            "span",
            { id: "kitDescription" },
            kit.description
          )
        )
      ),
      kit.image && React.createElement("img", { src: kit.image, className: "img-fluid", alt: "My cool pic" })
    );
  });

  return React.createElement(
    "div",
    { className: "kitList" },
    kitNodes
  );
};

// const navbar = function(props) {
//     return (
//         <div>
//         {props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
//         <a className="navbar-brand" id="homeButton" href="/home">Reenactors Handbook</a>
//         <ul className="navbar-nav mr-auto">
//           <li className="nav-item">
//             <a className="nav-link" id="homeButton" href="/home">Home</a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link"  href="/maker">My Kits</a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link" href="/logout">Logout</a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link" href="/changePass">Change Password</a>
//           </li>
//         </ul>
//       </nav>}

//     {!props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
//         <a className="navbar-brand" id="homeButton">Reenactors Handbook</a>
//         <ul className="navbar-nav mr-auto">
//           <li className="nav-item">
//             <a className="nav-link" id="homeButton" href="/home">Home</a>
//           </li>
//           <li className="nav-item text-right">
//             <a className="nav-link" id="loginButton" href="/login">Login</a>
//           </li>
//           <li className="nav-item text-right">
//             <a className="nav-link" id="signupButton" href="/signup">Sign up</a>
//           </li>
//         </ul>
//       </nav>}
//       </div>
//     );
// }

var getKits = function getKits() {
  sendAjax('/getKits', null, 'GET', "json", function (data) {
    ReactDOM.render(React.createElement(KitList, { kits: data.kits }), document.querySelector("#dynamicContent"));

    // set up masonry content
    var grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
      columnWidth: 410,
      gutter: 10,
      itemSelector: '.grid-item'
    });

    // ensure that we only lay out grid when all images are loaded
    // Credit: ImagesLoaded Library
    imagesLoaded('#grid', { background: true }, function () {
      masonry.layout();
    });

    masonry.layout();

    // assign event listeners to each object
    var kits = document.getElementsByClassName("grid-item");

    var _loop = function _loop(i) {
      kits[i].addEventListener('click', function (e) {
        e.preventDefault();

        var name = kits[i].querySelector('#kitName').innerHTML;
        var owner = kits[i].querySelector('#kitOwner').value;
        var csrf = document.querySelector('#csrf').value;
        var kitData = "name=" + name + "&owner=" + owner + "&csrf=" + csrf;

        sendAjax('/viewer', kitData, "GET", "json", redirect);
      });
    };

    for (var i = 0; i < kits.length; i++) {
      _loop(i);
    }
  });
};

var HomeWindow = function HomeWindow(props) {
  return React.createElement(
    "div",
    null,
    props.account && React.createElement(
      "nav",
      { className: "navbar navbar-expand-lg navbar-light bg-light" },
      React.createElement(
        "a",
        { className: "navbar-brand", id: "homeButton", href: "/home" },
        "Reenactors Handbook"
      ),
      React.createElement(
        "ul",
        { className: "navbar-nav mr-auto" },
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "homeButton", href: "/home" },
            "Home"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", href: "/maker" },
            "My Kits"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", href: "/logout" },
            "Logout"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", href: "/changePass" },
            "Change Password"
          )
        )
      )
    ),
    !props.account && React.createElement(
      "nav",
      { className: "navbar navbar-expand-lg navbar-light bg-light" },
      React.createElement(
        "a",
        { className: "navbar-brand", id: "homeButton" },
        "Reenactors Handbook"
      ),
      React.createElement(
        "ul",
        { className: "navbar-nav mr-auto" },
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "homeButton", href: "/home" },
            "Home"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item text-right" },
          React.createElement(
            "a",
            { className: "nav-link", id: "loginButton", href: "/login" },
            "Login"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item text-right" },
          React.createElement(
            "a",
            { className: "nav-link", id: "signupButton", href: "/signup" },
            "Sign up"
          )
        )
      )
    ),
    React.createElement(
      "section",
      { id: "header", className: "jumbotron" },
      React.createElement(
        "h1",
        { className: "display-4" },
        "Welcome to the Reenactors' Handbook"
      ),
      React.createElement(
        "p",
        { className: "lead" },
        "A resource for reenactors of all periods to share their kits and resources."
      ),
      React.createElement("hr", { className: "my-4" })
    ),
    React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-2 ml-auto side-ad ad" },
        React.createElement(
          "div",
          { className: "text-center" },
          React.createElement(
            "h1",
            null,
            "Placeholder for an Ad"
          ),
          React.createElement(
            "h2",
            null,
            React.createElement(
              "a",
              { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
              "This is where a link for the product I'm advertising would go. But don't click me, I don't do anything"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-8" },
        React.createElement(
          "section",
          { className: "grid" },
          React.createElement("div", { id: "dynamicContent" })
        )
      ),
      React.createElement(
        "div",
        { className: "col-2 mr-auto side-ad ad" },
        React.createElement(
          "div",
          { className: "text-center" },
          React.createElement(
            "h1",
            null,
            "Placeholder for an Ad"
          ),
          React.createElement(
            "h2",
            null,
            React.createElement(
              "a",
              { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
              "This is where a link for the product I'm advertising would go. But don't click me, I don't do anything"
            )
          )
        )
      )
    )
  );
};

// add account passing to this
var createHomeWindow = function createHomeWindow(account) {
  ReactDOM.render(React.createElement(HomeWindow, { account: account }), document.querySelector('#content'));

  getKits();
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
    "div",
    { className: "backgroundArt" },
    React.createElement(
      "nav",
      { className: "navbar navbar-expand-lg navbar-light bg-light" },
      React.createElement(
        "a",
        { className: "navbar-brand", href: "/home" },
        "Reenactors Handbook"
      ),
      React.createElement(
        "ul",
        { className: "navbar-nav mr-auto" },
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "homeButton", href: "/home" },
            "Home"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "loginButton", href: "/login" },
            "Login"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "signupButton", href: "/signup" },
            "Sign up"
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "container my-5" },
      React.createElement(
        "div",
        { className: "jumbotron jumbotron-fluid" },
        React.createElement(
          "h3",
          null,
          "I AM BECOME AD, DESTROYER OF PAGE LAYOUT"
        )
      )
    ),
    React.createElement(
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
    )
  );
};

var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "div",
    { className: "backgroundArt" },
    React.createElement(
      "nav",
      { className: "navbar navbar-expand-lg navbar-light bg-light" },
      React.createElement(
        "a",
        { className: "navbar-brand", href: "/home" },
        "Reenactors Handbook"
      ),
      React.createElement(
        "ul",
        { className: "navbar-nav mr-auto" },
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "homeButton", href: "/home" },
            "Home"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "loginButton", href: "/login" },
            "Login"
          )
        ),
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "a",
            { className: "nav-link", id: "signupButton", href: "/signup" },
            "Sign up"
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "container my-5" },
      React.createElement(
        "div",
        { className: "jumbotron jumbotron-fluid" },
        React.createElement(
          "h3",
          null,
          "I AM BECOME AD, DESTROYER OF PAGE LAYOUT"
        )
      )
    ),
    React.createElement(
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
    )
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};

// since we have to re-render the navbar each time we change page, we need to re-attach our event listeners
var addNavbarEventListeners = function addNavbarEventListeners(csrf, account) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');
  var homeButton = document.querySelector('#homeButton');
  // const homeLogo = document.querySelector('#homeLogo');

  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    addNavbarEventListeners(csrf, account);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    addNavbarEventListeners(csrf, account);
    return false;
  });

  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createHomeWindow(account);
    addNavbarEventListeners(csrf, account);
    return false;
  });

  // homeLogo.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     createHomeWindow(account);
  //     return false;
  // });
};

var setup = function setup(csrf, account) {
  createHomeWindow(account);
  addNavbarEventListeners(csrf, account);
};

var getAccount = function getAccount(csrf) {
  sendAjax('/getAccount', null, 'GET', "json", function (result) {
    setup(csrf, result.account);
  });
};

var getToken = function getToken() {
  sendAjax('/getToken', null, 'GET', "json", function (result) {
    getAccount(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";
