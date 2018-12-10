// counts how many links are currently added
let linkCounter = 0;

// for use with the imgur API
const imgurClientID = '879ac2e671a727c';
const imgurClientSecret = '524c709be991cd1fc64f474056b8802ea09e18b0';

const getLinkCount = () => {return linkCounter++;};

const counterStruct = {
  'Link': getLinkCount,
}


// handles for POST
const handleAddkit = (e) => {
  e.preventDefault();
  const kitForm = document.querySelector("#kitForm");

  $("#kitMessage").animate({width:'hide'},350);

  if(kitForm.querySelector("#kitName") == '') {
    handleError("Kit name is required");
    return false;
  }
  
  const imageF = kitForm.querySelector('#imageField');

  const $kitForm = $(kitForm);

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
    $('#submitLoading').modal('hide');
    $('#makeKit').modal('hide');
    $(document.getElementsByClassName('modal-backdrop')[0]).remove();
    sendAjax($kitForm.attr("action"), $kitForm.serialize(), "POST", "json", function(){
      getToken();
    });
  });

  return false;
}

const handleAddkitItem = (e) => {
  e.preventDefault();
  const kitItemForm = e.target;

  //kitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
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
    $('#submitLoading').modal('hide');
    //$('#makeKit').modal('hide');
    sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json", function(){
      getToken();
    });
  });

  return false;
}

const handleEditKit = (e) => {
  e.preventDefault();
  const kitForm = document.querySelector("#editKitForm");

  $("#kitMessage").animate({width:'hide'},350);

  if(kitForm.querySelector("#kitName") == '') {
    handleError("Kit name is required");
    return false;
  }
  
  const imageF = kitForm.querySelector('#editImageField');

  const $kitForm = $(kitForm);
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
    $('#submitLoading').modal('hide');
    $('#editKit').modal('hide');
    sendAjax($kitForm.attr("action"), $kitForm.serialize(), "POST", "json", function(){
      getToken();
    });
  });

  return false;
}

const handleEditKitItem = (e) => {
  e.preventDefault();
  const editKitItemForm = document.querySelector("#editKitItemForm");
  const $editKitItemForm = $(editKitItemForm);

  //editKitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
  const imageF = editKitItemForm.querySelector('#editItemImageField')
  $("#kitMessage").animate({width:'hide'},350);

  if(editKitItemForm.querySelector('#kitItemName') == '') {
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
    if (image) {
      editKitItemForm.querySelector('#itemImageURL').value = image;
    }
    else if (!editKitItemForm.querySelector("#itemImageURL").value){
      editKitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
    }
    $('#submitLoading').modal('hide');
    $('#editKitItem').modal('hide');
    sendAjax($editKitItemForm.attr("action"), $editKitItemForm.serialize(), "POST", "json", function(){
      getToken();
    });
  });

  return false;
}

const handleDeleteKit = (e) => {
  e.preventDefault();

  const $kitForm = $(e.target);

  sendAjax($kitForm.attr("action"), $kitForm.serialize(), "DELETE", "json", function(){
    getToken();
  });

  return false;
}

const handleDeleteKitItem = (e) => {
  e.preventDefault();
    
  const $kitItemForm = $(e.target);

  sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json", function(){
    getToken();
  });

  return false;
}

