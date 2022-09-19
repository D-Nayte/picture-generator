/* USE create()!param1: element; param2: class/id; Object parameter: { parent: HTMLElement, position: "afterend", "beforeend", "afterstart" etc..}*/
export function create(element, id = "", { position, parent } = {}) {
  // create Element based on the given parameter;
  let elem = document.createElement(element);

  //class name, Id name validation from parameters
  if (id.length > 1) {
    if (typeof id !== "string") {
      return console.error("2. paramter of create() needs to be a string!");
    } else {
      if (id.charAt(0) != "#" && id.charAt(0) != ".") {
        console.error(`2. parameter has to start with "." for a class or "#" for a Id! `);
      }
    }

    //creating class'es OR Id's for HTML element
    switch (id.charAt(0)) {
      case ".":
        // If class names, create more or just 1 class name
        let classes = id.slice(1);
        classes = classes.split(" ");
        elem.classList.add(...classes);
        break;
      case "#":
        //If Id name, add JUST one Id
        if (id.includes(" ") || id.includes(" ")) {
          return console.error("you can only use 1 ID in create()!");
        }
        elem.id = id.slice(1);
        break;

      default:
        return console.error("Error in creating a class Name!");
    }
  }

  //If initial position wanted, place it on the giving Object settings
  if (parent && position) {
    try {
      parent.insertAdjacentElement(position, elem);
    } catch (error) {
      parent.appendChild(elem);
    }
  }

  return elem;
}

export function select(selector, all) {
  if (!all) {
    return document.querySelector(selector);
  }
  return document.querySelectorAll(selector);
}
