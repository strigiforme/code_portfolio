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

  var moduleHTML = get_module_html(selector.value).then( result => {
    if ( result ) {
      // render the string and turn it into HMTL
      var newModule = htmlToElement(result);
      // add module HTML to end of form
      // container.insertAdjacentHTML('beforeend', result);
      // grab the module we just inserted
      container.appendChild(label_module(status_container, newModule, selector.value))
    } else {
      result_container.innerHTML = "unable to load module";
    }
  }).catch( error => {
    result_container.innerHTML = "unable to load module";
    console.warn("Unable to load new module: " + error);
  });
}

function label_module(counter, container, name) {
  var module_count = counter.getAttribute("data-" + name);
  var new_name;
  var count = "1";

  // increment the module count
  if (module_count) { count = Number(module_count) + 1; }
  var new_name = name + count;

  container.id = new_name
  container.childNodes.forEach( element => {
    if (element.hasAttribute("for")) {
      element.setAttribute("for", new_name);
    }
    if (element.hasAttribute("name")) {
      element.setAttribute("name", new_name);
    }
    element.id = new_name;
  });

  counter.setAttribute("data-" + name, count);
  return container;
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
 * @returns {string} HTML string of required inputs for module.
 * @throws Will throw if the module queried for does not exist.
 */
function get_module_html(name) {
  return new Promise( (resolve, reject) => {
    fetch("https://howardpearce.ca/get_module_html?module=" + name).then(result => {
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
