//import "./node_modules/html2canvas/dist/html2canvas.js";
import skins from "../assets/models/skin_overview.json" assert { type: "json" };
import colors from "../assets/models/colors.json" assert { type: "json" };
import pets from "../assets/models/only_pets/pets.json" assert { type: "json" };

console.log(skins);

window.addEventListener("load", function () {
  generateModelSelectors();
  modelSelectorFunctionality();
  buttonFunctionality();
});

function generateModelSelectors(amountOfSelectors = 1) {
  const ul = document.querySelector(".card-container");
  let fragment = document.createDocumentFragment();
  let counter = 1;
  let allPicturesToRemove = document.querySelectorAll("#model-wrapper .model");
  console.log(allPicturesToRemove);
  allPicturesToRemove.forEach((item) => item.remove());

  let allItemnsToRemove = document.querySelectorAll(".card-container li");
  allItemnsToRemove.forEach((item) => item.remove());

  for (let amount = 0; amount < amountOfSelectors; amount++) {
    //create selection Cards
    fragment.appendChild(generateCard(counter));
    //create Picture Model
    generateModel(counter);
    counter++;
  }

  ul.appendChild(fragment);
}

//Creates the selection Cards
function generateCard(counter) {
  let li = document.createElement("li");
  li.dataset.num = counter;

  let img = document.createElement("img");
  li.insertAdjacentElement("afterbegin", img);
  img.src = "./src/assets/models/Skins/default_skin/BLACK.png";
  img.alt = "Default Among us Skin";

  let selectSkin = document.createElement("select");
  li.insertAdjacentElement("beforeend", selectSkin);
  selectSkin.classList.add("select", "skin");
  let firstOption = document.createElement("option");
  firstOption.value = false;
  firstOption.textContent = "Select skin";
  selectSkin.appendChild(firstOption);
  selectSkin.appendChild(generateOptionList("skin"));
  // ----------- CODE WHOLE OPTION LIST

  let selectColor = document.createElement("select");
  li.insertAdjacentElement("beforeend", selectColor);
  selectColor.classList.add("select", "color");
  let firstOption2 = document.createElement("option");
  firstOption2.value = false;
  firstOption2.textContent = "Select color";
  selectColor.appendChild(firstOption2);

  let selectPet = document.createElement("select");
  li.insertAdjacentElement("beforeend", selectPet);
  selectPet.classList.add("select", "pet");
  let firstOption3 = document.createElement("option");
  firstOption3.value = false;
  firstOption3.textContent = "None pet";
  selectPet.appendChild(firstOption3);
  selectPet.appendChild(generateOptionList("pet"));

  let nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Name";
  li.insertAdjacentElement("beforeend", nameInput);

  return li;
}

// generates the skin option List from the skins JSON
function generateOptionList(type, skinType, target) {
  if (type !== undefined && skinType != "false") {
    let fragment = document.createDocumentFragment();
    switch (type) {
      case "skin":
        skins.forEach((skin) => {
          let option = document.createElement("option");
          let text = skin.skinName.name.charAt(0).toUpperCase() + skin.skinName.name.slice(1);
          text = text.replaceAll("_", " ");
          option.value = skin.skinName.name;
          option.textContent = text;
          fragment.appendChild(option);
        });
        break;
      case "color":
        //clear the Color option List
        target.parentNode.querySelectorAll("select[class='select color'] option").forEach((elem) => elem.remove());
        let skinFromJson = skins.find((skin) => skin.skinName.name === skinType);
        let availableColor = skinFromJson.skinName.colores;
        let special = skinFromJson.skinName.special;
        if (availableColor == "true") {
          colors.forEach((color) => {
            let option = document.createElement("option");
            option.value = option.textContent = color;
            fragment.appendChild(option);
          });
        } else if (special.length >= 1) {
          special.forEach((item) => {
            let option = document.createElement("option");
            let text = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            text = text.replaceAll("_", " ");
            option.value = item.name;
            option.textContent = text;

            fragment.appendChild(option);
          });
        } else {
          let option = document.createElement("option");
          option.value = option.textContent = "No Colors available for this Skinset";
          fragment.appendChild(option);
        }
        break;
      case "pet":
        pets.forEach((pet) => {
          let option = document.createElement("option");
          let text = pet.pet_name.charAt(0).toUpperCase() + pet.pet_name.slice(1);
          text = text.replaceAll("_", " ");
          option.value = pet.url;
          option.textContent = text;
          fragment.appendChild(option);
        });
        break;
      default:
        break;
    }
    return fragment;
  }
}

