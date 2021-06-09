const attractionsContainer = document.getElementById("attractionsContainer");
const searchForm = document.getElementById("searchForm");
const searchKeyword = document.getElementById("searchKeyword");

let nextPage = 0;
let attractionsArray = [];
let readyToLoadAgain = false;
let keyword = null;

// ========= functions ===========

// fetch attractions api and get (called in loadAttractions function)
async function getAttractionsData(pageNum, keyword = null) {
  let apiUrl;
  if (keyword) {
    apiUrl = `/api/attractions?page=${pageNum}&keyword=${keyword}`;
  } else {
    apiUrl = `/api/attractions?page=${pageNum}`;
  }
  const response = await fetch(apiUrl);
  const data = await response.json();
  nextPage = data.nextPage;
  attractionsArray = data.data;
  return nextPage;
}

// check log in status
async function logInStatus() {
  try {
    const response = await fetch(`${window.origin}/api/user`);
    const data = await response.json();
    if (!data.data) {
      return false;
    } else {
      return true;
    }
  } catch {
    (err) => {
      console.log(`fetch error : ${err}`);
    };
  }
}

// check if logged in (if not, favorite feature cannot be used)
async function checkLogInBeforeFavarite() {
  try {
    const response = await fetch(`${window.origin}/api/user`);
    const data = await response.json();
    if (!data.data) {
      document.getElementById("logIn").classList.add("slide-in");
      document.getElementById("logIn").classList.add("show");
      return false;
    } else {
      return true;
    }
  } catch {
    (err) => {
      console.log(`fetch error : ${err}`);
    };
  }
}

// get favorite collection data
async function getFavoriteData() {
  try {
    const res = await fetch("/api/favorite", {
      method: "GET",
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log(`fetch error : ${err}`);
  }
}

//add to favorite collections
async function addFavoriteData(attractionId) {
  try {
    const res = await fetch("/api/favorite", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ attractionId: attractionId }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`fetch error : ${err}`);
  }
}

// remove from favorite collections
async function removeFavoriteData(attractionId) {
  try {
    const res = await fetch(`/api/favorite/${attractionId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`fetch error : ${err}`);
  }
}

// toggle Favorite (add and remove from favorite);
async function toggleFavorite(heart) {
  const logInStatus = await checkLogInBeforeFavarite();
  if (!logInStatus) {
    return;
  }
  heart.classList.add("pending");
  const attractionId = parseInt(heart.dataset.attractionId);
  if (!heart.classList.contains("selected")) {
    const data = await addFavoriteData(attractionId);
    if (data.ok) {
      heart.classList.remove("pending");
      heart.classList.add("selected");
    } else if (data.error) {
      heart.classList.remove("pending");
      alert(data.message);
    }
  } else if (heart.classList.contains("selected")) {
    const data = await removeFavoriteData(attractionId);
    if (data.ok) {
      heart.classList.remove("pending");
      heart.classList.remove("selected");
    } else if (data.error) {
      heart.classList.remove("pending");
      alert(data.message);
    }
  }
}

// create single attraction item (called in showAttractions function)
function createAttractionItem(attraction, favoriteIds) {
  const attractionBox = document.createElement("article");
  attractionBox.classList.add("attraction-box");

  const heart = document.createElement("div");
  heart.dataset.attractionId = attraction.id;
  heart.classList.add("heart");
  heart.classList.add("loading");
  heart.innerHTML =
    '<svg viewBox="0 0 24 24" style="pointer-events: none; width: 24px; height: 24px; display: block;"><g class="favorite"><path d="M12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4z"></path></g></svg>';

  const heartPendingLoader = document.createElement("div");
  heartPendingLoader.classList.add("heart-loader");

  heart.appendChild(heartPendingLoader);

  const linkContainer = document.createElement("a");
  linkContainer.href = `/attraction/${attraction.id}`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const loadingSpinner = document.createElement("div");
  loadingSpinner.classList.add("loader");

  const attractionImage = document.createElement("img");
  attractionImage.src = attraction.images[0];
  attractionImage.classList.add("loading");

  imageContainer.appendChild(attractionImage);
  imageContainer.appendChild(loadingSpinner);

  const attractionTextContainer = document.createElement("div");
  attractionTextContainer.classList.add("attraction-text-container");

  const attractionTitle = document.createElement("p");
  attractionTitle.classList.add("attraction-title");
  attractionTitle.textContent = attraction.name;

  const attractionInfo = document.createElement("div");
  attractionInfo.classList.add("attraction-info");

  const attractionMrt = document.createElement("p");
  attractionMrt.classList.add("attraction-mrt");
  attractionMrt.textContent = attraction.mrt ? attraction.mrt : "無鄰近捷運站";

  const attractionCategory = document.createElement("p");
  attractionCategory.classList.add("attraction-category");
  attractionCategory.textContent = attraction.category;

  attractionInfo.appendChild(attractionMrt);
  attractionInfo.appendChild(attractionCategory);

  attractionTextContainer.appendChild(attractionTitle);
  attractionTextContainer.appendChild(attractionInfo);

  linkContainer.appendChild(imageContainer);
  linkContainer.appendChild(attractionTextContainer);

  attractionBox.appendChild(linkContainer);
  attractionBox.appendChild(heart);

  if (favoriteIds.includes(attraction.id)) {
    heart.classList.add("selected");
  }

  attractionImage.addEventListener("load", () => {
    loadingSpinner.hidden = true;
    attractionImage.classList.remove("loading");
    heart.classList.remove("loading");
  });

  heart.addEventListener("click", () => toggleFavorite(heart));

  return attractionBox;
}

// show all attractions in the same page (called in loadAttractions function)
async function showAttractions() {
  if (attractionsArray.length) {
    const isLogIn = await logInStatus();
    const favoriteIds = [];
    if (isLogIn) {
      const favorites = await getFavoriteData();
      if (favorites) {
        for (let favorite of favorites) {
          favoriteIds.push(favorite.id);
        }
      }
    }
    for (let attraction of attractionsArray) {
      const attractionBox = createAttractionItem(attraction, favoriteIds);
      attractionsContainer.appendChild(attractionBox);
    }
  } else if (!attractionsContainer.firstChild) {
    const message = document.createElement("span");
    message.textContent = "未找到符合關鍵字的景點";
    attractionsContainer.appendChild(message);
  }
}

// load and visualize attractions
async function loadAttractions(keyword = null) {
  if (nextPage !== null) {
    nextPage = await getAttractionsData(nextPage, keyword);
    showAttractions();
    readyToLoadAgain = true;
  }
}

// =========== initial load and event listener ========

// initial load
loadAttractions();

// infinite scroll : listen of scroll event
if (nextPage !== null) {
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.getBoundingClientRect().bottom && readyToLoadAgain) {
      loadAttractions(keyword);
      readyToLoadAgain = false;
    }
  });
}

// attraction keyword search : submit search form
searchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  attractionsContainer.innerHTML = "";
  nextPage = 0;
  keyword = searchKeyword.value;
  loadAttractions(keyword);
});
