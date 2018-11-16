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
};

// helper method for displaying or hiding a small section
const displayHideSection = (sectionID, displayStyle) => {
  const section = document.querySelector(`#${sectionID}`);
  section.style.display = displayStyle;
};

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
}

$(document).ready(() => {
  if(document.querySelector('#dynamicContent')) {
    // set up masonry content
    const grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
        columnWidth: 470,
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

  // allow links to be added to kit items
  const linkButtons = document.getElementsByClassName("addLinkButton");
  if(linkButtons) {
    for (let i = 0; i < linkButtons.length; i++) {
      linkButtons[i].addEventListener("click", (e) => addItem(e, 
        linkButtons[i].parentElement.parentElement, 'Link', ""));
    }
  }

  // attatch event listeners on each kit on the myKits page
  const myKits = document.getElementsByClassName("kit");
  if(myKits) {
    for(let i = 0; i < myKits.length; i++) {
      myKits[i].querySelector('#deleteKitForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const $kitForm = $(myKits[i].querySelector('#deleteKitForm'));

        sendAjax($kitForm.attr("action"), $kitForm.serialize(), "DELETE", "json");

        return false;
      });

      // attach event listeners to each item's edit and delete
      const myKitItems = myKits[i].getElementsByClassName("KitItem");
      if (myKitItems) {
        for(let j = 0; j < myKitItems.length; j++) {
          myKitItems[i].querySelector('#deleteKitItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
    
            const $kitItemForm = $(myKitItems[i].querySelector('#deleteKitItemForm'));
    
            sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
    
            return false;
          });
        }
      }
    }
  }

  $("#signupForm").on("submit", (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("Passwords do not match");
      return false;           
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize(), "POST", "json");

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();

    $("#kitMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize(), "POST", "json");

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
      sendAjax($("#kitForm").attr("action"), $("#kitForm").serialize(), "POST", "json");
    });

    return false;
  });

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
    // for (let i =0; i < kitItemForms.length; i++) {
    //   //const count = counterStruct['imageField']();

    //   let itemInput = kitItemForms[i].querySelector( '#itemImageField' );
    //   let itemLabel = kitItemForms[i].querySelector( '#itemImageLabel' );

    //   itemInput.id = `${itemInput.id}${i}`;
    //   itemLabel.id = `${itemLabel.id}${i}`;
    //   itemLabel.htmlFor = `${itemInput.id}${i}`;

    //   (function() {
    //     // let itemInput = kitItemForms[i].querySelector( '#itemImageField' );
    //     // let itemLabel = kitItemForms[i].querySelector( '#itemImageLabel' );
    //     let itemLabelVal = itemLabel.innerHTML; 
    //     itemInput.addEventListener( 'change', function() { updateImageField(itemInput, itemLabel, itemLabelVal); }, false)

    //     kitItemForms[i].addEventListener("submit", (e) => {
    //       e.preventDefault();
      
    //       kitItemForms[i].querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
    //      const imageF = kitItemForms[i].querySelector(`#itemImageField${i}`)
    //       $("#kitMessage").animate({width:'hide'},350);
      
    //       if(kitItemForms[i].querySelector('#kitItemName') == '') {
    //         handleError("Kit name is required");
    //         return false;
    //       }
  
    //       const $kitItemForm = $(kitItemForms[i]);
      
    //       makeImgurRequest(imageF.files[0])
    //       .then((imageData) => {
    //         let image = "";
      
    //         if (imageData) {
    //             const data = JSON.parse(imageData).data;
    //             image = data.link;
    //         }
      
    //         return image;
    //       })
    //       .then((image) => {
    //         document.querySelector('#itemImageURL').value = image;
    //         sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
    //       });
      
    //       return false;
    //     });
    //   }());
    // }
    Array.prototype.forEach.call(kitItemForms, kitItemForm => {
      // kitItemForm.querySelector( '#itemImageField' )
      // .addEventListener( 'change', function(e) { 
      //   updateImageField(e, kitItemForm, "Upload an Image"); 
      // });

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
          kitItemForm.querySelector('#itemImageURL').value = image;
          sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json");
        });
    
        return false;
      });
    });
  }

  // attach event listener to change text of image label
  const input = document.querySelector( '#imageField' );
  const label =document.querySelector( '#imageLabel' );
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

  
  // $('#addKitForm').on("click", (e) => displayHideSection('makeKit', 'block'));
  // $('#hideKitForm').on("click", (e) => displayHideSection('makeKit', 'none'));
});