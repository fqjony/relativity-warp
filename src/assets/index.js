const pageSize = 6;

const posts = Array.from(document.querySelectorAll("[data-post-item]"));
const postCount = document.querySelector("[data-post-count]");
const pagination = document.querySelector("[data-pagination]");
const pagePrev = document.querySelector("[data-page-prev]");
const pageNext = document.querySelector("[data-page-next]");
const pageStatus = document.querySelector("[data-page-status]");

let currentPage = 1;

const render = () => {
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, posts.length);
  const visible = new Set(posts.slice(start, end));

  posts.forEach((post) => {
    post.hidden = !visible.has(post);
  });

  if (postCount) {
    postCount.textContent = `${posts.length} ${posts.length === 1 ? "post" : "posts"}`;
  }

  if (pagination && pageStatus && pagePrev && pageNext) {
    pagination.hidden = posts.length <= pageSize;
    pageStatus.textContent = `Showing ${start + 1}-${end} of ${posts.length}`;
    pagePrev.disabled = currentPage === 1;
    pageNext.disabled = currentPage === pageCount;
  }
};

pagePrev?.addEventListener("click", () => {
  currentPage = Math.max(1, currentPage - 1);
  render();
});

pageNext?.addEventListener("click", () => {
  currentPage += 1;
  render();
});

render();
