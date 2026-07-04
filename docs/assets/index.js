const pageSize = 6;

const posts = Array.from(document.querySelectorAll("[data-post-item]"));
const noteReveal = document.querySelector("[data-note-reveal]");
const noteMore = document.querySelector("[data-note-more]");

let visibleCount = pageSize;

const render = () => {
  const end = Math.min(visibleCount, posts.length);
  const visible = new Set(posts.slice(0, end));

  posts.forEach((post) => {
    post.hidden = !visible.has(post);
    post.classList.toggle("is-last-visible", post === posts[end - 1]);
  });

  if (noteReveal && noteMore) {
    const remaining = posts.length - end;
    noteReveal.hidden = remaining <= 0;
    noteMore.hidden = end >= posts.length;
    noteMore.textContent = "Show more notes";
  }
};

noteMore?.addEventListener("click", () => {
  visibleCount += pageSize;
  render();
});

render();
