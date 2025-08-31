// Select elements
const searchBox = document.querySelector(".inputBox");
const searchBtn = document.querySelector(".inputButton");
const recipesContainer = document.querySelector(".recipes");
const searchResultHeading = document.querySelector(".searchResultHeading");
const detailRecipe = document.querySelector(".detailRecipe");

// Fetch meals from API
async function fetchMeals(query) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();
    console.log(data);
    return data.meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return null;
  }
}

// Render recipes list
function renderMeals(meals) {
  recipesContainer.innerHTML = "";

  if (!meals) {
    searchResultHeading.textContent = "No recipes found!";
    return;
  }

  searchResultHeading.textContent = "Search Results:";

  meals.forEach((meal) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipeContainer");

    recipeCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p class="mealName">${meal.strMeal}</p>
      <button class="getRecipeBtn" data-id="${meal.idMeal}">Get Recipe</button>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}

// Fetch single meal details
async function fetchMealDetails(id) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    return data.meals[0];
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return null;
  }
}

// Render modal details
function showMealDetails(meal) {
  detailRecipe.innerHTML = `
    <div class="detailRecipeContainer">
      <button class="CloseBtn">X</button>
      <div class="instruction">
        <h2 class="MealName">${meal.strMeal}</h2>
        <h4>${meal.strArea}</h4>
        <div class="photoInstruction">
          <img class="ImageInstruction" src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }">
          <p class="recipeInstruction">${meal.strInstructions}</p>
        </div>
        ${
          meal.strYoutube
            ? `<a class="watchVideo" href="${meal.strYoutube}" target="_blank">Watch Video</a>`
            : ""
        }
      </div>
    </div>
  `;

  detailRecipe.style.display = "block";
  document.body.classList.add("modal-open");
}

// Close modal
function closeModal() {
  detailRecipe.style.display = "none";
  document.body.classList.remove("modal-open");
}

// Event: Search button click
searchBtn.addEventListener("click", async () => {
  const query = searchBox.value.trim();
  if (!query) return;

  const meals = await fetchMeals(query);
  renderMeals(meals);
});

// Event: Enter key triggers search
searchBox.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Event: Get Recipe button click (delegation)
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("getRecipeBtn")) {
    const mealId = e.target.getAttribute("data-id");
    const meal = await fetchMealDetails(mealId);
    if (meal) {
      showMealDetails(meal);
    }
  }
});

// Event: Close modal (X button)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("CloseBtn")) {
    closeModal();
  }
});

// Event: Close modal (click outside container)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("detailRecipe")) {
    closeModal();
  }
});
