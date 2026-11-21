const ICONS=window.VANILLA_ICONS||{};
document.querySelectorAll("img[data-icon]").forEach(img=>{img.src=ICONS[img.dataset.icon]||ICONS.info});
const menu=document.getElementById("navMenu"),button=document.getElementById("navButton");
button.addEventListener("click",()=>{const open=menu.classList.toggle("open");button.setAttribute("aria-expanded",String(open))});
document.addEventListener("click",event=>{if(!event.target.closest(".nav-wrap")){menu.classList.remove("open");button.setAttribute("aria-expanded","false")}});
menu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{menu.classList.remove("open");button.setAttribute("aria-expanded","false")}));
document.addEventListener("keydown",event=>{if(event.key==="Escape"){menu.classList.remove("open");button.setAttribute("aria-expanded","false")}});
