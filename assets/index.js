var tipsCache = [];

function flattenTips(groups) {
  if (!Array.isArray(groups)) {
    return [];
  }

  var flattened = [];
  groups.forEach(function (group) {
    if (!group || !Array.isArray(group.Tips)) {
      return;
    }
    group.Tips.forEach(function (tip) {
      if (!tip || !tip.Tip) {
        return;
      }
      flattened.push({
        Tip: tip.Tip,
        Why: tip.Why,
        Group: group.Group || "General",
      });
    });
  });

  return flattened;
}

function renderTip(tip) {
  var container = document.getElementById("tip-widget");
  if (!container) {
    return;
  }

  var title = container.querySelector(".tip-inline-title");
  var body = container.querySelector(".tip-inline-body");

  if (!title || !body) {
    container.innerHTML = "";
    title = document.createElement("div");
    title.className = "tip-inline-title";
    body = document.createElement("div");
    body.className = "tip-inline-body";
    container.appendChild(title);
    container.appendChild(body);
  }

  if (!tip) {
    title.textContent = "Tip";
    body.textContent = "No tips available.";
    return;
  }

  title.textContent = tip.Group || "Tip";
  body.textContent = tip.Tip || "";
}

function pickRandomTip() {
  if (!tipsCache.length) {
    renderTip(null);
    return;
  }

  var index = Math.floor(Math.random() * tipsCache.length);
  renderTip(tipsCache[index]);
}

function loadTips() {
  return fetch("spectrum/engineering-tips.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load tips");
      }
      return response.json();
    })
    .then(function (data) {
      tipsCache = flattenTips(data);
      pickRandomTip();
    })
    .catch(function () {
      tipsCache = [];
      renderTip(null);
    });
}

var explorerCache = [];

function setExplorerStatus(message) {
  var output = document.getElementById("data-explorer-output");
  if (output) {
    output.textContent = message;
  }
}

function renderExplorerMeta(item) {
  var meta = document.getElementById("data-explorer-meta");
  var link = document.getElementById("data-explorer-link");
  var humanLink = document.getElementById("data-explorer-human");
  if (!meta) {
    return;
  }

  if (!item) {
    meta.textContent = "No dataset selected.";
    if (link) {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    }
    if (humanLink) {
      humanLink.removeAttribute("href");
      humanLink.setAttribute("aria-disabled", "true");
    }
    return;
  }

  var title = item.title || item.name || "Spectrum Entry";
  var description = item.description || "No description provided.";
  meta.textContent = title + " — " + description;

  if (link && item.path) {
    link.href = item.path;
    link.setAttribute("aria-disabled", "false");
  }

  if (humanLink && item.path) {
    humanLink.href = "data-viewer.html?src=" + encodeURIComponent(item.path);
    humanLink.setAttribute("aria-disabled", "false");
  }
}

function loadExplorerPayload(item) {
  if (!item || !item.path) {
    setExplorerStatus("Select a dataset to preview.");
    renderExplorerMeta(null);
    return;
  }

  setExplorerStatus("Loading data...");
  renderExplorerMeta(item);

  fetch(item.path, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load dataset");
      }
      return response.json();
    })
    .then(function (data) {
      setExplorerStatus(JSON.stringify(data, null, 2));
    })
    .catch(function () {
      setExplorerStatus("Unable to load dataset.");
    });
}

function initDataExplorer(items) {
  var select = document.getElementById("data-explorer-select");
  var copyButton = document.getElementById("data-explorer-copy");
  if (!select) {
    return;
  }

  explorerCache = Array.isArray(items) ? items : [];
  select.innerHTML = "";

  if (!explorerCache.length) {
    var emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "No datasets available";
    select.appendChild(emptyOption);
    loadExplorerPayload(null);
    return;
  }

  var hasAll = explorerCache.some(function (item) {
    return item && item.path === "spectrum/all.json";
  });

  if (!hasAll) {
    explorerCache = [
      {
        name: "All Datasets",
        title: "All Datasets",
        description: "Combined payload for every available JSON dataset.",
        path: "spectrum/all.json",
      },
    ].concat(explorerCache);
  }

  explorerCache.forEach(function (item, index) {
    var option = document.createElement("option");
    option.value = item.path || String(index);
    option.textContent = item.title || item.name || item.path || "Spectrum entry";
    select.appendChild(option);
  });

  if (!select.dataset.bound) {
    select.addEventListener("change", function () {
      var match = explorerCache.find(function (entry) {
        return entry.path === select.value;
      });
      loadExplorerPayload(match || explorerCache[0]);
    });
    select.dataset.bound = "true";
  }

  if (copyButton && !copyButton.dataset.bound) {
    copyButton.addEventListener("click", function () {
      var output = document.getElementById("data-explorer-output");
      if (!output || !output.textContent) {
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.textContent);
      }
    });
    copyButton.dataset.bound = "true";
  }

  select.value = explorerCache[0].path || "";
  loadExplorerPayload(explorerCache[0]);
}

function loadSpectrumIndex() {
  return fetch("spectrum/index.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load spectrum index");
      }
      return response.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : data.items;
      initDataExplorer(items || []);
    })
    .catch(function () {
      initDataExplorer([]);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  Promise.allSettled([loadTips(), loadSpectrumIndex()]);

  var themeToggle = document.getElementById("theme-toggle");
  var themeJoke = document.getElementById("theme-tooltip");
  var tooltipTimer;

  var themeJokes = [
    "Starlight says: keep the orbit steady.",
    "Starlight hums best in the dark.",
    "Starlight approves: hold the line.",
  ];

  function pickThemeJoke() {
    return themeJokes[Math.floor(Math.random() * themeJokes.length)];
  }

  function showThemeTooltip(message) {
    if (!themeJoke) {
      return;
    }
    themeJoke.textContent = message;
    themeJoke.classList.add("is-visible");
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function () {
      themeJoke.classList.remove("is-visible");
    }, 1800);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      showThemeTooltip(pickThemeJoke());
    });
  }

  var refreshButton = document.getElementById("tip-refresh");
  if (refreshButton) {
    refreshButton.addEventListener("click", function () {
      if (!tipsCache.length) {
        loadTips();
        return;
      }
      pickRandomTip();
    });
  }
});
