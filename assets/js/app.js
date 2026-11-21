const COMMANDS=window.__COMMANDS__||[];
const ICONS=window.VANILLA_ICONS||{};
ICONS.home=ICONS.server;
const $=(id)=>document.getElementById(id);
const list=$("commandList"),search=$("searchInput"),categoryList=$("categoryList");
let selected=new URLSearchParams(location.search).get("category")||"Moderation",toastTimer,filteredCommands=[],currentPage=0;
const COMMANDS_PER_PAGE=40;
const prefixKey="vanilla-command-prefix";
function esc(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function iconFor(category){
 if(category==="All")return "star";
 const n=category.toLowerCase();
 if(n.includes("music")||n.includes("lastfm"))return "music";
 if(n.includes("mod")||n.includes("antinuke")||n.includes("raid")||n.includes("restrict")||n.includes("warn"))return "shield";
 if(n.includes("ticket"))return "ticket";
 if(n.includes("level")||n.includes("stat"))return "trend";
 if(n.includes("role")||n.includes("perm")||n.includes("owner"))return "key";
 if(n.includes("give")||n.includes("boost"))return "gift";
 if(n.includes("voice"))return "mic";
 if(n.includes("server")||n.includes("guild"))return "server";
 if(n.includes("file")||n.includes("dump")||n.includes("archive"))return "archive";
 if(n.includes("fun")||n.includes("game")||n.includes("animal")||n.includes("gambl"))return "dice";
 if(n.includes("social")||n.includes("profile")||n.includes("member")||n.includes("pfp")||n.includes("user")||n.includes("list"))return "users";
 if(n.includes("ban")||n.includes("ignore"))return "ban";
 if(n.includes("custom")||n.includes("config")||n.includes("setup"))return "hammer";
 if(n.includes("convert"))return "cs";
 if(n.includes("event")||n.includes("remind")||n.includes("calendar"))return "calendar";
 if(n.includes("auto")||n.includes("bot"))return "bot";
 if(n.includes("chat")||n.includes("feedback"))return "chat";
 if(n.includes("warn")||n.includes("error"))return "alert";
 if(n.includes("star")||n.includes("favorite"))return "star_alt";
 return "info";
}
function iconImage(name,cls=""){return '<img class="'+cls+'" src="'+(ICONS[name]||ICONS.info||"")+'" alt="" aria-hidden="true">'}
const categories=[...new Set(COMMANDS.map(x=>x.category))].sort((a,b)=>a.localeCompare(b));
if(!categories.includes(selected))selected=categories[0]||"All";
$("categoryCount").textContent=categories.length;
function groupItems(){return COMMANDS.filter(x=>selected==="All"||x.category===selected).sort((a,b)=>a.name.localeCompare(b.name))}
function renderCategories(){
 const all='<button class="category-item '+(selected==="All"?"selected":"")+'" data-category="All">'+iconImage("star","category-icon")+'<span>All commands</span><span class="category-count">'+COMMANDS.length+'</span></button>';
 const items=categories.map(name=>{
  const total=COMMANDS.filter(x=>x.category===name).length;
  return '<button class="category-item '+(selected===name?"selected":"")+'" data-category="'+esc(name)+'" title="'+esc(name)+'">'+iconImage(iconFor(name),"category-icon")+'<span>'+esc(name)+'</span><span class="category-count">'+total+'</span></button>'
 }).join("");
 categoryList.innerHTML=all+items;
 categoryList.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.category)));
}
function setCategory(name){
 selected=name;
 list.scrollTop=0;
 renderCategories();renderCommands();
}
function commandText(item){
 if(item.type==="Slash"||item.type==="Hybrid")return "/"+item.name;
 let prefix="";try{prefix=$("prefixInput").value||localStorage.getItem(prefixKey)||""}catch(_){}
 return prefix?prefix+item.name:item.name;
}
function commandMarkup(item){
 const usage=commandText(item),aliases=(item.aliases||[]).slice(0,8);
 const chips='<span class="meta-chip">'+esc(item.category)+'</span>'+(aliases.length?'<span class="meta-chip">Aliases: '+esc(aliases.join(", "))+'</span>':"");
 return '<article class="command-item"><button class="command-toggle" aria-expanded="false" title="Show command details"><span class="slash-mark">/</span><span class="command-name">'+esc(item.name)+'</span><i class="command-chevron"></i></button><div class="command-detail"><div class="detail-clip"><div class="detail-content"><p>'+esc(item.description||"Command from the vanilla bot.")+'</p><div class="detail-meta">'+chips+'<button class="copy-command" data-copy="'+esc(usage)+'">Copy command</button></div></div></div></div></article>';
}
function renderCommandPage(){
 const pageCount=Math.ceil(filteredCommands.length/COMMANDS_PER_PAGE);
 const start=currentPage*COMMANDS_PER_PAGE;
 const commands=filteredCommands.slice(start,start+COMMANDS_PER_PAGE);
 const pagination=pageCount>1?'<nav class="command-pagination" aria-label="Command pages"><button type="button" data-page-step="-1" '+(currentPage===0?'disabled':'')+'>Previous</button><span>Page '+(currentPage+1)+' of '+pageCount+'</span><button type="button" data-page-step="1" '+(currentPage===pageCount-1?'disabled':'')+'>Next</button></nav>':"";
 list.innerHTML=pagination+commands.map(commandMarkup).join("");
}
function renderCommands(){
 const source=groupItems();$("headingName").textContent=selected==="All"?"All Commands":selected;
 $("headingCount").textContent=source.length+" "+(source.length===1?"command":"commands");
 $("headingIcon").src=ICONS[iconFor(selected)]||ICONS.info;
 const query=search.value.trim().toLowerCase();
 filteredCommands=source.filter(item=>!query||[item.name,item.description,item.category,item.type,...(item.aliases||[])].join(" ").toLowerCase().includes(query));
 currentPage=0;list.scrollTop=0;list.innerHTML="";
 if(!filteredCommands.length){list.innerHTML='<div class="empty-state">'+iconImage("info")+'<strong>No commands found</strong><span>Try another search or select a different category.</span></div>';return}
 renderCommandPage();
}
async function copyText(value){
 try{await navigator.clipboard.writeText(value);showToast("Command copied")}
 catch(_){const input=document.createElement("textarea");input.className="clipboard-fallback";input.setAttribute("aria-hidden","true");input.value=value;document.body.append(input);input.select();let ok=false;try{ok=document.execCommand("copy")}catch(__){}input.remove();showToast(ok?"Command copied":"Clipboard unavailable")}
}
function showToast(text){const toast=$("toast");toast.textContent=text;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),1900)}
list.addEventListener("click",event=>{
 const pageButton=event.target.closest("[data-page-step]");
 if(pageButton&&!pageButton.disabled){currentPage+=Number(pageButton.dataset.pageStep);renderCommandPage();list.scrollTop=0;return}
 const copy=event.target.closest(".copy-command");
 if(copy){event.stopPropagation();copyText(copy.dataset.copy);return}
 const toggle=event.target.closest(".command-toggle");
 if(toggle){const card=toggle.closest(".command-item"),willOpen=!card.classList.contains("open");list.querySelectorAll(".command-item.open").forEach(openCard=>{openCard.classList.remove("open");openCard.querySelector(".command-toggle")?.setAttribute("aria-expanded","false")});if(willOpen){card.classList.add("open");toggle.setAttribute("aria-expanded","true")}}
});
$("headingIcon").src=ICONS[iconFor(selected)]||ICONS.info;
document.querySelectorAll("img[data-icon]").forEach(image=>{image.src=ICONS[image.dataset.icon]||ICONS.info});
search.addEventListener("input",renderCommands);
try{$("prefixInput").value=localStorage.getItem(prefixKey)||""}catch(_){}
$("prefixInput").addEventListener("input",()=>{try{localStorage.setItem(prefixKey,$("prefixInput").value)}catch(_){};renderCommands()});
$("navButton").addEventListener("click",()=>{const open=$("navMenu").classList.toggle("open");$("navButton").setAttribute("aria-expanded",String(open))});
document.addEventListener("click",event=>{if(!event.target.closest(".nav-wrap")){$("navMenu").classList.remove("open");$("navButton").setAttribute("aria-expanded","false")}});
$("navMenu").querySelectorAll(".nav-option").forEach(link=>link.addEventListener("click",()=>{$("navMenu").classList.remove("open");$("navButton").setAttribute("aria-expanded","false")}));
document.addEventListener("keydown",event=>{if(event.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){event.preventDefault();search.focus()}if(event.key==="Escape"){search.blur();$("navMenu").classList.remove("open");$("navButton").setAttribute("aria-expanded","false")}});
renderCategories();renderCommands();
