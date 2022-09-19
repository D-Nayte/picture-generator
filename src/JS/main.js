import "./html2canvas.js";
import skins from "./skins.json" assert { type: "json" };
import pets from "../assets/models/only_pets/pets.json" assert { type: "json" };

/* USE create(): "param1: element"; "param2: class/id"; "Object parameter: { parent: HTMLElement, position: "afterend", "beforeend", "afterstart" etc..}"*/
import { create, select } from "./helper.js";

window.addEventListener("load", () => {
  createModelSelection();
  changePictureModel();
  buttonFunctionality();
});

function createModelSelection(id = 1) {
  let ul = select(".card-container");
  deleteOlderListItems();
  let modelWrapper = document.querySelector("#model-wrapper");

  //delete old model items from picture before creating new one
  let modelElements = select("#model-wrapper .model", "all");
  modelElements.forEach((model) => model.remove());

  //create new Modelselection Items based on Users entry
  for (let index = 1; index <= id; index++) {
    ul.appendChild(createListItemModel(index));
    modelWrapper.appendChild(createPictureModel(index));
    changePictureModel(index);
  }
}

function deleteOlderListItems() {
  let listItems = select(".card-container li", "all");
  listItems.forEach((li) => li.remove());
}

function createListItemModel(id = 1) {
  //create List item with contetn
  let fragment = document.createDocumentFragment();
  let li = create("li", "");
  li.dataset.id = id;
  fragment.appendChild(li);
  let img = create("img", "", { parent: li, position: "beforeend" });
  img.src = "./src/assets/models/Skins/adventurer_frozen/black.png";
  img.alt = "Default Among us Skin black";
  let selectSkin = create("select", ".select skin", { parent: li, position: "beforeend" });
  selectSkin.dataset.id = id;
  let selectColor = create("select", ".select color", { parent: li, position: "beforeend" });
  selectColor.dataset.id = id;
  let name = create("input", "", { parent: li, position: "beforeend" });
  name.type = "text";
  name.placeholder = "Name";

  //create all options for the select skin
  skins.forEach((skin) => {
    let skinName = create("option", "", { parent: selectSkin, position: "beforeend" });
    skinName.value = skin.id;
    skinName.textContent = skin.name;
  });

  //create initial color choise list
  skins[0].colors.forEach((color) => {
    let skinColor = create("option", "", { parent: selectColor, position: "beforeend" });
    skinColor.value = skinColor.textContent = color;
  });

  // create pet choise list
  let selectPet = document.createElement("select");
  li.insertAdjacentElement("beforeend", selectPet);
  selectPet.classList.add("select", "pet");
  let firstOption3 = document.createElement("option");
  firstOption3.value = false;
  firstOption3.textContent = "None pet";
  selectPet.appendChild(firstOption3);
  selectPet.appendChild(createPetList());

  //create event Listener for whole li element
  createListEventListener(li);

  return fragment;
}

function createListEventListener(listElement) {
  //all event listeners for the selects
  let listID = listElement.dataset.id;

  listElement.addEventListener("change", (event) => {
    console.log("CHANGE!!!!!!!!!!!!!!!!!!!");
    let choicedSkinId = listElement.querySelector(".skin").value;
    let [skinFromJson] = skins.filter((skin) => skin.id === choicedSkinId);
    let parentElem = listElement.querySelector(".color");

    //Event if Skin is changed
    if (event.target.classList.contains("skin")) {
      //create options
      let colorsArray = skinFromJson.colors;
      let ListItems = listElement.querySelectorAll(".color option");
      //delete actuall List items
      ListItems.forEach((item) => item.remove());
      //setup new colors in the List
      colorsArray.forEach((color) => {
        let skinColor = create("option", "", { parent: parentElem, position: "beforeend" });
        skinColor.value = skinColor.textContent = color;
      });
    }

    //if pet is changed
    let petUrl;
    if (event.target.classList.contains("pet")) {
      petUrl = event.target.value;
    }

    //change model from selector
    let skinPathUrl = skinFromJson.url;
    let choosedColor = parentElem.value + ".png";
    let finalUrl = skinPathUrl + choosedColor;
    let img = listElement.querySelector("img");
    img.src = finalUrl;

    //change model from picture
    changePictureModel(listID, finalUrl, petUrl, skinFromJson.name);
  });

  //event listener for name input
  let nameInput = listElement.querySelector("input");
  nameInput.addEventListener("keyup", (event) => {
    let nameFromInput = event.target.value;
    let pictureModelName = select(`[data-num="${listID}"] p.name`);
    pictureModelName.textContent = nameFromInput;
  });
}

