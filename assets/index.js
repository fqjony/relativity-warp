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

function renderResearchLinks(items) {
  var container = document.getElementById("research-links");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!items || !items.length) {
    var empty = document.createElement("p");
    empty.className = "list-item";
    empty.textContent = "• No research entries yet.";
    container.appendChild(empty);
    return;
  }

  items.forEach(function (item) {
    var row = document.createElement("p");
    row.className = "list-item";
    row.appendChild(document.createTextNode("• "));

    var link = document.createElement("a");
    link.href = item.url || item.path || "#";
    link.textContent = item.title || item.url || item.path;
    link.target = "_blank";
    link.rel = "noopener";

    row.appendChild(link);
    container.appendChild(row);
  });
}

function loadResearchLinks() {
  fetch("research/index.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load research index");
      }
      return response.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : data.items;
      renderResearchLinks(items || []);
    })
    .catch(function () {
      renderResearchLinks([]);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadResearchLinks();
});