// React Views
const MakerWindow = (props) => {
  return (
<div>

<div className="modal fade" id="makeKit" tabindex="-1" role="dialog" aria-labelledby="makeKitTitle" aria-hidden="true">
  <section className="modal-dialog modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title" id="makeKitTitle">Add a Reeactment Kit</h2>
      </div>
      <div className="modal-body">
        <form id="kitForm" name="kitForm" action="/maker" method="POST" onSubmit={handleAddkit}>
          <div className="form-group">
            <input id="imageField" type="file" name="image" />
            <label htmlFor="imageField" className="btn btn-outline-secondary" id="imageLabel">Upload an Image</label>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4 ml-auto">
              <label htmlFor="name">Name: </label>
              <input id="kitName" type="text" name="name" className="form-control" placeholder="Kit Name"/>
            </div>
            <div className="form-group col-md-3 ml-5">
              <label htmlFor="startTimePeriod">Time Period Range Start: </label>
              <input id="kitStartTimePeriod" type="text" className="form-control" name="startTimePeriod" placeholder="Start Year"/>
            </div>
            <div className="form-group col-md-3 mr-auto">
              <label htmlFor="endTimePeriod">Time Period Range End: </label>
              <input id="kitEndTimePeriod" type="text" className="form-control" name="endTimePeriod" placeholder="End Year"/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6 ml-auto">
              <label htmlFor="description">Description: </label>
              <textarea id="kitDescription" type="text" className="form-control" name="description"></textarea>
            </div>
            <div className="form-check mr-auto mt-5 ml-3">
              <input id="kitPublic" className="form-check-input" type="checkbox" name="public" value="Public" checked/>
              <label className="form-check-label" for="public">Public</label>
            </div>
          </div>
          <input id="initCsrf" type="hidden" name="_csrf" value={props.csrf} />
          <input id="imageURL" type="hidden" name="imageURL" value="" />
          <input className="btn btn-lg btn-outline-success" type="submit" value="Add Kit" />
        </form>
        <input id="hideKitForm" type="button" className="btn btn-lg btn-outline-danger" data-dismiss="modal" value="Cancel"/>
      </div>
    </div>
  </section>
</div>

<div className="modal fade" id="editKit" tabindex="-1" role="dialog" aria-labelledby="editKitTitle" aria-hidden="true">
  <section className="modal-dialog modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title" id="editKitTitle">Editing</h2>
      </div>
      <div className="modal-body">
        <form id="editKitForm" name="editKitForm" action="/maker" method="POST" onSubmit={handleEditKit}>
          <div className="form-group">
            <input id="editImageField" type="file" name="image" />
            <label htmlFor="editImageField" className="btn btn-outline-secondary" id="editImageLabel">Change Image</label>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4 ml-auto">
              <label htmlFor="name">Name: </label>
              <input id="kitName" type="text" name="name" className="form-control" placeholder="Kit Name" readOnly/>
            </div>
            <div className="form-group col-md-3 ml-5">
              <label htmlFor="startTimePeriod">Time Period Range Start: </label>
              <input id="kitStartTimePeriod" type="text" className="form-control" name="startTimePeriod" placeholder="Start Year"/>
            </div>
            <div className="form-group col-md-3 mr-auto">
              <label htmlFor="endTimePeriod">Time Period Range End: </label>
              <input id="kitEndTimePeriod" type="text" className="form-control" name="endTimePeriod" placeholder="End Year"/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6 ml-auto">
              <label htmlFor="description">Description: </label>
              <textarea id="kitDescription" type="text" className="form-control" name="description"></textarea>
            </div>
            <div className="form-check mr-auto mt-5 ml-3">
              <input id="kitPublic" className="form-check-input" type="checkbox" name="public" value="Public" checked/>
              <label className="form-check-label" for="public">Public</label>
            </div>
          </div>
          <input id="initCsrf" type="hidden" name="_csrf" value={props.csrf} />
          <input id="imageURL" type="hidden" name="imageURL" value="" />
          <input className="btn btn-lg btn-outline-success" type="submit" value="Update Kit" />
        </form>
        <input id="hideKitForm" type="button" className="btn btn-lg btn-outline-danger" data-dismiss="modal" value="Cancel"/>
      </div>
    </div>
  </section>
</div>

<div className="modal fade" id="editKitItem" tabindex="-1" role="dialog" aria-labelledby="editkitItemTitle" aria-hidden="true">
  <section className="modal-dialog modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title" id="editkitItemTitle">Editing</h2>
      </div>
      <div className="modal-body">
        <form id="editKitItemForm" name="editKitItemForm" action="/addKitItem" method="POST" className="text-center kitItemForm" onSubmit={handleEditKitItem}>
              <div className="form-group text-center">
                <input id="editItemImageField" type="file" name="image" />
                <label htmlFor="editItemImageField" className="btn btn-outline-secondary" id="editItemImageLabel">Change Image</label>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4 ml-auto">
                  <label htmlFor="name">Name: </label>
                  <input id="kitItemName" type="text" name="itemName" className="form-control" placeholder="Kit Item Name" readOnly/>
                </div>
                <div className="form-group col-md-4 mr-auto">
                  <label htmlFor="itemPrice">Price: </label>
                  <input id="kitItemPrice" type="text" name="itemPrice" className="form-control" placeholder="Price"/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-5 ml-auto">
                  <label htmlFor="itemDescription">Description: </label>
                  <textarea id="kitItemDescription" type="text" className="form-control" name="itemDescription"></textarea>
                </div>
                <div className="form-group col-md-5 mr-auto">
                  <ul id="linkList" className="text-left">
                    <li id="addLinkButton"><input type="button" className="btn btn-sm btn-outline-secondary addLinkButton" value="Add Link"/></li>
                  </ul>
                </div>
              </div>
              <input type="hidden" id="newCsrf" name="_csrf" value={props.csrf} />
              <input type="hidden" id="itemImageURL" name="itemImageURL" value="" />
              <input type="hidden" id="parentKit" name="parentKit" value="REPLACE THIS" />
              <input className="btn btn-outline-success text-center mx-auto" type="submit" value="Update Kit Item" />
            </form>
        <input id="hideKitItemForm" type="button" className="btn btn-lg btn-outline-danger" data-dismiss="modal" value="Cancel"/>
      </div>
    </div>
  </section>
</div>

<div className="modal fade submitLoading" id="submitLoading" tabindex="-1" role="dialog" aria-labelledby="editKitTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content load-gif mx-auto">
      <img src="/assets/img/loading.gif" alt="Loading" className="img-fluid mx-auto"/>
    </div>
  </div>
</div>


  <section id="kits" className="container bg-light mt-5">
  </section>
  </div>
  );
}

