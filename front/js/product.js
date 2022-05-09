// Récupération du paramètre id de l'url
let params = new URL(document.location).searchParams;
let id = params.get("id");
console.log(id);
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productQuantity = document.getElementById("quantity");
const colorSelect = document.getElementById("colors");

let productImage = document.createElement("img");
document.querySelector(".item__img").appendChild(productImage);

// Récupération via l'API du produit dont nous avons besoin seulement
let url = "http://localhost:3000/api/products/" + id;

getArticles();
addToCart();

function getArticles() {
  fetch(url)
    .then((response) => response.json())

    .catch((error) => {
      let items = document.querySelector("items");
      items.innerHTML =
        "Nous n'avons pas réussis à afficher nos canapés.<br> Avez-vous bien lancé le serveur local (Port 3000) ? <br> Si le problème persiste contactez-nous.";
    })

    .then(function (data) {
      article = data;
      productName.innerHTML = article.name;
      productPrice.innerHTML = article.price;
      productDescription.innerHTML = article.description;
      productImage.src = article.imageUrl;

      // Récupération et création des options de couleur du menu déroulant
      for (let i = 0; i < article.colors.length; i++) {
        let productColor = document.createElement("option");
        productColor.innerHTML = article.colors[i];
        productColor.value = productColor.innerHTML;
        colorSelect.appendChild(productColor);
      }
    });
}

function addToCart() {
  const addToCartButton = document.getElementById("addToCart");

  addToCartButton.addEventListener("click", () => {
    if (
      productQuantity.value > 0 &&
      productQuantity.value <= 100 &&
      colorSelect.value !== ""
    ) {
      // ------ Création du produit qui sera ajouté au panier
      let productAdded = {
        name: productName.innerHTML,
        image: productImage.src,
        color: colorSelect.value,
        quantity: parseInt(productQuantity.value),
        _id: id,
      };

      // Initialisation du local storage
      let productInCart = JSON.parse(localStorage.getItem("products"));

      // Importantion dans le localStorage
      // Nous vérifions si le produit ajouté est déja présent dans le panier
      if (productInCart) {
        const existingProduct = productInCart.find(
          (el) => el.color === colorSelect.value && el._id === id
        );

        // Si oui nous rafraichissons la quantité uniquement
        if (existingProduct) {
          let refreshQuantity =
            parseInt(productAdded.quantity) +
            parseInt(existingProduct.quantity);
          existingProduct.quantity = refreshQuantity;
          localStorage.setItem("products", JSON.stringify(productInCart));

          // Si non, nous l'ajoutons au panier
        } else {
          productInCart.push(productAdded);
          localStorage.setItem("products", JSON.stringify(productInCart));
        }

        // Si le panier est vide, on le crée puis on ajoute le produit
      } else {
        productInCart = [];
        productInCart.push(productAdded);
        localStorage.setItem("products", JSON.stringify(productInCart));
      }
    }

    alert("Produit ajouté au panier");
  });
}
