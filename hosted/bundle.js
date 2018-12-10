'use strict';

// counts how many links are currently added
var linkCounter = 0;

// for use with the imgur API
var imgurClientID = '879ac2e671a727c';
var imgurClientSecret = '524c709be991cd1fc64f474056b8802ea09e18b0';

var getLinkCount = function getLinkCount() {
  return linkCounter++;
};

var counterStruct = {
  'Link': getLinkCount

  // handles for POST
};var handleAddkit = function handleAddkit(e) {
  e.preventDefault();
  var kitForm = document.querySelector("#kitForm");

  $("#kitMessage").animate({ width: 'hide' }, 350);

  if (kitForm.querySelector("#kitName") == '') {
    handleError("Kit name is required");
    return false;
  }

  var imageF = kitForm.querySelector('#imageField');

  var $kitForm = $(kitForm);

  makeImgurRequest(imageF.files[0]).then(function (imageData) {
    var image = "";

    if (imageData) {
      var data = JSON.parse(imageData).data;
      image = data.link;
    }

    return image;
  }).then(function (image) {
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
    sendAjax($kitForm.attr("action"), $kitForm.serialize(), "POST", "json", function () {
      getToken();
    });
  });

  return false;
};

var handleAddkitItem = function handleAddkitItem(e) {
  e.preventDefault();
  var kitItemForm = e.target;

  //kitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
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
    } else if (!kitItemForm.querySelector("#itemImageURL").value) {
      kitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
    }
    $('#submitLoading').modal('hide');
    //$('#makeKit').modal('hide');
    sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json", function () {
      getToken();
    });
  });

  return false;
};

var handleEditKit = function handleEditKit(e) {
  e.preventDefault();
  var kitForm = document.querySelector("#editKitForm");

  $("#kitMessage").animate({ width: 'hide' }, 350);

  if (kitForm.querySelector("#kitName") == '') {
    handleError("Kit name is required");
    return false;
  }

  var imageF = kitForm.querySelector('#editImageField');

  var $kitForm = $(kitForm);
  makeImgurRequest(imageF.files[0]).then(function (imageData) {
    var image = "";

    if (imageData) {
      var data = JSON.parse(imageData).data;
      image = data.link;
    }

    return image;
  }).then(function (image) {
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
    sendAjax($kitForm.attr("action"), $kitForm.serialize(), "POST", "json", function () {
      getToken();
    });
  });

  return false;
};

var handleEditKitItem = function handleEditKitItem(e) {
  e.preventDefault();
  var editKitItemForm = document.querySelector("#editKitItemForm");
  var $editKitItemForm = $(editKitItemForm);

  //editKitItemForm.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
  var imageF = editKitItemForm.querySelector('#editItemImageField');
  $("#kitMessage").animate({ width: 'hide' }, 350);

  if (editKitItemForm.querySelector('#kitItemName') == '') {
    handleError("Kit name is required");
    return false;
  }

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
    } else if (!editKitItemForm.querySelector("#itemImageURL").value) {
      editKitItemForm.querySelector("#itemImageURL").value = "/assets/img/defaultImage.jpg";
    }
    $('#submitLoading').modal('hide');
    $('#editKitItem').modal('hide');
    sendAjax($editKitItemForm.attr("action"), $editKitItemForm.serialize(), "POST", "json", function () {
      getToken();
    });
  });

  return false;
};

var handleDeleteKit = function handleDeleteKit(e) {
  e.preventDefault();

  var $kitForm = $(e.target);

  sendAjax($kitForm.attr("action"), $kitForm.serialize(), "DELETE", "json", function () {
    getToken();
  });

  return false;
};

var handleDeleteKitItem = function handleDeleteKitItem(e) {
  e.preventDefault();

  var $kitItemForm = $(e.target);

  sendAjax($kitItemForm.attr("action"), $kitItemForm.serialize(), "POST", "json", function () {
    getToken();
  });

  return false;
};