//Generates the Models for the Picture
async function generateModel(counter) {
  let parentNode = document.querySelector("#model-wrapper");
  let div = document.createElement("div");
  let imgSrc = "./src/assets/models/Skins/default_skin/BLACK.png";

  parentNode.insertAdjacentElement("beforeend", div);
  div.classList.add("model");
  div.dataset.num = counter;

  let picturewrapper = document.createElement("div");
  picturewrapper.classList = "picture-wrapper";

  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);

  let pet = document.createElement("img");
  pet.classList.add("pet");

  let p = document.createElement("p");
  p.classList.add("name");

  picturewrapper.insertAdjacentElement("beforeend", img);
  picturewrapper.insertAdjacentElement("beforeend", pet);
  div.insertAdjacentElement("beforeend", picturewrapper);
  div.insertAdjacentElement("beforeend", p);
}

function modelSelectorFunctionality() {
  let allModelSelectorCards = document.querySelectorAll("ul li");

  allModelSelectorCards.forEach((modelCard) => {
    modelCard.addEventListener("click", (event) => {
      //id identifier, connector between option and output picture
      const id = modelCard.dataset.num;
      let newSkinSelected = event.target.classList.contains("skin");
      let skinType = modelCard.querySelector("select[class='select skin']").value;
      let mainColor = modelCard.querySelector("select[class='select color']").value;
      let imgElement = modelCard.querySelector("img");
      let name = modelCard.querySelector("li input");
      let pet = modelCard.querySelector("select[class='select pet']");

      //if no value, element isn't selected, no changes
      if (event.target.value != "false" && newSkinSelected) {
        //append option-list to select color section
        let node = generateOptionList("color", skinType, event.target);
        modelCard.querySelector("select[class='select color']").appendChild(node);

        // Change Name
        name.addEventListener("keyup", () => {
          return (() => {
            let pictureName = document.querySelector(`.model[data-num='${id}'] p`);
            pictureName.textContent = name.value;
          })();
        });
      }
      // select pet
      changePet(pet, id);
      //refresh Image Picture
      changePicture(imgElement, skinType, mainColor, id);
    });
  });
}

function changePicture(selectImg, skinType, mainColor, id) {
  if (skinType === "false") {
    skinType = "default_skin";
    mainColor = "black";
  }
  if (mainColor === "false" || (skinType !== "social_media_skin" && mainColor === "discord")) {
    skinType = "default_skin";
    mainColor = "black";
  }
  if (skinType === "social_media_skin" && mainColor === "black") {
    mainColor = "Discord";
  }

  let imgPath = `./src/assets/models/Skins/${skinType}/${mainColor}.png`;
  let pictureImg = document.querySelector(`.model[data-num='${id}'] img`);
  pictureImg.setAttribute("src", imgPath);
  selectImg.setAttribute("src", imgPath);
}

function changePet(pet, id) {
  let imgElememById = document.querySelector(`.model[data-num='${id}'] .pet`);
  pet.addEventListener("click", (event) => {
    let url = event.target.value;
    if (url == "false") {
      return (imgElememById.src = "");
    }
    imgElememById.src = url;
  });
}

function buttonFunctionality() {
  //Amount of Buddys button behavior
  let amountBtn = document.querySelector(".amount-buddys");
  amountBtn.addEventListener("keyup", (event) => {
    let amount = parseInt(event.target.value);
    if (amount >= 1 && amount <= 10) {
      generateModelSelectors(amount);
      modelSelectorFunctionality();
    }
  });

  //Header Text button behavior
  let inputHeader = document.querySelector("#header-text-input");
  inputHeader.addEventListener("keyup", (event) => {
    let header = document.querySelector(".heading-text");
    header.textContent = event.target.value.toUpperCase();
  });

  //Info Text button behavior
  let inputInfo = document.querySelector("#Info-text-input");
  inputInfo.addEventListener("keyup", (event) => {
    let info = document.querySelector(".info");
    info.textContent = event.target.value.toLowerCase();
  });

  //highlighter functionality
  let button = document.querySelector(".apply");
  button.addEventListener("click", (event) => {
    let headerText = document.querySelector(".heading-text").textContent;
    let headerelem = document.querySelector(".heading-text");
    let infoText = document.querySelector(".info").textContent.toUpperCase();
    let infoTextElem = document.querySelector(".info");
    let highlighterTextArrray = document.querySelector("#highlighter").value.toUpperCase().split(" ");

    highlighterTextArrray.forEach((wordFromArray) => {
      if (headerText.indexOf(wordFromArray) !== -1) {
        console.log(wordFromArray);
        let start = headerText.indexOf(wordFromArray);
        let end = start + wordFromArray.length;
        let word = headerText.slice(start, end);
        let newString = headerText.replace(word, `<span class="highlight">${word}</span>`);
        console.log(word);
        headerelem.innerHTML = newString;
      }
      console.log(wordFromArray);
      if (infoText.indexOf(wordFromArray) !== -1) {
        console.log(infoText.indexOf(wordFromArray));
        let start = infoText.indexOf(wordFromArray);
        let end = start + wordFromArray.length;
        let word = infoText.slice(start, end);
        let newString = infoText.replace(word, `<span class="highlight">${word}</span>`);
        console.log(word);
        infoTextElem.innerHTML = newString.toLowerCase();
      }
    }, 3500);
  });
}
