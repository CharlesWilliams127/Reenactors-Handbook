let masonry;

const ViewKitWindow = function(props) {
    return(
        <div className="backgroundArt">
            {props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
        <a className="navbar-brand" id="homeLogo" href="/home">Reenactors Handbook</a>
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
        </ul>
      </nav>}
      
    {!props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
        <a className="navbar-brand" id="homeLogo">Reenactors Handbook</a>
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
      </nav>}


        <div className="row">
            <div className="col-2 ml-auto side-ad ad">
            <div className="text-center container">
                <h1>Placeholder for an Ad</h1>
                <h2><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">This is where a link for the product I'm advertising would go. But don't click me, I don't do anything</a></h2>
            </div>
            </div>

        <div className="col-8">
            <section id="kits" className="container bg-light mt-5">
                <div className="kit">
                    <div className="kit">
                        <div className="jumbotron jumbotron-fluid">
                            <h2 className="kitName display-4">Name: <span id="viewKitName">{props.kit.name}</span></h2>
                            
                            {props.kit.startTimePeriod && <h4>Time Period: {props.kit.startTimePeriod}
                            {props.kit.endTimePeriod && <span> - {props.kit.endTimePeriod}</span>} </h4>}
                        </div>
                        <div className="row">
                        <div className="col-6">
                            {props.kit.image && <img src={props.kit.image} className="img-fluid" alt="My cool pic"></img>}
                        </div>
                        <div className="col-5">
                            {props.kit.description && <h5>Description: {props.kit.description}</h5>}
                        </div>
                        </div>
                        <hr/>

                        <div className="kit-items-expand" id="kitItemDisplay">
                        </div>

                    </div>
                    <hr/>

                    <div id="commentSection">
                    </div>
                </div>
            </section>
            </div>

            <div className="col-2 mr-auto side-ad ad">
            <div className="text-center container">
                <h1>Placeholder for an Ad</h1>
                <h2><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">This is where a link for the product I'm advertising would go. But don't click me, I don't do anything</a></h2>
            </div>
            </div>
        </div>
        </div>
    );
};

const handleKitComment = (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'}, 350);

    if($("#commentText").val() == '') {
        handleError("All fields are required");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax($("#kitCommentForm").attr("action"), $("#kitCommentForm").serialize(), 'POST', "json", redirect);

    return false;
}

const KitCommentsList = function(props) {
    let kitCommentNodes = null;

    if(props.kit.kitComments.length !== 0) {
        kitCommentNodes = props.kit.kitComments.map(function(kitComment) {
            return(
                <div className="row" key={kitComment._id}>
                    <div className="col-4">
                        <p>{kitComment.createdDate}</p>
                    </div>
                    <div className="col-8">
                        <h4>{kitComment.text}</h4>
                    </div>
                    <hr/>
                </div>
            );
        });
    }

    return(
        <div>
            {kitCommentNodes}

            <form id="kitCommentForm" name="kitCommentForm" action="/addKitComment" method="POST" className="text-center kitItemForm" onSubmit={handleKitComment}>
            <div className="form-row">
              <div className="form-group text-center mx-auto">
                <label htmlFor="commentText">Comment: </label>
                <textarea id="commentText" type="text" className="form-control" name="commentText"></textarea>
              </div>
            </div>
            <input type="hidden" id="newCsrf" name="_csrf" value={props.csrf} />
            <input type="hidden" id="itemImageURL" name="itemImageURL" value="" />
            <input type="hidden" name="parentKit" value={props.kit.name} />
            <input type="hidden" name="kitOwner" value={props.kit.owner}/>
            <input className="btn btn-outline-success text-center mx-auto" type="submit" value="Submit Comment" />
          </form>
        </div>
    )
}

const KitItemsList = function(props) {
    // return the empty display if the kit has no items
    if (props.kit.kitItems.length === 0) {
        return (
            <div className="row text-center">
            <div className="col">
              <h3>This Kit has no Items!</h3>
            </div>
          </div>
        );
      }

      // finally map the items to the proper JSX
      const kitItemNodes = props.kit.kitItems.map(function(kitItem) {
        // construct the links object to insert into the kit
        let kitItemLinks = null;
        if (kitItem.links.length !== 0) {
        kitItemLinks = kitItem.links.map(function(link) {
            return(
                <li><a href={link}>{link}</a></li>
            );
        }); 
        }

        return (
            <div className="row" key={kitItem._id}>
                <div className="col-4">
                {kitItem.image && <img src={kitItem.image} className="img-fluid" alt="My cool pic"></img>}
                </div>
                <div className="col-8">
                <h4>Item Name: {kitItem.name}</h4>
                {kitItem.price && <h5>Item Price: ${kitItem.price}</h5>}
                {kitItem.description && <h5>Item Description: {kitItem.description}</h5>}
                {kitItem.links && <div><h4>Links:</h4>
                    <ul id="linkList">
                        {kitItemLinks}
                    </ul>
                    </div>
                }
                </div>
                <hr/>
            </div>
          );
      });

      return (
          <div>
              {kitItemNodes}
          </div>
      );
      
};

const getViewer = (filterData, csrf, account) => {
    sendAjax('/getKitByOwner', filterData, 'GET', 'json', (data) => {
        // first render the kit
        ReactDOM.render(
            <ViewKitWindow kit={data.kit[0]} account={account}/>,
            document.querySelector('#content')
        );

        // first check if the kit has any items to render
        if(document.querySelector('#kitItemDisplay')) {
            // next, render the kit's items
            ReactDOM.render(
                <KitItemsList kit={data.kit[0]}/>,
                document.querySelector('#kitItemDisplay')
            );
        }

        ReactDOM.render(
            <KitCommentsList kit={data.kit[0]} csrf={csrf}/>,
            document.querySelector('#commentSection')
        );

        // attach event listeners
        addNavbarEventListeners(csrf, account);
    });
}

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
          {kit.endTimePeriod && <span> - <span id="kitEndTimePeriod">{kit.endTimePeriod}</span></span>} </h4>} 
          
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