// React Views
var MakerWindow = function MakerWindow(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'modal fade', id: 'makeKit', tabindex: '-1', role: 'dialog', 'aria-labelledby': 'makeKitTitle', 'aria-hidden': 'true' },
      React.createElement(
        'section',
        { className: 'modal-dialog modal-lg', role: 'document' },
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'h2',
              { className: 'modal-title', id: 'makeKitTitle' },
              'Add a Reeactment Kit'
            )
          ),
          React.createElement(
            'div',
            { className: 'modal-body' },
            React.createElement(
              'form',
              { id: 'kitForm', name: 'kitForm', action: '/maker', method: 'POST', onSubmit: handleAddkit },
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', { id: 'imageField', type: 'file', name: 'image' }),
                React.createElement(
                  'label',
                  { htmlFor: 'imageField', className: 'btn btn-outline-secondary', id: 'imageLabel' },
                  'Upload an Image'
                )
              ),
              React.createElement(
                'div',
                { className: 'form-row' },
                React.createElement(
                  'div',
                  { className: 'form-group col-md-4 ml-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'name' },
                    'Name: '
                  ),
                  React.createElement('input', { id: 'kitName', type: 'text', name: 'name', className: 'form-control', placeholder: 'Kit Name' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group col-md-3 ml-5' },
                  React.createElement(
                    'label',
                    { htmlFor: 'startTimePeriod' },
                    'Time Period Range Start: '
                  ),
                  React.createElement('input', { id: 'kitStartTimePeriod', type: 'text', className: 'form-control', name: 'startTimePeriod', placeholder: 'Start Year' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group col-md-3 mr-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'endTimePeriod' },
                    'Time Period Range End: '
                  ),
                  React.createElement('input', { id: 'kitEndTimePeriod', type: 'text', className: 'form-control', name: 'endTimePeriod', placeholder: 'End Year' })
                )
              ),
              React.createElement(
                'div',
                { className: 'form-row' },
                React.createElement(
                  'div',
                  { className: 'form-group col-md-6 ml-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'description' },
                    'Description: '
                  ),
                  React.createElement('textarea', { id: 'kitDescription', type: 'text', className: 'form-control', name: 'description' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-check mr-auto mt-5 ml-3' },
                  React.createElement('input', { id: 'kitPublic', className: 'form-check-input', type: 'checkbox', name: 'public', value: 'Public', checked: true }),
                  React.createElement(
                    'label',
                    { className: 'form-check-label', 'for': 'public' },
                    'Public'
                  )
                )
              ),
              React.createElement('input', { id: 'initCsrf', type: 'hidden', name: '_csrf', value: props.csrf }),
              React.createElement('input', { id: 'imageURL', type: 'hidden', name: 'imageURL', value: '' }),
              React.createElement('input', { className: 'btn btn-lg btn-outline-success', type: 'submit', value: 'Add Kit' })
            ),
            React.createElement('input', { id: 'hideKitForm', type: 'button', className: 'btn btn-lg btn-outline-danger', 'data-dismiss': 'modal', value: 'Cancel' })
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'modal fade', id: 'editKit', tabindex: '-1', role: 'dialog', 'aria-labelledby': 'editKitTitle', 'aria-hidden': 'true' },
      React.createElement(
        'section',
        { className: 'modal-dialog modal-lg', role: 'document' },
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'h2',
              { className: 'modal-title', id: 'editKitTitle' },
              'Editing'
            )
          ),
          React.createElement(
            'div',
            { className: 'modal-body' },
            React.createElement(
              'form',
              { id: 'editKitForm', name: 'editKitForm', action: '/maker', method: 'POST', onSubmit: handleEditKit },
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', { id: 'editImageField', type: 'file', name: 'image' }),
                React.createElement(
                  'label',
                  { htmlFor: 'editImageField', className: 'btn btn-outline-secondary', id: 'editImageLabel' },
                  'Change Image'
                )
              ),
              React.createElement(
                'div',
                { className: 'form-row' },
                React.createElement(
                  'div',
                  { className: 'form-group col-md-4 ml-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'name' },
                    'Name: '
                  ),
                  React.createElement('input', { id: 'kitName', type: 'text', name: 'name', className: 'form-control', placeholder: 'Kit Name', readOnly: true })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group col-md-3 ml-5' },
                  React.createElement(
                    'label',
                    { htmlFor: 'startTimePeriod' },
                    'Time Period Range Start: '
                  ),
                  React.createElement('input', { id: 'kitStartTimePeriod', type: 'text', className: 'form-control', name: 'startTimePeriod', placeholder: 'Start Year' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group col-md-3 mr-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'endTimePeriod' },
                    'Time Period Range End: '
                  ),
                  React.createElement('input', { id: 'kitEndTimePeriod', type: 'text', className: 'form-control', name: 'endTimePeriod', placeholder: 'End Year' })
                )
              ),
              React.createElement(
                'div',
                { className: 'form-row' },
                React.createElement(
                  'div',
                  { className: 'form-group col-md-6 ml-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'description' },
                    'Description: '
                  ),
                  React.createElement('textarea', { id: 'kitDescription', type: 'text', className: 'form-control', name: 'description' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-check mr-auto mt-5 ml-3' },
                  React.createElement('input', { id: 'kitPublic', className: 'form-check-input', type: 'checkbox', name: 'public', value: 'Public', checked: true }),
                  React.createElement(
                    'label',
                    { className: 'form-check-label', 'for': 'public' },
                    'Public'
                  )
                )
              ),
              React.createElement('input', { id: 'initCsrf', type: 'hidden', name: '_csrf', value: props.csrf }),
              React.createElement('input', { id: 'imageURL', type: 'hidden', name: 'imageURL', value: '' }),
              React.createElement('input', { className: 'btn btn-lg btn-outline-success', type: 'submit', value: 'Update Kit' })
            ),
            React.createElement('input', { id: 'hideKitForm', type: 'button', className: 'btn btn-lg btn-outline-danger', 'data-dismiss': 'modal', value: 'Cancel' })
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'modal fade', id: 'editKitItem', tabindex: '-1', role: 'dialog', 'aria-labelledby': 'editkitItemTitle', 'aria-hidden': 'true' },
      React.createElement(
        'section',
        { className: 'modal-dialog modal-lg', role: 'document' },
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'h2',
              { className: 'modal-title', id: 'editkitItemTitle' },
              'Editing'
            )
          ),
          React.createElement(
            'div',
            { className: 'modal-body' },
            React.createElement(
              'form',
              { id: 'editKitItemForm', name: 'editKitItemForm', action: '/addKitItem', method: 'POST', className: 'text-center kitItemForm', onSubmit: handleEditKitItem },
              React.createElement(
                'div',
                { className: 'form-group text-center' },
                React.createElement('input', { id: 'editItemImageField', type: 'file', name: 'image' }),
                React.createElement(
                  'label',
                  { htmlFor: 'editItemImageField', className: 'btn btn-outline-secondary', id: 'editItemImageLabel' },
                  'Change Image'
                )
              ),
              React.createElement(
                'div',
                { className: 'form-row' },
                React.createElement(
                  'div',
                  { className: 'form-group col-md-4 ml-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'name' },
                    'Name: '
                  ),
                  React.createElement('input', { id: 'kitItemName', type: 'text', name: 'itemName', className: 'form-control', placeholder: 'Kit Item Name', readOnly: true })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group col-md-4 mr-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'itemPrice' },
                    'Price: '
                  ),
                  React.createElement('input', { id: 'kitItemPrice', type: 'text', name: 'itemPrice', className: 'form-control', placeholder: 'Price' })
                )
              ),
              React.createElement(
                'div',
                { className: 'form-row' },
                React.createElement(
                  'div',
                  { className: 'form-group col-md-5 ml-auto' },
                  React.createElement(
                    'label',
                    { htmlFor: 'itemDescription' },
                    'Description: '
                  ),
                  React.createElement('textarea', { id: 'kitItemDescription', type: 'text', className: 'form-control', name: 'itemDescription' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group col-md-5 mr-auto' },
                  React.createElement(
                    'ul',
                    { id: 'linkList', className: 'text-left' },
                    React.createElement(
                      'li',
                      { id: 'addLinkButton' },
                      React.createElement('input', { type: 'button', className: 'btn btn-sm btn-outline-secondary addLinkButton', value: 'Add Link' })
                    )
                  )
                )
              ),
              React.createElement('input', { type: 'hidden', id: 'newCsrf', name: '_csrf', value: props.csrf }),
              React.createElement('input', { type: 'hidden', id: 'itemImageURL', name: 'itemImageURL', value: '' }),
              React.createElement('input', { type: 'hidden', id: 'parentKit', name: 'parentKit', value: 'REPLACE THIS' }),
              React.createElement('input', { className: 'btn btn-outline-success text-center mx-auto', type: 'submit', value: 'Update Kit Item' })
            ),
            React.createElement('input', { id: 'hideKitItemForm', type: 'button', className: 'btn btn-lg btn-outline-danger', 'data-dismiss': 'modal', value: 'Cancel' })
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'modal fade submitLoading', id: 'submitLoading', tabindex: '-1', role: 'dialog', 'aria-labelledby': 'editKitTitle', 'aria-hidden': 'true' },
      React.createElement(
        'div',
        { className: 'modal-dialog modal-dialog-centered', role: 'document' },
        React.createElement(
          'div',
          { className: 'modal-content load-gif mx-auto' },
          React.createElement('img', { src: '/assets/img/loading.gif', alt: 'Loading', className: 'img-fluid mx-auto' })
        )
      )
    ),
    React.createElement('section', { id: 'kits', className: 'container bg-light mt-5' })
  );
};

