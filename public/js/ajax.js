function lookup(form) {
  // extract the search value
  var searchValue = form.search.value;
  // send a request to the server to fetch the posts with a similar title.
  fetch("http://howardpearce.ca/search_posts?search=" + searchValue).then( result => {
    result.json().then( response => {
      // was anything returned?
      if (Object.keys(response.posts).length > 0) {
        console.log("results");
        var postContainer = document.getElementById("post_search_container");
        var innerHTML = "";
        for (var post of response.posts) {
          innerHTML += "<p>" + post.title + "</p>";
        }
        postContainer.innerHTML = innerHTML;
      } else {
        console.log("no results");
      }
    }).catch( error => {
      // canned error message
    });
  });
}
