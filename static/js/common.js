// ---scroll top
function scrollToTop() {
  scrollTo({
    behavior: "smooth",
    left: 0,
    top: 0,
  });
}
// ---modal fade in・out(/admin/mail,/admin/production_content)
function modalFadeOut() {
  const modal = document.getElementById("modal");
  modal.style.display = 'none';
}
function modalFadeIn() {
  const modal = document.getElementById("modal");
  modal.style.display = 'block';
}
// ---header menu fade in・out(all page)
function menuFadeOut() {
  const menu = document.getElementById("menu");
  menu.style.display = 'none';
}
function menuFadeIn() {
  const menu = document.getElementById("menu");
  menu.style.display = 'block';
}

// ---映画追加パネル fade in・out(/admin/screen_schedule)
function panelFadeOut() {
  const panel = document.getElementById("panel");
  const panelShow = document.getElementById("panel_show");
  panel.style.display = 'none';
  panelShow.style.display = 'block';
}
function panelFadeIn() {
  const panel = document.getElementById("panel");
  const panelShow = document.getElementById("panel_show");
  panel.style.display = 'block';
  panelShow.style.display = 'none';
}
// ---scroll screen(/admin/screen_schedule)
function scrollScreen(self) {
  const target = document.getElementById(self.innerHTML);
  const point = target.getBoundingClientRect()
  const howLong = point.top - 160;

  scrollTo({
    behavior: "smooth",
    left: 0,
    top: howLong,
  });
}


