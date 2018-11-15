let linkCounter = 0;

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

    sendAjax($("#kitForm").attr("action"), $("#kitForm").serialize());

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

    $("#kitMessage").animate({width:'hide'},350);

    if($("#kitItemName").val() == '') {
      handleError("Kit name is required");
      return false;
    }

    sendAjax($("#kitItemForm").attr("action"), $("#kitItemForm").serialize());

    return false;
  });

  $('#addLinkButton').on("click", (e) => addItem(e, document.querySelector('#linkList'), 'Link', ""));
  $('#addKitForm').on("click", (e) => displayHideSection('makeKit', 'block'));
  $('#hideKitForm').on("click", (e) => displayHideSection('makeKit', 'none'));
});