const getKits = (csrf, account, filterData) => {
  sendAjax('/getKits', filterData, 'GET', "json", (data) => {
      ReactDOM.render(
        <KitList kits={data.kits} csrfToken={csrf}/>,
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
          const kitCsrf = document.querySelector('#csrf').value;
          const kitData = `name=${name}&owner=${owner}&csrf=${kitCsrf}`;

          //sendAjax('/viewer', kitData, "GET", "json", redirect);
          // call getViewer to handle getting the kit data
          getViewer(kitData, csrf, account);
        });
      }
  });
};

const HomeWindow = (props) => {
    return (
    <div>

            {props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
        <a className="navbar-brand" id="homeLogo" href="/home">Reenactors Handbook</a>
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
        </ul>
        <div className="form-inline my-2 my-lg-0 w-75" id="searchBar">
            <input className="form-control mr-sm-2 w-50" type="search" id="searchData" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="button" id="searchBarSubmit">Search</button>
        </div>
      </nav>}
      
    {!props.account && <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
        <a className="navbar-brand" id="homeLogo">Reenactors Handbook</a>
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
        <div className="form-inline my-2 my-lg-0 w-75" id="searchBar">
            <input className="form-control mr-sm-2 w-50" type="search" id="searchData" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="button" id="searchBarSubmit">Search</button>
        </div>
      </nav>}

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
const createHomeWindow = (csrf, account) => {
  ReactDOM.render(
      <HomeWindow account={account}/>,
      document.querySelector('#content')
  );

  getKits(csrf, account, null);
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
        <div className="backgroundArt">
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
        <a className="navbar-brand" id="homeLogo" href="/home">Reenactors Handbook</a>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" id="homeButton" href="/home">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="loginButton" href="/login">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="signupButton" href="/signup">Sign up</a>
          </li>
        </ul>
      </nav>
    
      <div className="container my-5">
        <div className="jumbotron jumbotron-fluid">
          <h3>I AM BECOME AD, DESTROYER OF PAGE LAYOUT</h3>
        </div>
      </div>

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
        </div>
    );
};

const SignupWindow = (props) => {
    return (
        <div className="backgroundArt">
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
        <a className="navbar-brand" id="homeLogo" href="/home">Reenactors Handbook</a>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" id="homeButton" href="/home">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="loginButton" href="/login">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="signupButton" href="/signup">Sign up</a>
          </li>
        </ul>
      </nav>
    
      <div className="container my-5">
        <div className="jumbotron jumbotron-fluid">
          <h3>I AM BECOME AD, DESTROYER OF PAGE LAYOUT</h3>
        </div>
      </div>
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
        </div>
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

// since we have to re-render the navbar each time we change page, we need to re-attach our event listeners
const addNavbarEventListeners = (csrf, account) => {
    // these should appear when a user is logged out
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    // these should appear when a user is logged in
    const logoutButton = document.querySelector('#logoutButton');
    const myKitsButton = document.querySelector('#myKitsButton');
    const changePassButton = document.querySelector('#changePassButton');

    // these should always appear
    const homeButton = document.querySelector('#homeButton');
    const homeLogo = document.querySelector('#homeLogo');

    if (signupButton && loginButton) {
        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            addNavbarEventListeners(csrf, account);
            return false;
        });

        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            addNavbarEventListeners(csrf, account);
            return false;
        });
    }

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createHomeWindow(csrf, account);
        addNavbarEventListeners(csrf, account);
        return false;
    });

    homeLogo.addEventListener("click", (e) => {
        e.preventDefault();
        createHomeWindow(csrf, account);
        addNavbarEventListeners(csrf, account);
        return false;
    });

    // set up search bar
    if (document.querySelector('#searchBarSubmit')) {
        document.querySelector('#searchBarSubmit').addEventListener('click', (e) => {
            getKits(csrf, account, `name=${document.querySelector('#searchData').value}`);
        });
    }
}

const setup=(csrf, account) => {
    createHomeWindow(csrf, account);
    addNavbarEventListeners(csrf, account);
};

const getAccount = (csrf) => {
    sendAjax('/getAccount', null, 'GET', "json", (result) => {
        setup(csrf, result.account);
    });
}

const getToken = () => {
    sendAjax('/getToken', null, 'GET', "json", (result) => {
        getAccount(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});