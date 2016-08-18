$(document).ready(function() {
  console.log("Beginning");
    getBooks();

    // add a book
    $('#book-submit').on('click', postBook);

    $('#book-list').on('click', '.update', putBook);
    $('#book-list').on('click', '.delete', deleteBook);
    // $("#genres").change(filterBooks);

    //need an event listener and a function; create a new GET request copy getBooks;

});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  console.log("Start of getBooks");
    $.ajax({
        type: 'GET',
        url: '/books/',
        success: function(books) {
            console.log('GET /books returns:', books);
            books.forEach(function(book) {
                var $el = $('<div></div>');

                var bookProperties = ['title', 'author', 'published', 'genre'];

                bookProperties.forEach(function(property) {
                    var inputType = 'text';
                    if (property == 'published') {
                        //inputType = 'date';
                        //get strings for month/day/year
                        book[property] = new Date(book[property]);      
                        var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                                    
                        var day = book[property].getUTCDate(book[property]);            
                        var year = book[property].getUTCFullYear(book[property]);

                                     //catcatcanate into one string month/day/year and set to book.published as text
                                    
                        book[property] = month + "/" + day + "/" + year;
                    }

                    console.log('properties', book[property]);

                    var $input = $('<input type="' + inputType + '" id="' + property + '"name="' + property + '" />');
                    $input.val(book[property]);
                    $el.append($input);
                });

                $el.data('bookId', book.id);
                $el.append('<button class="update">Update</button>');
                $el.append('<button class="delete">Delete</button>');

                $('#book-list').append($el);
            });
        },

        error: function(response) {
            console.log('GET /books fail. No books could be retrieved!');
        },
    });
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
    event.preventDefault();

    var book = {};

    $.each($('#book-form').serializeArray(), function(i, field) {
        book[field.name] = field.value;
    });

    console.log('book: ', book);

    $.ajax({
        type: 'POST',
        url: '/books',
        data: book,
        success: function() {
            console.log('POST /books works!');
            $('#book-list').empty();
            getBooks();
        },

        error: function(response) {
            console.log('POST /books does not work...');
        },
    });
}

function putBook() {
    var book = {};
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        book[field.name] = field.value;
    });

    console.log('book we are putting', book);

    var bookId = $(this).parent().data('bookId');

    $.ajax({
        type: 'PUT',
        url: '/books/' + bookId,
        data: book,
        success: function() {
            $('#book-list').empty();
            getBooks();
        },

        error: function() {
            console.log('Error PUT /books/' + bookId);
        },
    });
}

function deleteBook() {
  var bookId = $(this).parent().data("bookId");
  $.ajax({
    type: 'DELETE',
    url: "/books/" + bookId,
    success: function () {
      console.log("DELETE success");
      $("#book-list").empty();
      getBooks();
    },
    error: function() {
      console.log("DELETE failed");
    }

  });

}

function filterBooks() {
  var dropValue = $('#genres :selected').val();   ///pulled form values of what is selected in drop
  $.ajax({
      type: 'GET',
      url: '/books' + dropValue,
      success: function(books) {            //books is an object; in postbook empty book object
          console.log('GET /books returns:', books);
          $("#book-list").empty();
          books.forEach(function(book) {
              var $el = $('<div></div>');

              var bookProperties = ['title', 'author', 'published', 'genre'];

              bookProperties.forEach(function(property) {
                  var inputType = 'text';
                  if (property == 'published') {
                      //inputType = 'date';
                      //get strings for month/day/year
                      book[property] = new Date(book[property]);      
                      var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                                  
                      var day = book[property].getUTCDate(book[property]);            
                      var year = book[property].getUTCFullYear(book[property]);

                                   //catcatcanate into one string month/day/year and set to book.published as text
                                  
                      book[property] = month + "/" + day + "/" + year;
                  }

                  console.log('properties', book[property]);

                  var $input = $('<input type="' + inputType + '" id="' + property + '"name="' + property + '" />');
                  $input.val(book[property]);
                  $el.append($input);
              });

              $el.data('bookId', book.id);
              $el.append('<button class="update">Update</button>');
              $el.append('<button class="delete">Delete</button>');

              $('#book-list').append($el);
          });
      },

      error: function(response) {
          console.log('GET /books fail. No books could be retrieved!');
      },
  });






}