var KitList = function KitList(props) {
  if (props.kits.length === 0) {
    return React.createElement(
      'div',
      { className: 'container bg-light mt-5' },
      React.createElement(
        'div',
        { className: 'jumbotron jumbotron-fluid' },
        React.createElement(
          'h4',
          { className: 'display-4' },
          'You Don\'t Have Any Reenactment Kits!'
        ),
        React.createElement(
          'h4',
          null,
          'Get Started by Adding Some.'
        )
      )
    );
  }

  var kitNodes = props.kits.map(function (kit) {
    // return the empty display if the kit has no items
    var kitItems = null;
    if (kit.kitItems.length === 0) {
      kitItems = React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'div',
            { className: 'col' },
            React.createElement(
              'h3',
              null,
              'This Kit has no Items!'
            ),
            React.createElement(
              'p',
              null,
              'Get Started by adding some.'
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'h3',
          { className: 'text-center' },
          'Add a New Kit Item:'
        ),
        React.createElement(
          'form',
          { id: 'kitItemForm', name: 'kitItemForm', action: '/addKitItem', method: 'POST', className: 'text-center kitItemForm', onSubmit: handleAddkitItem },
          React.createElement(
            'div',
            { className: 'form-group text-center' },
            React.createElement('input', { id: 'itemImageField', type: 'file', name: 'itemImage' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'div',
              { className: 'form-group col-md-4 ml-auto' },
              React.createElement(
                'label',
                { 'for': 'name' },
                'Name: '
              ),
              React.createElement('input', { id: 'kitItemName', type: 'text', name: 'itemName', className: 'form-control', placeholder: 'Kit Item Name' })
            ),
            React.createElement(
              'div',
              { className: 'form-group col-md-4 mr-auto' },
              React.createElement(
                'label',
                { 'for': 'itemPrice' },
                'Price: '
              ),
              React.createElement('input', { id: 'kitItemPrice', type: 'text', name: 'itemPrice', className: 'form-control', placeholder: 'Price' })
            )
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'div',
              { className: 'form-group col-md-5 ml-auto' },
              React.createElement(
                'label',
                { 'for': 'itemDescription' },
                'Description: '
              ),
              React.createElement('textarea', { id: 'kitItemDescription', type: 'text', className: 'form-control', name: 'itemDescription' })
            ),
            React.createElement(
              'div',
              { className: 'form-group col-md-5 mr-auto' },
              React.createElement(
                'ul',
                { id: 'linkList', className: 'text-left' },
                React.createElement(
                  'li',
                  null,
                  React.createElement('input', { type: 'button', className: 'btn btn-sm btn-outline-secondary addLinkButton', value: 'Add Link' })
                )
              )
            )
          ),
          React.createElement('input', { type: 'hidden', id: 'newCsrf', name: '_csrf', value: props.csrf }),
          React.createElement('input', { type: 'hidden', id: 'itemImageURL', name: 'itemImageURL', value: '' }),
          React.createElement('input', { type: 'hidden', name: 'parentKit', value: kit.name }),
          React.createElement('input', { className: 'btn btn-outline-success text-center mx-auto', type: 'submit', value: 'Add Kit Item' })
        )
      );
    } else {
      // finally map the items to the proper JSX
      var kitItemNodes = kit.kitItems.map(function (kitItem) {
        // construct the links object to insert into the kit
        var kitItemLinks = null;
        if (kitItem.links.length !== 0) {
          kitItemLinks = kitItem.links.map(function (link) {
            return React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                { href: link },
                link
              )
            );
          });
        }

        return React.createElement(
          'div',
          { className: 'kitItem' },
          React.createElement(
            'div',
            { className: 'row', key: kitItem._id },
            React.createElement(
              'div',
              { className: 'col-4' },
              kitItem.image && React.createElement('img', { src: kitItem.image, className: 'img-fluid', alt: 'My cool pic' })
            ),
            React.createElement(
              'div',
              { className: 'col-8' },
              React.createElement(
                'h4',
                null,
                'Item Name: ',
                React.createElement(
                  'span',
                  { id: 'kitItemName' },
                  kitItem.name
                )
              ),
              kitItem.price && React.createElement(
                'h5',
                null,
                'Item Price: $',
                React.createElement(
                  'span',
                  { id: 'kitItemPrice' },
                  kitItem.price
                )
              ),
              kitItem.description && React.createElement(
                'h5',
                null,
                'Item Description: ',
                React.createElement(
                  'span',
                  { id: 'kitItemDescription' },
                  kitItem.description
                )
              ),
              kitItem.links && React.createElement(
                'div',
                null,
                React.createElement(
                  'h4',
                  null,
                  'Links:'
                ),
                React.createElement(
                  'ul',
                  { id: 'kitItemLinkList' },
                  kitItemLinks
                )
              ),
              React.createElement(
                'form',
                { id: 'deleteKitItemForm', action: '/deleteKitItem', method: 'POST', onSubmit: handleDeleteKitItem },
                React.createElement(
                  'div',
                  { className: 'btn-group text-center' },
                  React.createElement(
                    'button',
                    { type: 'button', id: 'editKitItemButton', className: 'btn btn-sm btn-outline-primary' },
                    'Edit'
                  ),
                  React.createElement('input', { type: 'hidden', id: 'parentKit', name: 'parentKit', value: kit.name }),
                  React.createElement('input', { type: 'hidden', name: 'itemToDelete', value: kitItem.name }),
                  React.createElement('input', { id: 'initCsrf', type: 'hidden', name: '_csrf', value: props.csrf }),
                  React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-sm btn-outline-danger', id: 'kitItemDeleteButton', name: 'kitItemDeleteButton' },
                    'Delete'
                  )
                )
              )
            ),
            React.createElement('hr', null)
          )
        );
      });

      kitItems = React.createElement(
        'div',
        null,
        kitItemNodes,
        React.createElement(
          'h3',
          { className: 'text-center' },
          'Add a New Kit Item:'
        ),
        React.createElement(
          'form',
          { id: 'kitItemForm', name: 'kitItemForm', action: '/addKitItem', method: 'POST', className: 'text-center kitItemForm', onSubmit: handleAddkitItem },
          React.createElement(
            'div',
            { className: 'form-group text-center' },
            React.createElement('input', { id: 'itemImageField', type: 'file', name: 'itemImage' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'div',
              { className: 'form-group col-md-4 ml-auto' },
              React.createElement(
                'label',
                { 'for': 'name' },
                'Name: '
              ),
              React.createElement('input', { id: 'kitItemName', type: 'text', name: 'itemName', className: 'form-control', placeholder: 'Kit Item Name' })
            ),
            React.createElement(
              'div',
              { className: 'form-group col-md-4 mr-auto' },
              React.createElement(
                'label',
                { 'for': 'itemPrice' },
                'Price: '
              ),
              React.createElement('input', { id: 'kitItemPrice', type: 'text', name: 'itemPrice', className: 'form-control', placeholder: 'Price' })
            )
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'div',
              { className: 'form-group col-md-5 ml-auto' },
              React.createElement(
                'label',
                { 'for': 'itemDescription' },
                'Description: '
              ),
              React.createElement('textarea', { id: 'kitItemDescription', type: 'text', className: 'form-control', name: 'itemDescription' })
            ),
            React.createElement(
              'div',
              { className: 'form-group col-md-5 mr-auto' },
              React.createElement(
                'ul',
                { id: 'linkList', className: 'text-left' },
                React.createElement(
                  'li',
                  null,
                  React.createElement('input', { type: 'button', className: 'btn btn-sm btn-outline-secondary addLinkButton', value: 'Add Link' })
                )
              )
            )
          ),
          React.createElement('input', { type: 'hidden', id: 'newCsrf', name: '_csrf', value: props.csrf }),
          React.createElement('input', { type: 'hidden', id: 'itemImageURL', name: 'itemImageURL', value: '' }),
          React.createElement('input', { type: 'hidden', name: 'parentKit', value: kit.name }),
          React.createElement('input', { className: 'btn btn-outline-success text-center mx-auto', type: 'submit', value: 'Add Kit Item' })
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'kit' },
      React.createElement(
        'div',
        { className: 'jumbotron jumbotron-fluid' },
        React.createElement(
          'h2',
          { className: 'kitName display-4' },
          'Name: ',
          React.createElement(
            'span',
            { id: 'kitName' },
            kit.name
          )
        ),
        kit.startTimePeriod && React.createElement(
          'h4',
          null,
          'Time Period: ',
          React.createElement(
            'span',
            { id: 'kitStartTimePeriod' },
            kit.startTimePeriod
          ),
          kit.endTimePeriod && React.createElement(
            'span',
            null,
            ' - ',
            React.createElement(
              'span',
              { id: 'kitEndTimePeriod' },
              kit.endTimePeriod
            )
          ),
          ' '
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-6' },
          kit.image && React.createElement('img', { src: kit.image, className: 'img-fluid', alt: 'My cool pic' })
        ),
        React.createElement(
          'div',
          { className: 'col-5' },
          kit.description && React.createElement(
            'h5',
            null,
            'Description: ',
            kit.description
          ),
          React.createElement(
            'form',
            { id: 'deleteKitForm', action: '/deleteKit', method: 'DELETE', onSubmit: handleDeleteKit },
            React.createElement(
              'div',
              { className: 'btn-group text-center' },
              React.createElement(
                'button',
                { type: 'button', id: 'editKitButton', className: 'btn btn-sm btn-outline-primary' },
                'Edit'
              ),
              React.createElement('input', { type: 'hidden', name: 'itemToDelete', value: kit.name }),
              React.createElement('input', { id: 'initCsrf', type: 'hidden', name: '_csrf', value: props.csrf }),
              React.createElement(
                'button',
                { type: 'submit', className: 'btn btn-sm btn-outline-danger', id: 'kitDeleteButton', name: 'kitDeleteButton' },
                'Delete'
              )
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-lg btn-primary mx-auto mt-3', id: 'expandKitItemsButton' },
          'Toggle Display Kit Items'
        )
      ),
      React.createElement('hr', null),
      React.createElement(
        'div',
        { className: 'kit-items-expand collapse', id: 'kitItemDisplay' },
        kitItems
      ),
      React.createElement('hr', null)
    );
  });

  return React.createElement(
    'div',
    null,
    kitNodes
  );
};

