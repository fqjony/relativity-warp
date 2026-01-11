function toggleCollapse(id) {
  var content = document.getElementById(id);
  var isActive = content.classList.contains("active");

  // Close all other collapsibles
  var allCollapsibles = document.querySelectorAll(".collapsible-content");
  allCollapsibles.forEach(function (item) {
    item.classList.remove("active");
  });

  // If the clicked one wasn't active, open it
  if (!isActive) {
    content.classList.add("active");
  }
}
