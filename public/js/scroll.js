/* Scrolls to specific position on screen.
 * Location: String that determines where to scroll on screnn.
 * Assumes that each section takes up a full page length (or more)
 */
function scrollto(location) {
  // Pre-compute the height of the major containers on the page
  let nav = getHeight("nav");
  let title = getHeight("title");
  let contact = getHeight("contact");
  let about = getHeight("about");

  // Jquery is used as the normal JS scrollTo() method wasn't working properly
  if (location == "contact") {
    console.log("Scrolling to contact section");
    // Subtracting nav since it is a sticky element that will block on the
    // section that we are navigating to.
    $('body').animate({ scrollTop: title + about - nav}, 0);
  } else if (location == "about") {
    console.log("Scrolling to about section");
    $('body').animate({ scrollTop:  title - nav }, 0);
  } else if (location == "home") {
    console.log("Scrolling to top");
    $('body').animate({ scrollTop: 0 }, 0);
  }
}

/*
 * Get the height (in pixels) of an element with a given id, includes margins.
 * returns 0 if element does not exist in document
 */
function getHeight(id) {
  let section = document.getElementById(id);
  if (section == null) { return 0; }
  let style = getComputedStyle(section);
  let height = section.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}