var changePassWindow = function changePassWindow(props) {};

var createMakerWindow = function createMakerWindow(csrf) {
  sendAjax('/getKitsByOwner', null, 'GET', 'json', function (data) {
    // first, render the base page
    ReactDOM.render(React.createElement(MakerWindow, { csrf: csrf }), document.querySelector('#content'));

    // then, render each kit along with associated items
    ReactDOM.render(React.createElement(KitList, { kits: data.kits, csrf: csrf }), document.querySelector('#kits'));

    // do everything else needed after kits are rendered

    // pull forms for modals to be used for submission and editing
    var addKitForm = document.querySelector("#kitForm");
    var editKitForm = document.querySelector("#editKitForm");
    var editKitItemForm = document.querySelector("#editKitItemForm");

    // allow links to be added to kit items
    var linkButtons = document.getElementsByClassName("addLinkButton");
    if (linkButtons) {
      var _loop = function _loop(i) {
        linkButtons[i].addEventListener("click", function (e) {
          return addItem(e, linkButtons[i].parentElement.parentElement, 'Link', "");
        });
      };

      for (var i = 0; i < linkButtons.length; i++) {
        _loop(i);
      }
    }

    // attach event listeners on each kit on the myKits page
    var myKits = document.getElementsByClassName("kit");
    if (myKits) {
      var _loop2 = function _loop2(i) {
        // attach expand event listener
        var expandButton = myKits[i].querySelector("#expandKitItemsButton");
        expandButton.addEventListener('click', function (e) {
          $(myKits[i].querySelector("#kitItemDisplay")).collapse('toggle');
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
          var _loop3 = function _loop3(j) {

            // attach edit event listener
            var kitItemEditButton = myKitItems[j].querySelector("#editKitItemButton");
            var parentKit = myKitItems[j].querySelector("#parentKit");

            var itemClickEdit = function itemClickEdit(e) {
              return populateEditKitItemModal(myKitItems[j], parentKit);
            };
            kitItemEditButton.addEventListener('click', itemClickEdit);
          };

          for (var j = 0; j < myKitItems.length; j++) {
            _loop3(j);
          }
        }
      };

      for (var i = 0; i < myKits.length; i++) {
        _loop2(i);
      }
    }

    // attach event listeners to each kit form
    if (addKitForm && editKitForm && editKitItemForm) {
      updateImageField(addKitForm, "imageField", "imageLabel");
      updateImageField(editKitForm, "editImageField", "editImageLabel");
      updateImageField(editKitItemForm, "editItemImageField", "editItemImageLabel");
    }
  });
};

var createChangePassWindow = function createChangePassWindow(csrf) {};

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

// helper method for displaying or hiding sections with the same clas name
var displayHideSections = function displayHideSections(sectionClass, displayStyle) {
  var sections = document.getElementsByClassName('' + sectionClass);
  for (var i = 0; i < sections.length; i++) {
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

// a helper function used for updating various image modals
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

var setup = function setup(csrf) {

  createMakerWindow(csrf);

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

    sendAjax($("#changePassForm").attr("action"), $("#changePassForm").serialize(), "POST", "json", redirect);

    return false;
  });
};

var getToken = function getToken() {
  sendAjax('/getToken', null, 'GET', "json", function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $('#errorModal').modal();
};

var redirect = function redirect(response) {
  $("#kitMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
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
