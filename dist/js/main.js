let restaurants,neighborhoods,cuisines;var map,markers=[],isMapVisible=!1;function toggleMap(){let e=document.body.querySelector(".section-map"),t=document.body.querySelector(".switch-view");isMapVisible?(e.classList.remove("show"),t.innerHTML="Show Map"):(e.classList.add("show"),t.innerHTML="Show List"),isMapVisible=!isMapVisible}document.addEventListener("DOMContentLoaded",e=>{window.addEventListener("online",DataSync.syncWithBackend),window.addEventListener("offline",e=>{HTMLHelper.postNotification({title:"Offline",status:"info",message:"You are offline."})}),navigator.onLine&&DataSync.syncWithBackend}),fetchNeighborhoods=((e=self.restaurants)=>{let t=DBHelper.parseNeighborhoods(e);self.neighborhoods=t,fillNeighborhoodsHTML(t)}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.body.querySelector("#neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(e=>{let t=DBHelper.parseCuisines(e);self.cuisines=t,fillCuisinesHTML(t)}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.body.querySelector("#cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),window.initMap=(()=>{const e=document.body.querySelector("#map");setMapSize=(()=>{e.style.height=0,e.style.height=document.body.querySelector(".section-map").clientHeight+"px"}),google.maps.event.addDomListener(window,"resize",setMapSize),self.map=new google.maps.Map(e,{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),HTMLHelper.setMapTabOrder(self.map),DBHelper.fetchRestaurants((e,t)=>{e&&(console.error("Could not fetch restaurants"),console.log(e)),self.restaurants=t,fillRestaurantsHTML(),fetchCuisines(t),fetchNeighborhoods(t),navigator.onLine&&DataSync.syncWithBackend}),setMapSize()});var updateRestaurantCount=0;function cleanInput(e){return document.createTextNode(String(e))}updateRestaurants=(()=>{const e=document.body.querySelector("#cuisines-select"),t=document.body.querySelector("#neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,a=e[n].value,r=t[s].value;self.selectedCuisine=a,self.selectedNeighborhood=r,DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,r,(e,t)=>{e||!t?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())}),updateRestaurantCount++,console.log(`Update Restaurants has run: ${updateRestaurantCount} times`)}),resetRestaurants=(e=>{self.restaurants=[],document.body.querySelector(".restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{(!e||e.length<1)&&console.log("There aren't any restaurants, server may be offline");const t=document.body.querySelector(".restaurants-list");e.forEach((e,n)=>{t.append(createRestaurantHTML(e))}),addMarkersToMap();const n=self.selectedCuisine,s=self.selectedNeighborhood;if(e.length<1){let e=document.createElement("li");e.innerHTML=`No restaurant reviews found for <wbr> ${n} cuisine in ${s}.`,e.setAttribute("aria-role","alert"),e.setAttribute("aria-live","polite"),t.append(e)}lozad().observe()}),createRestaurantHTML=(e=>{const t=document.createElement("li"),n=document.createElement("a");n.href=DBHelper.urlForRestaurant(e);const s=document.createElement("h1");s.appendChild(cleanInput(e.name)),s.className="restaurant-name",n.appendChild(s);const a=document.createElement("div");a.className="restaurant-info-wrapper";const r=document.createElement("div");r.className="restaurant-info-text";const o=document.createElement("div");o.className="rating";const i=parseInt(e.total_stars)||0,l=parseInt(e.total_reviews)||0;let d;const c=document.createElement("p");if(l>0){d=(i/l).toFixed(1),c.appendChild(cleanInput(d)),c.setAttribute("aria-label",`Average rating ${c.innerHTML}`),c.className="rating-text",o.appendChild(c);const e=document.createElement("p");e.innerHTML=DBHelper.rating2stars(d),e.className="rating-stars",e.setAttribute("aria-hidden","true"),o.appendChild(e)}const u=document.createElement("p"),p=l?`${l} Reviews`:"No Reviews Yet";u.appendChild(cleanInput(p)),u.className="review-count",o.appendChild(u),r.appendChild(o);const m=document.createElement("p");e.neighborhood&&(m.appendChild(cleanInput(e.neighborhood)),r.appendChild(m));const h=document.createElement("p");e.address?h.innerHTML=e.address.replace(", ","<br>"):h.innerText="Address not listed",r.appendChild(h),a.appendChild(r);const f=HTMLHelper.generateImgHTML(e,200,[200,400,600,800],"200px");f.classList.add("restaurant-img"),a.appendChild(f),n.appendChild(a),n.setAttribute("data-rest-id",e.id),n.addEventListener("mouseenter",t=>{b(t,e.id)}),n.addEventListener("focus",t=>{b(t,e.id)}),n.addEventListener("mouseleave",t=>{M(t,e.id)}),n.addEventListener("blur",t=>{M(t,e.id)}),t.append(n);const g=document.createElement("button");return g.classList.add("options__favorite"),g.setAttribute("data-rest-id",e.id),HTMLHelper.initFavElement(g,e.is_favorite),t.append(g),t;function b(e,t){self.markers.find(e=>e.rest_id==t).setAnimation(google.maps.Animation.BOUNCE)}function M(e,t){self.markers.find(e=>e.rest_id==t).setAnimation(null)}}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})}),navigator.serviceWorker&&navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(e=>{console.log("sw registered")}).catch(e=>{console.log("sw error")});