const KitList = function(props) {
  if (props.kits.length === 0) {
    return (
      <div className="container bg-light mt-5">
      <div className="jumbotron jumbotron-fluid">
        <h4 className="display-4">You Don't Have Any Reenactment Kits!</h4>
        <h4>Get Started by Adding Some.</h4>
      </div>
    </div>
    );
  }

  const kitNodes = props.kits.map(function(kit) {
    // return the empty display if the kit has no items
    let kitItems = null;
    if (kit.kitItems.length === 0) {
      kitItems =  (
        <div>
        <div className="row text-center">
          <div className="col">
            <h3>This Kit has no Items!</h3>
            <p>Get Started by adding some.</p>
          </div>
          </div>

          <hr/>

          <h3 className="text-center">Add a New Kit Item:</h3>
          <form id="kitItemForm" name="kitItemForm" action="/addKitItem" method="POST" className="text-center kitItemForm" onSubmit={handleAddkitItem}>
            <div className="form-group text-center">
              <input id="itemImageField" type="file" name="itemImage" />
            </div>
            <div className="form-row">
              <div className="form-group col-md-4 ml-auto">
                <label for="name">Name: </label>
                <input id="kitItemName" type="text" name="itemName" className="form-control" placeholder="Kit Item Name"/>
              </div>
              <div className="form-group col-md-4 mr-auto">
                <label for="itemPrice">Price: </label>
                <input id="kitItemPrice" type="text" name="itemPrice" className="form-control" placeholder="Price"/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-5 ml-auto">
                <label for="itemDescription">Description: </label>
                <textarea id="kitItemDescription" type="text" className="form-control" name="itemDescription"></textarea>
              </div>
              <div className="form-group col-md-5 mr-auto">
                <ul id="linkList" className="text-left">
                  <li><input type="button" className="btn btn-sm btn-outline-secondary addLinkButton" value="Add Link"/></li>
                </ul>
              </div>
            </div>
            <input type="hidden" id="newCsrf" name="_csrf" value={props.csrf} />
            <input type="hidden" id="itemImageURL" name="itemImageURL" value="" />
            <input type="hidden" name="parentKit" value={kit.name} />
            <input className="btn btn-outline-success text-center mx-auto" type="submit" value="Add Kit Item" />
          </form>
        </div>
      );
    }
    else {
      // finally map the items to the proper JSX
      const kitItemNodes = kit.kitItems.map(function(kitItem) {
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
          <div className="kitItem">
            <div className="row" key={kitItem._id}>
                <div className="col-4">
                {kitItem.image && <img src={kitItem.image} className="img-fluid" alt="My cool pic"></img>}
                </div>
                <div className="col-8">
                <h4>Item Name: <span id="kitItemName">{kitItem.name}</span></h4>
                {kitItem.price && <h5>Item Price: $<span id="kitItemPrice">{kitItem.price}</span></h5>}
                {kitItem.description && <h5>Item Description: <span id="kitItemDescription">{kitItem.description}</span></h5>}
                {kitItem.links && <div><h4>Links:</h4>
                    <ul id="kitItemLinkList">
                        {kitItemLinks}
                    </ul>
                    </div>
                }
                <form id="deleteKitItemForm" action="/deleteKitItem" method="POST" onSubmit={handleDeleteKitItem}>
                    <div className="btn-group text-center">
                      <button type="button" id="editKitItemButton" className="btn btn-sm btn-outline-primary">Edit</button>                          
                      <input type="hidden" id="parentKit" name="parentKit" value={kit.name} />
                      <input type="hidden" name="itemToDelete" value={kitItem.name} />
                      <input id="initCsrf" type="hidden" name="_csrf" value={props.csrf} />
                      <button type="submit" className="btn btn-sm btn-outline-danger" id="kitItemDeleteButton" name="kitItemDeleteButton">Delete</button>
                    </div>
                  </form>
                </div>
                <hr/>
            </div>
            </div>
          );
      });

      kitItems =  (
          <div>
              {kitItemNodes}

            <h3 className="text-center">Add a New Kit Item:</h3>
            <form id="kitItemForm" name="kitItemForm" action="/addKitItem" method="POST" className="text-center kitItemForm" onSubmit={handleAddkitItem}>
              <div className="form-group text-center">
                <input id="itemImageField" type="file" name="itemImage" />
              </div>
              <div className="form-row">
                <div className="form-group col-md-4 ml-auto">
                  <label for="name">Name: </label>
                  <input id="kitItemName" type="text" name="itemName" className="form-control" placeholder="Kit Item Name"/>
                </div>
                <div className="form-group col-md-4 mr-auto">
                  <label for="itemPrice">Price: </label>
                  <input id="kitItemPrice" type="text" name="itemPrice" className="form-control" placeholder="Price"/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-5 ml-auto">
                  <label for="itemDescription">Description: </label>
                  <textarea id="kitItemDescription" type="text" className="form-control" name="itemDescription"></textarea>
                </div>
                <div className="form-group col-md-5 mr-auto">
                  <ul id="linkList" className="text-left">
                    <li><input type="button" className="btn btn-sm btn-outline-secondary addLinkButton" value="Add Link"/></li>
                  </ul>
                </div>
              </div>
              <input type="hidden" id="newCsrf" name="_csrf" value={props.csrf} />
              <input type="hidden" id="itemImageURL" name="itemImageURL" value="" />
              <input type="hidden" name="parentKit" value={kit.name} />
              <input className="btn btn-outline-success text-center mx-auto" type="submit" value="Add Kit Item" />
            </form>
          </div>
      );
    }

    return(
      <div className="kit">
          <div className="jumbotron jumbotron-fluid">
              <h2 className="kitName display-4">Name: <span id="kitName">{kit.name}</span></h2>
              {kit.startTimePeriod && <h4>Time Period: <span id="kitStartTimePeriod">{kit.startTimePeriod}</span>
              {kit.endTimePeriod && <span> - <span id="kitEndTimePeriod">{kit.endTimePeriod}</span></span>} </h4>}
          </div>
          <div className="row">
          <div className="col-6">
              {kit.image && <img src={kit.image} className="img-fluid" alt="My cool pic"></img>}
          </div>
          <div className="col-5">
              {kit.description && <h5>Description: {kit.description}</h5>}
              <form id="deleteKitForm" action="/deleteKit" method="DELETE" onSubmit={handleDeleteKit}>
                <div className="btn-group text-center">
                  <button type="button" id="editKitButton" className="btn btn-sm btn-outline-primary">Edit</button>                          
                  <input type="hidden" name="itemToDelete" value={kit.name} />
                  <input id="initCsrf" type="hidden" name="_csrf" value={props.csrf} />
                  <button type="submit" className="btn btn-sm btn-outline-danger" id="kitDeleteButton" name="kitDeleteButton">Delete</button>
                </div>
              </form>
          </div>
          </div>
          <div className="row">
            <button type="button" className="btn btn-lg btn-primary mx-auto mt-3" id="expandKitItemsButton">Toggle Display Kit Items</button>
          </div>
          <hr/>

          <div className="kit-items-expand collapse" id="kitItemDisplay">
            {kitItems}
          </div>
        <hr/>
    </div>
    );
  }); 

  return (
    <div>
      {kitNodes}
    </div>
  );
};

