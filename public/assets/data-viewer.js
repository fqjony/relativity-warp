function setLinkState(link, href) {
  if (!link) {
    return;
  }
  if (!href) {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    return;
  }
  link.href = href;
  link.setAttribute("aria-disabled", "false");
}

function truncateString(value) {
  if (value.length <= 220) {
    return { text: value, full: null };
  }
  return { text: value.slice(0, 220) + "...", full: value };
}

function renderPrimitive(value) {
  var span = document.createElement("span");
  span.className = "data-value";

  if (value === null) {
    span.className += " is-null";
    span.textContent = "null";
    return span;
  }

  var type = typeof value;
  if (type === "string") {
    var trimmed = truncateString(value);
    span.className += " is-string";
    span.textContent = '"' + trimmed.text + '"';
    if (trimmed.full) {
      span.title = trimmed.full;
    }
    return span;
  }

  if (type === "number") {
    span.className += " is-number";
    span.textContent = String(value);
    return span;
  }

  if (type === "boolean") {
    span.className += " is-boolean";
    span.textContent = value ? "true" : "false";
    return span;
  }

  span.textContent = String(value);
  return span;
}

function renderEntry(key, value, depth) {
  var row = document.createElement("div");
  row.className = "data-entry";

  var keyEl = document.createElement("div");
  keyEl.className = "data-key";
  keyEl.textContent = key;

  var valueEl = document.createElement("div");
  valueEl.appendChild(renderValue(value, depth + 1));

  row.appendChild(keyEl);
  row.appendChild(valueEl);
  return row;
}

function renderValue(value, depth) {
  if (value === null || typeof value !== "object") {
    return renderPrimitive(value);
  }

  var details = document.createElement("details");
  details.className = "data-branch";
  if (depth < 2) {
    details.open = true;
  }

  var summary = document.createElement("summary");

  if (Array.isArray(value)) {
    summary.textContent = "Array (" + value.length + ")";
    details.appendChild(summary);

    var container = document.createElement("div");
    value.forEach(function (item, index) {
      container.appendChild(renderEntry("[" + index + "]", item, depth + 1));
    });

    if (!value.length) {
      container.appendChild(renderPrimitive("empty"));
    }

    details.appendChild(container);
    return details;
  }

  var keys = Object.keys(value);
  summary.textContent = "Object (" + keys.length + ")";
  details.appendChild(summary);

  var body = document.createElement("div");
  keys.forEach(function (key) {
    body.appendChild(renderEntry(key, value[key], depth + 1));
  });

  if (!keys.length) {
    body.appendChild(renderPrimitive("empty"));
  }

  details.appendChild(body);
  return details;
}

function renderMeta(item) {
  var meta = document.getElementById("data-viewer-meta");
  if (!meta) {
    return;
  }

  if (!item) {
    meta.textContent = "No dataset selected.";
    return;
  }

  var title = item.title || item.name || "Spectrum Entry";
  var description = item.description || "No description provided.";
  meta.textContent = title + " — " + description;
}

function renderPayload(item) {
  var output = document.getElementById("data-viewer-content");
  var link = document.getElementById("data-viewer-json");
  if (!output) {
    return;
  }

  output.innerHTML = "";
  if (!item || !item.path) {
    output.textContent = "Select a dataset to preview.";
    setLinkState(link, null);
    renderMeta(null);
    return;
  }

  renderMeta(item);
  setLinkState(link, item.path);

  fetch(item.path, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load dataset");
      }
      return response.json();
    })
    .then(function (data) {
      output.innerHTML = "";
      output.appendChild(renderValue(data, 0));
    })
    .catch(function () {
      output.textContent = "Unable to load dataset.";
    });
}

function normalizeItems(items) {
  var list = Array.isArray(items) ? items.slice() : [];
  var hasAll = list.some(function (item) {
    return item && item.path === "spectrum/all.json";
  });

  if (!hasAll) {
    list.unshift({
      name: "All Datasets",
      title: "All Datasets",
      description: "Combined payload for every available JSON dataset.",
      path: "spectrum/all.json",
    });
  }

  return list;
}

function initViewer(items, selectedPath) {
  var select = document.getElementById("data-viewer-select");
  if (!select) {
    return;
  }

  var list = normalizeItems(items);
  select.innerHTML = "";

  if (!list.length) {
    var emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "No datasets available";
    select.appendChild(emptyOption);
    renderPayload(null);
    return;
  }

  list.forEach(function (item, index) {
    var option = document.createElement("option");
    option.value = item.path || String(index);
    option.textContent = item.title || item.name || item.path || "Spectrum entry";
    select.appendChild(option);
  });

  if (!select.dataset.bound) {
    select.addEventListener("change", function () {
      var match = list.find(function (entry) {
        return entry.path === select.value;
      });
      renderPayload(match || list[0]);
    });
    select.dataset.bound = "true";
  }

  var initial =
    list.find(function (entry) {
      return entry.path === selectedPath;
    }) || list[0];
  select.value = initial.path || "";
  renderPayload(initial);
}

function loadSpectrumIndex() {
  var params = new URLSearchParams(window.location.search);
  var selected = params.get("src");

  fetch("spectrum/index.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load spectrum index");
      }
      return response.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : data.items;
      initViewer(items || [], selected);
    })
    .catch(function () {
      initViewer([], selected);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadSpectrumIndex();
});
