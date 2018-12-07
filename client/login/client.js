let masonry;

const handleError = (message) => {
    $("#errorMessage").text(message);
    $('#errorModal').modal();
  }

const redirect = (response) => {
    $("#kitMessage").animate({width:'hide'}, 350);
    window.location = response.redirect;
};

const KitList = function(props) {
  if (props.kits.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No kits yet</h3>
      </div>
    );
  }

  const kitNodes = props.kits.map(function(kit) {
    return (
      <div className="grid-item" key={kit._id}>
        <input type="hidden" name="kitOwner" id="kitOwner" value={kit.owner} />
        <input type="hidden" name="_csrf" id="csrf" value={props.csrfToken} />
        <div className="grid-item-overlay" id="grid-item-overlay">
          <h3 className="kitName text-center" id="kitName">{kit.name}</h3>
          {kit.startTimePeriod && <h4>Time Period: <span id="kitStartTimePeriod">{kit.startTimePeriod}</span> 
          {kit.endTimePeriod && <span>{kit.endTimePeriod} - <span id="kitEndTimePeriod">{kit.endTimePeriod}</span></span>} </h4>} 
          
          {kit.description && <p>Description: <span id="kitDescription">{kit.description}</span></p>}
        </div>
        {kit.image && <img src={kit.image} className="img-fluid" alt="My cool pic"></img>}
      </div>
    )
  });

  return (<div className="kitList">
    {kitNodes}
  </div>);
};

const getKits = () => {
  sendAjax('/getKits', null, 'GET', "json", (data) => {
      ReactDOM.render(
        <KitList kits={data.kits} />,
        document.querySelector("#dynamicContent")
      );

      // set up masonry content
      const grid = document.querySelector('#dynamicContent');
      masonry = new Masonry(grid, {
          columnWidth: 410,
          gutter: 10,
          itemSelector: '.grid-item',
      });

      // ensure that we only lay out grid when all images are loaded
      // Credit: ImagesLoaded Library
      imagesLoaded( '#grid', { background: true }, function() {
          masonry.layout();
      });

      masonry.layout();

      // assign event listeners to each object
      const kits = document.getElementsByClassName("grid-item");

      for(let i = 0; i < kits.length; i++) {
        kits[i].addEventListener('click', (e) => {
          e.preventDefault();

          const name = kits[i].querySelector('#kitName').innerHTML;
          const owner = kits[i].querySelector('#kitOwner').value;
          const csrf = document.querySelector('#csrf').value;
          const kitData = `name=${name}&owner=${owner}&csrf=${csrf}`;

          sendAjax('/viewer', kitData, "GET", "json", );
        });
      }
  });
};

const HomeWindow = () => {
    return (
    <div>
      {/* {props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
          <a className="navbar-brand" id="homeButton" href="/home">Reenactors Handbook</a>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" id="homeButton" href="/home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"  href="/maker">My Kits</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/logout">Logout</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/changePass">Change Password</a>
            </li>
          </ul>
        </nav>}
        
      {!props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
          <a className="navbar-brand" id="homeButton" href="/home">Reenactors Handbook</a>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" id="homeButton" href="/home">Home</a>
            </li>
            <li className="nav-item text-right">
              <a className="nav-link" id="loginButton" href="/login">Login</a>
            </li>
            <li className="nav-item text-right">
              <a className="nav-link" id="signupButton" href="/signup">Sign up</a>
            </li>
          </ul>
        </nav>} */}
  
    <section id="header" className="jumbotron">
      <h1 className="display-4">Welcome to the Reenactors' Handbook</h1>
      <p className="lead">A resource for reenactors of all periods to share their kits and resources.</p>
      <hr className="my-4"/>
    </section>
  
  
    <div className="row">
      <div className="col-2 ml-auto side-ad ad">
        <div className="text-center">
          <h1>Placeholder for an Ad</h1>
          <h2><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">This is where a link for the product I'm advertising would go. But don't click me, I don't do anything</a></h2>
        </div>
      </div>
  
      <div className="col-8">
        <section className="grid">
          <div id="dynamicContent">
          </div>
        </section>
      </div>
  
      <div className="col-2 mr-auto side-ad ad">
        <div className="text-center">
          <h1>Placeholder for an Ad</h1>
          <h2><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">This is where a link for the product I'm advertising would go. But don't click me, I don't do anything</a></h2>
        </div>
      </div>
    </div>
    </div>
    );
  };

// add account passing to this
const createHomeWindow = (csrf) => {
  ReactDOM.render(
      <HomeWindow/>,
      document.querySelector('#content')
  );

  getKits();
};

// function responsible for sending AJAX requests to our server
// the external Imgur request is handled in another function
const sendAjax = (action, data, type, dataType, success) => {
    console.dir(data);
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: dataType,
      success: success,
      error: (xhr, status, error) => {
        const messageObj = JSON.parse(xhr.responseText);
  
        handleError(messageObj.error);
      }
    });        
  };

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
    const homeButton = document.querySelector('#homeButton');

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

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createHomeWindow(csrf);
        return false;
    });

    createHomeWindow(csrf);
};

const getToken = () => {
    sendAjax('/getToken', null, 'GET', "json", (result) => {
        setup(result.csrf);
    });
};

$(document).ready(function() {
    getToken();
});