const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#kitMessage").animate({width:'toggle'},350);
}

// helper method for displaying or hiding a small section
const displayHideSection = (sectionID, displayStyle) => {
  const section = document.querySelector(`#${sectionID}`);
  section.style.display = displayStyle;
}

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

  var thing = $("#changePassForm");
  console.log(thing);

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

  $('#addKitForm').on("click", (e) => displayHideSection('makeKit', 'block'));
  $('#hideKitForm').on("click", (e) => displayHideSection('makeKit', 'none'));
});