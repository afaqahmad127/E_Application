  var mybutton = document.getElementById("myBtn");
  
  window.onscroll = function() {scrollFunction()};
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

/*Home Button */


$(document).ready(function() {
    $('.btnfile').on('click', function() {
      $('.file').trigger('click');
    });
  
    $('.file').on('change', function() {
      var fileName = $(this)[0].files[0].name;    
      $('#file-name').val(fileName);
    });
  })

/*Date of birth button */



    