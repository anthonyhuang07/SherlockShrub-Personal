// #region API requests, etc.
const form = document.getElementById('upload-form');
const input = document.getElementById('image-upload');
const button = document.getElementById('upload-button');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'vBIyA0SGEtN343TmVX2L9ho0CqCjyod15pg9sGpLXM3FHNWkN9'
        },
        body: JSON.stringify({
          images: [dataUrl.split(',')[1]],
          "plant_details": ["common_names", "wiki_image", "wiki_description", "url", "propagation_methods", "watering", "edible_parts"],
          language: 'en'
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.suggestions.length > 0) {
            const resultsHTML = data.suggestions.map(suggestion => {
              console.log(suggestion)
              if (suggestion.plant_details.wiki_description){
                var descriptionWords = suggestion.plant_details.wiki_description.value.split(' ');
                var shortDescription = descriptionWords.slice(0, 100).join(' ');
              }

              let watering = ""
              if (suggestion.plant_details.watering){
                if (suggestion.plant_details.watering.min === suggestion.plant_details.watering.max){
                  watering = suggestion.plant_details.watering.min
                } else {
                  watering = suggestion.plant_details.watering.min + " to " + suggestion.plant_details.watering.max
                }
              }
              return `
              <div class="result-box">
              <img class="result-image" src="${suggestion.plant_details.wiki_image ? suggestion.plant_details.wiki_image.value : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'}" style="height:100%">
                <h1 class="result-name">${suggestion.plant_name}</h1>
                <span>(AKA. ${suggestion.plant_details.common_names ? suggestion.plant_details.common_names[0] : "No Common Names!"})</span></h2>
                <div>
                <br><br>
                  <p class="result-description">${shortDescription ? shortDescription + "..." : 'No Description Available!'}</p><br>
                  <a href="${suggestion.plant_details.url}"class="result-url">Read more here!</a><br><br>
                  <p class="result-edible-parts">Edible parts: ${suggestion.plant_details.edible_parts ? suggestion.plant_details.edible_parts.join(', ') : 'none'}</p>
                  <p class="result-propagation-methods">Propagation methods: ${suggestion.plant_details.propagation_methods ? suggestion.plant_details.propagation_methods.join(', ') : 'none'}</p>
                  <p class="result-watering">Watering level: ${suggestion.plant_details.watering ? watering : 'none'}</p><br><br>
                </div>
                <h3 class="result-probability">Probability: ${Math.round(suggestion.probability * 100)}%</h3>
              </div>
            `;
            }).join('');
            resultsDiv.innerHTML = resultsHTML;
            resultsDiv.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
          } else {
            resultsDiv.innerHTML = '<h1 class="no-result">No results found. Please try again with a different image.</h1>';
          }
        })

        .catch(error => {
          console.error('Error:', error);
        });
    };
    reader.readAsDataURL(file);
  }
});

// #endregion

// #region photo preview
const uploadForm = document.getElementById("upload-form");
const uploadInput = document.getElementById("image-upload");
const previewImage = document.getElementById("preview-image");
const previewBox = document.querySelector(".preview-box");
const closePreview = document.getElementById("close-preview");
const imagePreview = document.querySelector(".image-preview");

// Show the image preview box when an image is selected
uploadInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.setAttribute("src", e.target.result);
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(this.files[0]);
  }
});

// Close the image preview box when the close button is clicked
closePreview.addEventListener("click", function () {
  previewImage.setAttribute("src", "");
  imagePreview.style.display = "none";
});

// Close the image preview box when the user clicks outside the box
window.addEventListener("click", function (e) {
  if (e.target == imagePreview) {
    previewImage.setAttribute("src", "");
    imagePreview.style.display = "none";
  }
});

// Prevent the default form submission and show the image preview box
uploadForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const uploadInputClone = uploadInput.cloneNode(true); // clone the input element
  previewBox.appendChild(uploadInputClone); // append the clone to the preview box
});

document.getElementById("upload-button").addEventListener("click", function () {
  closePreview.click();
});

//#endregion

const chooseFileButton = document.getElementById('choose-file-button');
const fileInput = document.getElementById('image-upload');

chooseFileButton.addEventListener('click', function () {
  fileInput.click();
});
