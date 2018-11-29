const handleError = (message) => {
    $("#errorMessage").text(message);
    $('#errorModal').modal();
  }

const redirect = (response) => {
    $("#kitMessage").animate({width:'hide'}, 350);
    window.location = response.redirect;
};

// function responsible for sending AJAX requests to our server
// the external Imgur request is handled in another function
const sendAjax = (action, data, type, dataType, success) => {
    console.dir(data);
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: dataType,
      success: success,
      error: (xhr, status, error) => {
        const messageObj = JSON.parse(xhr.responseText);
  
        handleError(messageObj.error);
      }
    });        
  };