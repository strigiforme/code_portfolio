var typeMap = { "blog": "<i class = 'fa fa-book'></i>", "info": "<i class = 'fa fa-info-circle'></i>", "project": "<i class = 'fa fa-code'></i>"}

/* Called as action for any form to perform an AJAX search request
 */
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

/**
 * Loads in the HTML for a new module into the create document page.
 * @param {string} insertionId - the HTML id for the element to insert the module HTML into.
 * @param {string} seletorId - the ID of the selector containing the type of module to load.
 */
function load_new_module(insertionId, selectorId) {
  var container = document.getElementById(insertionId);
  var selector = document.getElementById(selectorId);
  var result_container = document.getElementById("result");
  var status_container = document.getElementById("status");
  var count = get_module_count(status_container, selector.value);

  var moduleHTML = get_module_html(selector.value, count).then( result => {
    if ( result ) {
      // render the string and turn it into HMTL
      var newModule = htmlToElement(result);
      // add module HTML to end of form
      container.appendChild(newModule);
      // increment count of # of modules
      status_container.setAttribute(`data-${selector.value}`, count);
    } else {
      result_container.innerHTML = "Unable to load module";
    }
  }).catch( error => {
    result_container.innerHTML = "Unable to load module";
    console.warn("Unable to load new module: " + error);
  });
}

/**
 * Get the number of times this module has been instantiated
 * @param {element} counter - The HTML element that holds the # of modules instantiated
 * @param {string} name - the name of the module
 * @returns {number} the number of times this module is already displayed on screen
 */
function get_module_count(counter, name) {
  // check how many times this module has been loaded
  var module_count = counter.getAttribute("data-" + name);
  if (module_count) {
    module_count = Number(module_count) + 1;
  } else {
    module_count = 1;
  }
  return Number(module_count);
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  var parser = new DOMParser();
	var doc = parser.parseFromString(html, 'text/html');
	return doc.body.childNodes[0];
}

/**
 * Retrieve HTML for module by name from backed.
 * @param {string} name - the name of the module.
 * @param {number} count - How many of these modules currently exist on-page
 * @returns {string} HTML string of required inputs for module.
 * @throws Will throw if the module queried for does not exist.
 */
function get_module_html(name, count) {
  return new Promise( (resolve, reject) => {
    fetch("https://howardpearce.ca/get_module_html?module=" + name + "&count=" + count).then(result => {
      if (result.ok) {
        result.json().then( response => {
           resolve(response.html);
        }).catch( error => {
          reject("Unable to parse JSON: " + error);
        });
      } else {
        reject("Module '" + name + "' could not be found.");
      }
    }).catch( error => {
      reject("Fetch request failed! " + error);
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
