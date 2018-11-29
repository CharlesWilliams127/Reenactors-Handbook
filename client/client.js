// counts how many links are currently added
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
  $('#errorModal').modal();
}

// wrapper function to submit an image to imgur when posting
// will upload image to imgur if upload was successful
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
          displayHideSections('submitLoading', 'block');
          xhr.send(fd);
      }
      else {
          resolve("");
      }
  });
};

// helper method for displaying or hiding sections with the same clas name
const displayHideSections = (sectionClass, displayStyle) => {
  const sections = document.getElementsByClassName(`${sectionClass}`);
  for (let i = 0; i < sections.length; i++) {
    $(sections[i]).modal('toggle');
  }
};

// a function to handle the user clicking the edit button from
// within a Kit
const populateEditKitModal = (item) => {
  const kitModal = document.querySelector("#editKit");

  const name = kitModal.querySelector('#kitName');
  const desc = kitModal.querySelector('#kitDescription');
  const startTime = kitModal.querySelector('#kitStartTimePeriod');
  const endTime = kitModal.querySelector('#kitEndTimePeriod');
  const image = kitModal.querySelector('#imageURL');

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
  kitModal.querySelector('#editKitTitle').textContent = `Editing ${name.value}`;

  // display modal
  $('#editKit').modal();
}

const populateList = (elements, list, type) => {
  Array.prototype.forEach.call(elements, element => {
      addItem(null, list, type, element.innerText);
  });
}

// a function to handle the user clicking the edit button from
// within a Kit Item
const populateEditKitItemModal = (item) => {
  const kitItemModal = document.querySelector("#editKitItem");

  const name = kitItemModal.querySelector('#kitItemName');
  const price = kitItemModal.querySelector('#kitItemPrice');
  const desc = kitItemModal.querySelector('#kitItemDescription');
  const image = kitItemModal.querySelector('#itemImageURL');
  const parentKit = kitItemModal.querySelector('#parentKit');
  const linkList = kitItemModal.querySelector('#linkList');
  const button =  linkList.querySelector("#addLinkButton");
  linkList.innerHTML = "";
  linkList.appendChild(button);

  name.value = item.querySelector('#kitItemName').textContent;
  if (item.querySelector('#kitItemDescription')) {
    desc.value = item.querySelector('#kitItemDescription').textContent;
  }
  if (price.value = item.querySelector('#kitItemPrice')) {
    price.value = item.querySelector('#kitItemPrice').textContent;
  }
  if(item.querySelector('#kitItemImage')) {
    image.value = item.querySelector('#kitItemImage').src;
  }
  parentKit.value = item.querySelector('#parentKit').value;
  const existingLinkList = item.querySelector('#kitItemLinkList');

  if (existingLinkList) {
    populateList(existingLinkList.getElementsByTagName("li"), linkList, 'Link');
  }

  // change the header
  kitItemModal.querySelector('#editkitItemTitle').textContent = `Editing ${name.value}`;

  // display modal
  $('#editKitItem').modal();
}

// creates a new field for the user to add to
const addItem = (e, list, elemName, value) => {
  const count = counterStruct[elemName]();
  const item = document.createElement('li');
  const deleteLabel= document.createElement('label');
  deleteLabel.classList.add('small-button--label');
  const deleteButton = document.createElement('input');
  deleteButton.classList.add('btn');
  deleteButton.classList.add('btn-sm');
  deleteButton.classList.add('btn-danger');
  deleteButton.classList.add('text-left');
  deleteButton.style.width = "28px";
  deleteButton.value = 'X';
  deleteButton.id = `deleteButton${count}`;
  deleteLabel.htmlFor = deleteButton.id;
  // attatch listener to delete button
  deleteButton.addEventListener('click', (e) => {
      list.removeChild(item);
  });
  item.innerHTML = `<input id="${elemName}${count}" class="form-control" type="text" name="${elemName}[${count}]" value="${value}"/>`;
  deleteLabel.appendChild(deleteButton);
  item.appendChild(deleteLabel);
  list.appendChild(item);
  
};

// function responsible for sending AJAX requests to our server
// the external Imgur request is handled in another function
const sendAjax = (action, data, type, dataType) => {
  console.dir(data);
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: dataType,
    success: (result, status, xhr) => {
      $("#kitMessage").animate({width:'hide'},350);

      if (dataType == 'json') {
        window.location = result.redirect;
      }
      if(dataType == 'html') {
        $("body").html(result);
      }
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
};

// a helper function used for updating various image modals
const updateImageField = (form, imageField, imageLabel) => {
  const input = form.querySelector( `#${imageField}` );
  const label = form.querySelector( `#${imageLabel}` );
  if (input && label) {
    let labelVal = label.innerHTML;
    input.addEventListener( 'change', (e) =>{
        if( input.files[0] ) {
            label.innerHTML = input.files[0].name;
        }
        else {
            label.innerHTML = labelVal;
        }
    });
  }
}

// adds event listeners to things that change or add kits
const addKitModalEventListener = (kitForm, imageField) => {
  const $kitForm = $(kitForm)

  $kitForm.on("submit", (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if(kitForm.querySelector("#kitName") == '') {
      handleError("Kit name is required");
      return false;
    }
    
    const imageF = kitForm.querySelector(`#${imageField}`);

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
      // user uploaded a new image
      if (image) {
        kitForm.querySelector("#imageURL").value = image;
      }
      // user already has an image
      else if (!kitForm.querySelector("#imageURL").value) {
        kitForm.querySelector("#imageURL").value = "/assets/img/defaultImage.jpg";
      }
      displayHideSections('submitLoading', 'none');
      sendAjax($kitForm.attr("action"), $kitForm.serialize(), "POST", "json");
    });

    return false;
  });
}

