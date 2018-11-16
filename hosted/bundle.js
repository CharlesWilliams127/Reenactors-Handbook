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
    $("#kitMessage").animate({ width: 'toggle' }, 350);
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

// creates a new field for the user to add to
var addItem = function addItem(e, list, elemName, value) {
    var count = counterStruct[elemName]();
    var item = document.createElement('li');
    var deleteLabel = document.createElement('label');
    deleteLabel.classList.add('small-button--label');
    var deleteButton = document.createElement('input');
    deleteButton.classList.add('button');
    deleteButton.classList.add('button--close');
    deleteButton.classList.add('button--small');
    deleteButton.value = 'X';
    deleteButton.id = 'deleteButton' + count;
    deleteLabel.htmlFor = deleteButton.id;
    // attatch listener to delete button
    deleteButton.addEventListener('click', function (e) {
        list.removeChild(item);
    });
    item.innerHTML = '<input id="' + elemName + count + '" class="text-input" type="text" name="' + elemName + '[' + count + ']" value="' + value + '"/>';
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

$(document).ready(function () {
    if (document.querySelector('#dynamicContent')) {
        (function () {
            // set up masonry content
            var grid = document.querySelector('#dynamicContent');
            masonry = new Masonry(grid, {
                columnWidth: 256,
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

    $("#signupForm").on("submit", function (e) {
        e.preventDefault();

        $("#kitMessage").animate({ width: 'hide' }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("RAWR! All fields are required");
            return false;
        }

        if ($("#pass").val() !== $("#pass2").val()) {
            handleError("RAWR! Passwords do not match");
            return false;
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize(), "POST", "json");

        return false;
    });

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        $("#kitMessage").animate({ width: 'hide' }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '') {
            handleError("RAWR! Username or password is empty");
            return false;
        }

        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize(), "POST", "json");

        return false;
    });

    $("#kitForm").on("submit", function (e) {
        e.preventDefault();

        $("#kitMessage").animate({ width: 'hide' }, 350);

        if ($("#kitName").val() == '') {
            handleError("Kit name is required");
            return false;
        }

        makeImgurRequest(document.querySelector('#imageField').files[0]).then(function (imageData) {
            var image = "";

            if (imageData) {
                var data = JSON.parse(imageData).data;
                image = data.link;
            }

            return image;
        }).then(function (image) {
            document.querySelector('#imageURL').value = image;
            sendAjax($("#kitForm").attr("action"), $("#kitForm").serialize(), "POST", "json");
        });

        return false;
    });

    $("#changePassForm").on("submit", function (e) {
        e.preventDefault();

        $("#kitMessage").animate({ width: 'hide' }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '' || $("#newPass").val() == '') {
            handleError("RAWR! All fields are required");
            return false;
        }

        if ($("#pass").val() === $("#newPass").val()) {
            handleError("Passwords are the same");
            return false;
        }

        sendAjax($("#changePassForm").attr("action"), $("#changePassForm").serialize(), "POST", "json");

        return false;
    });

    $("#kitItemForm").on("submit", function (e) {
        e.preventDefault();

        document.querySelector("#newCsrf").value = document.querySelector("#initCsrf").value;
        var imageF = document.querySelector('#itemImageField');
        $("#kitMessage").animate({ width: 'hide' }, 350);

        if ($("#kitItemName").val() == '') {
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
            document.querySelector('#itemImageURL').value = image;
            sendAjax($("#kitItemForm").attr("action"), $("#kitItemForm").serialize(), "POST", "json");
        });

        return false;
    });

    $('#addLinkButton').on("click", function (e) {
        return addItem(e, document.querySelector('#linkList'), 'Link', "");
    });
    $('#addKitForm').on("click", function (e) {
        return displayHideSection('makeKit', 'block');
    });
    $('#hideKitForm').on("click", function (e) {
        return displayHideSection('makeKit', 'none');
    });
});
