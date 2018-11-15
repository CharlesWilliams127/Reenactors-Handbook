let linkCounter = 0;

// for use with the imgur API
const imgurClientID = '879ac2e671a727c';
const imgurClientSecret = '524c709be991cd1fc64f474056b8802ea09e18b0';

// get reference to masonry.js
// Credit: Masonry Library
let masonry;

const getLinkCount = () => {return linkCounter++;};

const counterStruct = {
  'Link': getLinkCount,
}

const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#kitMessage").animate({width:'toggle'},350);
}

// wrapper function to submit an image to imgur when posting
// will upload image to imgur if recipe upload was successful
// before calling default handler function
const makeImgurRequest = (image) => {
  return new Promise((resolve, reject) => {
      // Imgur upload
      if(image){
          const fd = new FormData();
          fd.append("image", image);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", "https://api.imgur.com/3/image.json");
          xhr.onload = () => {
              // this is the happy path, the image upload was successful
              if (xhr.status >= 200 && xhr.status < 300) {
                  console.dir("Image uploaded!");
                  console.dir(JSON.parse(xhr.responseText).data.link);
                  // resolve our promise, allowing our original POST to go through
                  resolve(xhr.responseText);
              }
              else {
                  reject({
                      status: xhr.status,
                      message: xhr.statusText
                  });
              }
          };
          xhr.onerror = () => {
              reject({
                  status: xhr.status,
                  message: xhr.statusText
              });
          }
          xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientID}`);
          // display loading widget
          displayHideSection('recipeSubmitLoading', 'block');
          xhr.send(fd);
      }
      else {
          resolve("");
      }
  });
}

// helper method for displaying or hiding a small section
const displayHideSection = (sectionID, displayStyle) => {
  const section = document.querySelector(`#${sectionID}`);
  section.style.display = displayStyle;
}

// creates a new field for the user to add to
const addItem = (e, list, elemName, value) => {
  const count = counterStruct[elemName]();
  const item = document.createElement('li');
  const deleteLabel= document.createElement('label');
  deleteLabel.classList.add('small-button--label');
  const deleteButton = document.createElement('input');
  deleteButton.classList.add('button');
  deleteButton.classList.add('button--close');
  deleteButton.classList.add('button--small');
  deleteButton.value = 'X';
  deleteButton.id = `deleteButton${count}`;
  deleteLabel.htmlFor = deleteButton.id;
  // attatch listener to delete button
  deleteButton.addEventListener('click', (e) => {
      list.removeChild(item);
  });
  item.innerHTML = `<input id="${elemName}${count}" class="text-input" type="text" name="${elemName}[${count}]" value="${value}"/>`;
  deleteLabel.appendChild(deleteButton);
  item.appendChild(deleteLabel);
  list.appendChild(item);
  
};

const sendAjax = (action, data) => {
  console.dir(data);
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      $("#kitMessage").animate({width:'hide'},350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
}

$(document).ready(() => {
  if(document.querySelector('#dynamicContent')) {
    // set up masonry content
    const grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
        columnWidth: 256,
        gutter: 10,
        itemSelector: '.grid-item',
    });

    // ensure that we only lay out grid when all images are loaded
    // Credit: ImagesLoaded Library
    imagesLoaded( '#grid', { background: true }, function() {
        masonry.layout();
    });

    masonry.layout();
  }

  $("#signupForm").on("submit", (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;           
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });
  
  $("#kitForm").on("submit", (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#kitName").val() == '') {
      handleError("Kit name is required");
      return false;
    }

    makeImgurRequest(document.querySelector('#imageField').files[0])
    .then((imageData) => {
      let image = "";

      if (imageData) {
          const data = JSON.parse(imageData).data;
          image = data.link;
      }

      return image;
    })
    .then((image) => {
      document.querySelector('#imageURL').value = image;
      sendAjax($("#kitForm").attr("action"), $("#kitForm").serialize());
    });

    return false;
  });

  $("#changePassForm").on("submit", (e)=> {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#newPass").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    if($("#pass").val() === $("#newPass").val()) {
      handleError("Passwords are the same");
      return false;
    }

    sendAjax($("#changePassForm").attr("action"), $("#changePassForm").serialize());

    return false;
  });

  

  $("#kitItemForm").on("submit", (e) => {
    e.preventDefault();

    document.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
   const imageF = document.querySelector('#itemImageField')
    $("#kitMessage").animate({width:'hide'},350);

    if($("#kitItemName").val() == '') {
      handleError("Kit name is required");
      return false;
    }

    makeImgurRequest(imageF.files[0])
    .then((imageData) => {
      let image = "";

      if (imageData) {
          const data = JSON.parse(imageData).data;
          image = data.link;
      }

      return image;
    })
    .then((image) => {
      document.querySelector('#itemImageURL').value = image;
      sendAjax($("#kitItemForm").attr("action"), $("#kitItemForm").serialize());
    });

    return false;
  });

  $('#addLinkButton').on("click", (e) => addItem(e, document.querySelector('#linkList'), 'Link', ""));
  $('#addKitForm').on("click", (e) => displayHideSection('makeKit', 'block'));
  $('#hideKitForm').on("click", (e) => displayHideSection('makeKit', 'none'));
});