$(document).ready(() => {
  if(document.querySelector('#dynamicContent')) {
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
        const data = `name=${name}&owner=${owner}&csrf=${csrf}`;

        sendAjax('/viewer', data, "GET", "json");
      });
    }
  }

  // pull forms for modals to be used for submission and editing
  const addKitForm = document.querySelector("#kitForm");
  const editKitForm = document.querySelector("#editKitForm");
  const editKitItemForm = document.querySelector("#editKitItemForm");

  // allow links to be added to kit items
  const linkButtons = document.getElementsByClassName("addLinkButton");
  if(linkButtons) {
    for (let i = 0; i < linkButtons.length; i++) {
      linkButtons[i].addEventListener("click", (e) => addItem(e, 
        linkButtons[i].parentElement.parentElement, 'Link', ""));
    }
  }

  // attach event listeners on each kit on the myKits page
  const myKits = document.getElementsByClassName("kit");
  if(myKits) {
    for(let i = 0; i < myKits.length; i++) {
      // attach expand event listener
      const expandButton = myKits[i].querySelector("#expandKitItemsButton");
      expandButton.addEventListener('click', (e) => {
        $(myKits[i].querySelector("#collapseableContent")).collapse('toggle');
      })

      // attach delete event listener
      myKits[i].querySelector('#deleteKitForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const $kitForm = $(myKits[i].querySelector('#deleteKitForm'));

        sendAjax($kitForm.attr("action"), $kitForm.serialize(), "DELETE", "json");

        return false;
      });

      // attach kit event listener
      const editButton = myKits[i].querySelector('#editKitButton');
      const clickEdit = (e) => populateEditKitModal(myKits[i]);
      editButton.addEventListener('click', clickEdit);

      // attach event listeners to each item's edit and delete
      const myKitItems = myKits[i].getElementsByClassName("KitItem");
      if (myKitItems) {
        for(let j = 0; j < myKitItems.length; j++) {
          myKitItems[j].querySelector('#deleteKitItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
    
            const $kitItemForm = $(myKitItems[j].querySelector('#deleteKitItemForm'));
    
            sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
    
            return false;
          });

          // attach edit event listener
          const kitItemEditButton = myKitItems[j].querySelector("#editKitItemButton");
          const parentKit = myKitItems[j].querySelector("#parentKit");

          const itemClickEdit = (e) => populateEditKitItemModal(myKitItems[j], parentKit);
          kitItemEditButton.addEventListener('click', itemClickEdit);
        }
      }
    }
  }
  
  // handles attatching listeners to edit and add kits
  addKitModalEventListener(document.querySelector("#kitForm"), "imageField");
  addKitModalEventListener(document.querySelector("#editKitForm"), "editImageField");

  // attach submit listener
  if (editKitForm) {
    editKitItemForm.addEventListener("submit", (e) => {
      e.preventDefault();

      editKitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
      const imageF = editKitItemForm.querySelector('#editItemImageField')
      $("#kitMessage").animate({width:'hide'},350);

      if(editKitItemForm.querySelector('#kitItemName') == '') {
        handleError("Kit name is required");
        return false;
      }

      const $editKitItemForm = $(editKitItemForm);

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
        if (image) {
          editKitItemForm.querySelector('#itemImageURL').value = image;
        }
        else if (!editKitItemForm.querySelector("#itemImageURL").value){
          editKitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
        }
        displayHideSections('submitLoading', 'none');
        sendAjax($editKitItemForm.attr("action"), $editKitItemForm.serialize(), "POST", "json");
      });

      return false;
    });
  }

  $("#changePassForm").on("submit", (e)=> {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#newPass").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if($("#pass").val() === $("#newPass").val()) {
      handleError("Passwords are the same");
      return false;
    }

    sendAjax($("#changePassForm").attr("action"), $("#changePassForm").serialize(), "POST", "json");

    return false;
  });

  const kitItemForms = document.getElementsByClassName("kitItemForm");

  if (kitItemForms) {
    Array.prototype.forEach.call(kitItemForms, kitItemForm => {
      kitItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        kitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
        const imageF = kitItemForm.querySelector('#itemImageField')
        $("#kitMessage").animate({width:'hide'},350);
    
        if(kitItemForm.querySelector('#kitItemName') == '') {
          handleError("Kit name is required");
          return false;
        }

        const $kitItemForm = $(kitItemForm);
    
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
          if (image) {
            kitItemForm.querySelector('#itemImageURL').value = image;
          }
          else if (!kitItemForm.querySelector("#itemImageURL").value){
            kitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
          }
          sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
        });
    
        return false;
      });
    });
  }

  // attach event listeners to each kit form
  if(addKitForm && editKitForm && editKitItemForm) {
    updateImageField(addKitForm, "imageField", "imageLabel");
    updateImageField(editKitForm, "editImageField", "editImageLabel");
    updateImageField(editKitItemForm, "editItemImageField", "editItemImageLabel");
  }
});