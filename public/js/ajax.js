var typeMap = { "blog": "<i class = 'fa fa-book'></i>", "info": "<i class = 'fa fa-info-circle'></i>", "project": "<i class = 'fa fa-code'></i>"}

function lookup(form) {
  // extract the search value
  var searchValue = form.search.value;
  // send a request to the server to fetch the posts with a similar title.
  fetch("http://howardpearce.ca/search_posts?search=" + searchValue).then( result => {
    result.json().then( response => {
      // search result goes in here
      var postContainer = document.getElementById("post_search_container");
      var innerHTML = "";
      // was anything returned?
      if (Object.keys(response.posts).length > 0) {
        for (var post of response.posts) {
          if ( typeMap[post.type] != undefined ) {
            innerHTML += build_post_result_string(post._id, post.title, typeMap[post.type]);
          } else {
            innerHTML += build_post_result_string(post._id, post.title, "<i class = 'fa fa-question-circle'></i>");
          }
        }
      } else {
        innerHTML += "<div class='post-container'><p> <i class = 'fa fa-question-circle'></i> &nbsp; No search results found </p></div>";
      }
      // place the results into the container
      postContainer.innerHTML = innerHTML;
    }).catch( error => {
      // canned error message
    });
  });
}

/* Builds an html entry for a post as a string
 * id {string}:    the post's ID, for creating links
 * title {string}: the post's title
 * icon {string}:  an html string with a font-awesome icon that categorizes the post based on type.
 */
function build_post_result_string(id, title, icon) {
  return `<div class='post-container'>
              <a href='/posts/view_post?id=${id}'>
                ${icon}
                &nbsp; ${title}
              </a>
              <div class='edit-controls-container'>
                <form action = '/posts/delete_post' method='POST'>
                  <input type='text' name='id' value='${id}' hidden>
                  <button type='submit'>
                    <i class='fa fa-trash'></i>
                  </button>
                </form>
                <form action = '/posts/edit_post' method='POST'>
                  <input type='text' name='id' value='${id}' hidden>
                  <button type='submit'>
                    <i class='fa fa-pencil-square'></i>
                  </button>
                </form>
              </div>
            </div>`;
}
