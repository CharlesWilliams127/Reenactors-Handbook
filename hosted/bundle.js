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
// will upload image to imgur if upload was successful
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
      displayHideSections('submitLoading', 'block');
      xhr.send(fd);
    } else {
      resolve("");
    }
  });
};

// helper method for displaying or hiding a small section
var displayHideSections = function displayHideSections(sectionClass, displayStyle) {
  var sections = document.getElementsByClassName('' + sectionClass);
  for (var i = 0; i < sections.length; i++) {
    //sections[i].style.display = displayStyle;
    $(sections[i]).modal('toggle');
  }
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
  if (item.querySelector('#kitDescription')) {
    desc.value = item.querySelector('#kitDescription').textContent;
  }
  if (item.querySelector('#kitStartTimePeriod')) {
    startTime.value = item.querySelector('#kitStartTimePeriod').textContent;
  }
  if (item.querySelector('#kitEndTimePeriod')) {
    endTime.value = item.querySelector('#kitEndTimePeriod').textContent;
  }
  if (item.querySelector('#kitImage')) {
    image.value = item.querySelector('#kitImage').src;
  }

  // change the header
  kitModal.querySelector('#editKitTitle').textContent = 'Editing ' + name.value;

  // display modal
  $('#editKit').modal();
};

var populateList = function populateList(elements, list, type) {
  Array.prototype.forEach.call(elements, function (element) {
    addItem(null, list, type, element.innerText);
  });
};

// a function to handle the user clicking the edit button from
// within a Kit Item
var populateEditKitItemModal = function populateEditKitItemModal(item) {
  var kitItemModal = document.querySelector("#editKitItem");

  var name = kitItemModal.querySelector('#kitItemName');
  var price = kitItemModal.querySelector('#kitItemPrice');
  var desc = kitItemModal.querySelector('#kitItemDescription');
  var image = kitItemModal.querySelector('#itemImageURL');
  var parentKit = kitItemModal.querySelector('#parentKit');
  var linkList = kitItemModal.querySelector('#linkList');
  var button = linkList.querySelector("#addLinkButton");
  linkList.innerHTML = "";
  linkList.appendChild(button);

  name.value = item.querySelector('#kitItemName').textContent;
  if (item.querySelector('#kitItemDescription')) {
    desc.value = item.querySelector('#kitItemDescription').textContent;
  }
  if (price.value = item.querySelector('#kitItemPrice')) {
    price.value = item.querySelector('#kitItemPrice').textContent;
  }
  if (item.querySelector('#kitItemImage')) {
    image.value = item.querySelector('#kitItemImage').src;
  }
  parentKit.value = item.querySelector('#parentKit').value;
  var existingLinkList = item.querySelector('#kitItemLinkList');

  if (existingLinkList) {
    populateList(existingLinkList.getElementsByTagName("li"), linkList, 'Link');
  }

  // change the header
  kitItemModal.querySelector('#editkitItemTitle').textContent = 'Editing ' + name.value;

  // display modal
  $('#editKitItem').modal();
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
      if (image) {
        kitForm.querySelector("#imageURL").value = image;
      } else {
        kitForm.querySelector("#imageURL").value = "/assets/img/defaultImage.jpg";
      }
      displayHideSections('submitLoading', 'none');
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
  var editKitItemForm = document.querySelector("#editKitItemForm");

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
      // attach expand event listener
      var expandButton = myKits[i].querySelector("#expandKitItemsButton");
      expandButton.addEventListener('click', function (e) {
        $(myKits[i].querySelector("#collapseableContent")).collapse('toggle');
      });

      // attach delete event listener
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

          // attach edit event listener
          var kitItemEditButton = myKitItems[j].querySelector("#editKitItemButton");
          var parentKit = myKitItems[j].querySelector("#parentKit");

          var itemClickEdit = function itemClickEdit(e) {
            return populateEditKitItemModal(myKitItems[j], parentKit);
          };
          kitItemEditButton.addEventListener('click', itemClickEdit);
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

  // attach submit listener
  if (editKitForm) {
    editKitItemForm.addEventListener("submit", function (e) {
      e.preventDefault();

      editKitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
      var imageF = editKitItemForm.querySelector('#editItemImageField');
      $("#kitMessage").animate({ width: 'hide' }, 350);

      if (editKitItemForm.querySelector('#kitItemName') == '') {
        handleError("Kit name is required");
        return false;
      }

      var $editKitItemForm = $(editKitItemForm);

      makeImgurRequest(imageF.files[0]).then(function (imageData) {
        var image = "";

        if (imageData) {
          var data = JSON.parse(imageData).data;
          image = data.link;
        }

        return image;
      }).then(function (image) {
        if (image) {
          editKitItemForm.querySelector('#itemImageURL').value = image;
        } else {
          editKitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
        }
        displayHideSections('submitLoading', 'none');
        sendAjax($editKitItemForm.attr("action"), $editKitItemForm.serialize(), "POST", "json");
      });

      return false;
    });
  }

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
          if (image) {
            kitItemForm.querySelector('#itemImageURL').value = image;
          } else {
            kitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
          }
          sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
        });

        return false;
      });
    });
  }

  // attach event listeners to each kit form
  if (addKitForm && editKitForm && editKitItemForm) {
    updateImageField(addKitForm, "imageField", "imageLabel");
    updateImageField(editKitForm, "editImageField", "editImageLabel");
    updateImageField(editKitItemForm, "editItemImageField", "editItemImageLabel");
  }
});
