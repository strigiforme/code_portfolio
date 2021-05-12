function lookup(form) {
  // extract the search value
  var searchValue = form.search.value;
  // send a request to the server to fetch the posts with a similar title.
  fetch("http://howardpearce.ca/search_posts?search=" + searchValue).then( function (result) {
    result.json().then( function(text) {
      console.log(text.posts);
    })
  });
}