const changePassWindow = (props) => {
  
}

const createMakerWindow = (csrf) => {
  sendAjax('/getKitsByOwner', null, 'GET', 'json', (data) => {
    // first, render the base page
    ReactDOM.render(
      <MakerWindow csrf={csrf}/>,
      document.querySelector('#content')
    );

    // then, render each kit along with associated items
    ReactDOM.render(
      <KitList kits={data.kits} csrf={csrf}/>,
      document.querySelector('#kits')
    );

    // do everything else needed after kits are rendered

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
          $(myKits[i].querySelector("#kitItemDisplay")).collapse('toggle');
        })

        // attach kit event listener
        const editButton = myKits[i].querySelector('#editKitButton');
        const clickEdit = (e) => populateEditKitModal(myKits[i]);
        editButton.addEventListener('click', clickEdit);

        // attach event listeners to each item's edit and delete
        const myKitItems = myKits[i].getElementsByClassName("KitItem");
        if (myKitItems) {
          for(let j = 0; j < myKitItems.length; j++) {

            // attach edit event listener
            const kitItemEditButton = myKitItems[j].querySelector("#editKitItemButton");
            const parentKit = myKitItems[j].querySelector("#parentKit");

            const itemClickEdit = (e) => populateEditKitItemModal(myKitItems[j], parentKit);
            kitItemEditButton.addEventListener('click', itemClickEdit);
          }
        }
      }
    }

      // attach event listeners to each kit form
    if(addKitForm && editKitForm && editKitItemForm) {
      updateImageField(addKitForm, "imageField", "imageLabel");
      updateImageField(editKitForm, "editImageField", "editImageLabel");
      updateImageField(editKitItemForm, "editItemImageField", "editItemImageLabel");
    }
  });
};

const createChangePassWindow = (csrf) => {

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

const setup = (csrf) => {
  
  createMakerWindow(csrf);

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

    sendAjax($("#changePassForm").attr("action"), $("#changePassForm").serialize(), "POST", "json", redirect);

    return false;
  });

};


const getToken = () => {
  sendAjax('/getToken', null, 'GET', "json", (result) => {
      setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});