function createPetList() {
  let fragment = document.createDocumentFragment();

  pets.forEach((pet) => {
    let option = document.createElement("option");
    let text = pet.pet_name.charAt(0).toUpperCase() + pet.pet_name.slice(1);
    text = text.replaceAll("_", " ");
    option.value = pet.url;
    option.textContent = text;
    fragment.appendChild(option);
  });
  return fragment;
}

function createPictureModel(id) {
  //generate new
  let parentElem = document.createDocumentFragment();
  let modelDiv = create("div", ".model", { parent: parentElem, position: "beforeend" });
  modelDiv.dataset.num = id;
  let pictureWrapper = create("div", ".picture-wrapper", { parent: modelDiv, position: "beforeend" });
  let buddyModel = create("img", ".buddy", { parent: pictureWrapper, position: "beforeend" });
  buddyModel.src = "./src/assets/models/Skins/adventurer_frozen/black.png";

  let petModel = create("img", ".pet", { parent: pictureWrapper, position: "beforeend" });
  let nameInput = create("p", ".name", { parent: modelDiv, position: "beforeend" });

  return parentElem;
}

function changePictureModel(id = 1, finalUrl, petUrl, skins) {
  if (!finalUrl) {
    finalUrl = "./src/assets/models/Skins/adventurer_frozen/black.png";
  }
  if (petUrl) {
    let petElem = select(`[data-num="${id}"] .pet`);
    petElem.src = petUrl;
  }
  let buddyImg = document.querySelector(`[data-num="${id}"] .buddy`);
  buddyImg.src = finalUrl;

  //make star wars models smaller
  if (skins === "Star Wars") {
    buddyImg.style.padding = "4rem";
    buddyImg.style.paddingBottom = "3em";
  } else {
    buddyImg.style.padding = "0rem";
  }
}

function buttonFunctionality() {
  //generate the preview and take screenshot Buttons
  generateButtons();

  //Amount of Buddys button behavior
  let amountBtn = document.querySelector(".amount-buddys");
  amountBtn.addEventListener("keyup", (event) => {
    let amount = parseInt(event.target.value);
    if (amount >= 1 && amount <= 10) {
      createModelSelection(amount);
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

function generateButtons() {
  //preview button
  let previewButton = select(".generate-wrapper .previewBtn");
  let closeButton = select(".preview-container .btn");
  let previewContainer = select(".preview-container");
  let canvas = select("main > .canvas");
  let preview = select(".preview-container .preview");

  closeButton.addEventListener("click", (event) => {
    previewContainer.classList.toggle("hide");
    preview.innerHTML = null;
  });

  previewButton.addEventListener("click", (event) => {
    let contentFromCanvas = canvas.innerHTML;
    let preview = select(".preview-container .preview");
    preview.innerHTML = contentFromCanvas;
    previewContainer.classList.toggle("hide");
  });

  //generate "generate Button"
  let generateButton = select(".screenShot");

  generateButton.addEventListener("click", (event) => {
    //remove round corners for download
    let backgroundimage = document.querySelector(".background");
    backgroundimage.style.borderRadius = 0;

    //get and print the canvas
    let canvas = document.querySelector(".capture");
    let print = document.createElement("section");
    print.classList.add("canvas", "capture");
    print.innerHTML = canvas.innerHTML;
    print.style.width = "1280px";
    print.style.height = "720px";
    canvas.appendChild(print);
    let options = { backgroundColor: null, width: 1280, height: 720 };

    html2canvas(print, options).then((canvas) => {
      let imageURL = canvas.toDataURL("image/png");

      //download file
      let anchor = document.createElement("a");
      let tempAnchorElem = document.querySelector(".generate-wrapper");
      anchor.href = imageURL;
      anchor.download = "TEST0815";
      anchor.classList.add("hide");
      tempAnchorElem.appendChild(anchor);
      anchor.click();
      anchor.remove();
    });
    //re add the border radius for previews
    backgroundimage.style.borderRadius = "1rem";

    print.remove();
  });
}
