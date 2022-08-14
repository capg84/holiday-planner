// if user clicks search button, show searches
$(".ui.orange.button").click(function(){
  event.preventDefault();

  var searchInput = document.getElementById("search-text").value;

  if (!searchInput) {
    console.log("No search input");
  }

  var searchQuery = "./search.html?q=" + searchInput;

  location.assign(searchQuery);
  console.log(searchQuery);
  console.log(searchInput);
  
})

