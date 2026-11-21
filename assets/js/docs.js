const ICONS=window.VANILLA_ICONS||{};
document.querySelectorAll("[data-doc-icon]").forEach(img=>{img.src=ICONS[img.dataset.docIcon]||ICONS.info});
document.querySelectorAll("img[data-icon]").forEach(img=>{img.src=ICONS[img.dataset.icon]||ICONS.info});
const navMenu=document.getElementById("navMenu"),navButton=document.getElementById("navButton");
navButton.addEventListener("click",()=>{const open=navMenu.classList.toggle("open");navButton.setAttribute("aria-expanded",String(open))});
document.addEventListener("click",event=>{if(!event.target.closest(".nav-wrap")){navMenu.classList.remove("open");navButton.setAttribute("aria-expanded","false")}});
navMenu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{navMenu.classList.remove("open");navButton.setAttribute("aria-expanded","false")}));
const docsSearch=document.getElementById("docsSearch");
docsSearch.addEventListener("input",()=>{const q=docsSearch.value.trim().toLowerCase();document.querySelectorAll(".doc-card").forEach(card=>{card.hidden=!!q&&!(card.dataset.doc+" "+card.innerText).toLowerCase().includes(q)});document.querySelectorAll(".docs-nav a").forEach(link=>{const section=document.querySelector(link.getAttribute("href"));link.hidden=section.hidden})});
const navLinks=[...document.querySelectorAll(".docs-nav a")];
navLinks.forEach(link=>link.addEventListener("click",()=>{navLinks.forEach(x=>x.classList.toggle("active",x===link))}));
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle("active",link.hash==="#"+entry.target.id))}}),{rootMargin:"-18% 0px -68% 0px"});document.querySelectorAll(".doc-card").forEach(section=>observer.observe(section))}
document.addEventListener("keydown",event=>{if(event.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){event.preventDefault();docsSearch.focus()}if(event.key==="Escape"){docsSearch.blur();navMenu.classList.remove("open");navButton.setAttribute("aria-expanded","false")}});

