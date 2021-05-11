function lookup(form) {
  var searchValue = form.search.value;
  fetch("http://howardpearce.ca/test").then( function (result) {
    result.json().then( function(text) {
      console.log(text.text);
    })
  });
}
