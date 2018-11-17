'use strict';

var linkCounter = 0;

// for use with the imgur API
var imgurClientID = '879ac2e671a727c';
var imgurClientSecret = '524c709be991cd1fc64f474056b8802ea09e18b0';

// get reference to masonry.js
// Credit: Masonry Library
var masonry = void 0;

var getLinkCount = function getLinkCount() {
  return linkCounter++;
};

var counterStruct = {
  'Link': getLinkCount
};

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $('#errorModal').modal();
};

// wrapper function to submit an image to imgur when posting
// will upload image to imgur if recipe upload was successful
// before calling default handler function
var makeImgurRequest = function makeImgurRequest(image) {
  return new Promise(function (resolve, reject) {
    // Imgur upload
    if (image) {
      var fd = new FormData();
      fd.append("image", image);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image.json");
      xhr.onload = function () {
        // this is the happy path, the image upload was successful
        if (xhr.status >= 200 && xhr.status < 300) {
          console.dir("Image uploaded!");
          console.dir(JSON.parse(xhr.responseText).data.link);
          // resolve our promise, allowing our original POST to go through
          resolve(xhr.responseText);
        } else {
          reject({
            status: xhr.status,
            message: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: xhr.status,
          message: xhr.statusText
        });
      };
      xhr.setRequestHeader('Authorization', 'Client-ID ' + imgurClientID);
      // display loading widget
      displayHideSection('recipeSubmitLoading', 'block');
      xhr.send(fd);
    } else {
      resolve("");
    }
  });
};

// helper method for displaying or hiding a small section
var displayHideSection = function displayHideSection(sectionID, displayStyle) {
  var section = document.querySelector('#' + sectionID);
  section.style.display = displayStyle;
};

// a function to handle the user clicking the edit button from
// within a Kit
var populateEditKitModal = function populateEditKitModal(item) {
  var kitModal = document.querySelector("#editKit");

  var name = kitModal.querySelector('#kitName');
  var desc = kitModal.querySelector('#kitDescription');
  var startTime = kitModal.querySelector('#kitStartTimePeriod');
  var endTime = kitModal.querySelector('#kitEndTimePeriod');
  var image = kitModal.querySelector('#imageURL');

  name.value = item.querySelector('#kitName').textContent;
  desc.value = item.querySelector('#kitDescription').textContent;
  startTime.value = item.querySelector('#kitStartTimePeriod').textContent;
  endTime.value = item.querySelector('#kitEndTimePeriod').textContent;
  image.value = item.querySelector('#kitImage').src;

  // change the header
  kitModal.querySelector('#editKitTitle').textContent = 'Editing ' + name.value;

  // display modal
  $('#editKit').modal();
};

// a function to handle the user clicking the edit button from
// within a Kit
var populateEditKitItemModal = function populateEditKitItemModal(recipe) {
  displayHideSection('addRecipe', 'block');

  var applianceList = document.querySelector('#applianceList');
  var directionList = document.querySelector('#directionList');
  var ingredientList = document.querySelector('#ingredientList');
  var titleField = document.querySelector('#titleField');
  var descField = document.querySelector('#descriptionField');
  var priceField = document.querySelector('#priceField');
  var caloriesField = document.querySelector('#caloriesField');

  if (recipe.appliances) {
    populateList(recipe.appliances, applianceList, 'Appliance');
  }
  if (recipe.directions) {
    populateList(recipe.directions, directionList, 'Direction');
  }
  if (recipe.ingredients) {
    populateList(recipe.ingredients, ingredientList, 'Ingredient');
  }

  titleField.value = recipe.title;
  descField.value = recipe.description;
  priceField.value = recipe.price;
  caloriesField.value = recipe.calories;

  // change the header
  document.querySelector('#addEditHeader').textContent = "Edit a Recipe";
};

// creates a new field for the user to add to
var addItem = function addItem(e, list, elemName, value) {
  var count = counterStruct[elemName]();
  var item = document.createElement('li');
  var deleteLabel = document.createElement('label');
  deleteLabel.classList.add('small-button--label');
  var deleteButton = document.createElement('input');
  deleteButton.classList.add('btn');
  deleteButton.classList.add('btn-sm');
  deleteButton.classList.add('btn-danger');
  deleteButton.classList.add('text-left');
  deleteButton.style.width = "28px";
  deleteButton.value = 'X';
  deleteButton.id = 'deleteButton' + count;
  deleteLabel.htmlFor = deleteButton.id;
  // attatch listener to delete button
  deleteButton.addEventListener('click', function (e) {
    list.removeChild(item);
  });
  item.innerHTML = '<input id="' + elemName + count + '" class="form-control" type="text" name="' + elemName + '[' + count + ']" value="' + value + '"/>';
  deleteLabel.appendChild(deleteButton);
  item.appendChild(deleteLabel);
  list.appendChild(item);
};

var sendAjax = function sendAjax(action, data, type, dataType) {
  console.dir(data);
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: dataType,
    success: function success(result, status, xhr) {
      $("#kitMessage").animate({ width: 'hide' }, 350);

      if (dataType == 'json') {
        window.location = result.redirect;
      }
      if (dataType == 'html') {
        $("body").html(result);
      }
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};

var updateImageField = function updateImageField(form, imageField, imageLabel) {
  var input = form.querySelector('#' + imageField);
  var label = form.querySelector('#' + imageLabel);
  if (input && label) {
    var labelVal = label.innerHTML;
    input.addEventListener('change', function (e) {
      if (input.files[0]) {
        label.innerHTML = input.files[0].name;
      } else {
        label.innerHTML = labelVal;
      }
    });
  }
};

// adds event listeners to things that change or add kits
var addKitModalEventListener = function addKitModalEventListener(kitForm, imageField) {
  var $kitForm = $(kitForm);

  $kitForm.on("submit", function (e) {
    e.preventDefault();

    $("#kitMessage").animate({ width: 'hide' }, 350);

    if (kitForm.querySelector("#kitName") == '') {
      handleError("Kit name is required");
      return false;
    }

    var imageF = kitForm.querySelector('#' + imageField);

    makeImgurRequest(imageF.files[0]).then(function (imageData) {
      var image = "";

      if (imageData) {
        var data = JSON.parse(imageData).data;
        image = data.link;
      }

      return image;
    }).then(function (image) {
      imageF.value = image;
      sendAjax($kitForm.attr("action"), $kitForm.serialize(), "POST", "json");
    });

    return false;
  });
};

$(document).ready(function () {
  if (document.querySelector('#dynamicContent')) {
    (function () {
      // set up masonry content
      var grid = document.querySelector('#dynamicContent');
      masonry = new Masonry(grid, {
        columnWidth: 470,
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
          var data = 'name=' + name + '&owner=' + owner + '&csrf=' + csrf;

          sendAjax('/viewer', data, "GET", "json");
        });
      };

      for (var i = 0; i < kits.length; i++) {
        _loop(i);
      }
    })();
  }

  // pull forms for modals to be used for submission and editing
  var addKitForm = document.querySelector("#kitForm");
  var editKitForm = document.querySelector("#editKitForm");
  var editKitItemForm = document.querySelector("editKitItemForm");

  // allow links to be added to kit items
  var linkButtons = document.getElementsByClassName("addLinkButton");
  if (linkButtons) {
    var _loop2 = function _loop2(i) {
      linkButtons[i].addEventListener("click", function (e) {
        return addItem(e, linkButtons[i].parentElement.parentElement, 'Link', "");
      });
    };

    for (var i = 0; i < linkButtons.length; i++) {
      _loop2(i);
    }
  }

  // attach event listeners on each kit on the myKits page
  var myKits = document.getElementsByClassName("kit");
  if (myKits) {
    var _loop3 = function _loop3(i) {
      myKits[i].querySelector('#deleteKitForm').addEventListener('submit', function (e) {
        e.preventDefault();

        var $kitForm = $(myKits[i].querySelector('#deleteKitForm'));

        sendAjax($kitForm.attr("action"), $kitForm.serialize(), "DELETE", "json");

        return false;
      });

      // attach kit event listener
      var editButton = myKits[i].querySelector('#editKitButton');
      var clickEdit = function clickEdit(e) {
        return populateEditKitModal(myKits[i]);
      };
      editButton.addEventListener('click', clickEdit);

      // attach event listeners to each item's edit and delete
      var myKitItems = myKits[i].getElementsByClassName("KitItem");
      if (myKitItems) {
        var _loop4 = function _loop4(j) {
          myKitItems[j].querySelector('#deleteKitItemForm').addEventListener('submit', function (e) {
            e.preventDefault();

            var $kitItemForm = $(myKitItems[j].querySelector('#deleteKitItemForm'));

            sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");

            return false;
          });
        };

        for (var j = 0; j < myKitItems.length; j++) {
          _loop4(j);
        }
      }
    };

    for (var i = 0; i < myKits.length; i++) {
      _loop3(i);
    }
  }

  $("#signupForm").on("submit", function (e) {
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

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize(), "POST", "json");

    return false;
  });

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    $("#kitMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
      handleError("Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize(), "POST", "json");

    return false;
  });

  // handles attatching listeners to edit and add kits
  addKitModalEventListener(document.querySelector("#kitForm"), "imageField");
  addKitModalEventListener(document.querySelector("#editKitForm"), "editImageField");

  $("#changePassForm").on("submit", function (e) {
    e.preventDefault();

    $("#kitMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#newPass").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if ($("#pass").val() === $("#newPass").val()) {
      handleError("Passwords are the same");
      return false;
    }

    sendAjax($("#changePassForm").attr("action"), $("#changePassForm").serialize(), "POST", "json");

    return false;
  });

  var kitItemForms = document.getElementsByClassName("kitItemForm");

  if (kitItemForms) {
    Array.prototype.forEach.call(kitItemForms, function (kitItemForm) {
      kitItemForm.addEventListener("submit", function (e) {
        e.preventDefault();

        kitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
        var imageF = kitItemForm.querySelector('#itemImageField');
        $("#kitMessage").animate({ width: 'hide' }, 350);

        if (kitItemForm.querySelector('#kitItemName') == '') {
          handleError("Kit name is required");
          return false;
        }

        var $kitItemForm = $(kitItemForm);

        makeImgurRequest(imageF.files[0]).then(function (imageData) {
          var image = "";

          if (imageData) {
            var data = JSON.parse(imageData).data;
            image = data.link;
          }

          return image;
        }).then(function (image) {
          kitItemForm.querySelector('#itemImageURL').value = image;
          sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
        });

        return false;
      });
    });
  }

  // attach event listeners to each kit form
  updateImageField(addKitForm, "imageField", "imageLabel");
  updateImageField(editKitForm, "editImageField", "editImageLabel");
  //updateImageField(editKitItemForm, "editItemImageField", "editItemImageLabel");
  // $('#addKitForm').on("click", (e) => displayHideSection('makeKit', 'block'));
  // $('#hideKitForm').on("click", (e) => displayHideSection('makeKit', 'none'));
});
