const ICONS=window.VANILLA_ICONS||{},COMMANDS=window.__COMMANDS__||[];
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.querySelectorAll("[data-home-icon]").forEach(img=>{img.src=ICONS[img.dataset.homeIcon]||ICONS.info});
const categoryNames=[...new Set(COMMANDS.map(x=>x.category))];
const featured=["Music","Moderation","Information","Fun","Server Setup","Leveling"].filter(name=>categoryNames.includes(name));
for(const name of categoryNames){if(featured.length>=6)break;if(!featured.includes(name))featured.push(name)}
document.getElementById("homeCommandCount").innerHTML=COMMANDS.length+'<small>COMMANDS</small>';
document.getElementById("heroCommandCount").textContent=COMMANDS.length;
document.getElementById("homeCategoryCount").innerHTML=categoryNames.length+'<small>CATEGORIES</small>';
const iconNames={Music:"music",Moderation:"shield",Information:"info",Fun:"dice","Server Setup":"server",Leveling:"trend",Customize:"hammer",Roles:"key",General:"star",Animals:"heart",Files:"archive"};
const featureCopy={Music:"Keep the soundtrack going with playback, queue controls, and more.",Moderation:"Tools to help keep conversations calm and your server in order.",Information:"Find the details you need about members, roles, and your server.",Fun:"Small surprises, playful commands, and ways to make chat more lively.","Server Setup":"Make the server yours with configuration and community tools.",Leveling:"Give active members a little recognition as they grow with your community."};
document.getElementById("featureGrid").innerHTML=featured.map((name,i)=>{
 const total=COMMANDS.filter(x=>x.category===name).length, icon=iconNames[name]||"bolt";
 return '<a class="feature-card reveal" href="commands.html?category='+encodeURIComponent(name)+'"><div class="feature-top"><span class="feature-icon"><img src="'+(ICONS[icon]||ICONS.info)+'" alt=""></span><span class="feature-index">0'+(i+1)+'</span></div><h3>'+esc(name)+'</h3><p>'+esc(featureCopy[name]||("Explore "+total+" commands in "+name+"."))+'</p><span class="feature-link">↗</span></a>'
}).join("");
const menu=document.getElementById("homeMenu"),menuButton=document.getElementById("homeMenuButton");
menuButton.addEventListener("click",()=>{const open=menu.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});
document.addEventListener("click",event=>{if(!event.target.closest(".home-nav-wrap")){menu.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}});
menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}));
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el))}else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
