(function () {
  var bar = document.getElementById("progressbar");
  if (!bar) return;
  var onScroll = function () {
    var h = document.documentElement;
    var scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = scrolled + "%";
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
