// Récupération del'API
let url = "http://localhost:3000/api/products";
getArticles();

function getArticles() {
  fetch(url)
    .then((response) => response.json())

    .catch((error) => {
      let items = document.getElementById("items");
      items.innerHTML =
        "Nous n'avons pas réussis à afficher nos canapés.<br> Avez-vous bien lancé le serveur local (Port 3000) ? <br> Si le problème persiste contactez-nous.";
    })

    // Injection des données produits depuis l'API
    .then(function (data) {
      for (let article in data) {

        //Création d'un lien
        let productLink = document.createElement("a");
        document.getElementById("items").appendChild(productLink);
        productLink.href = "product.html?id=" + data[article]._id;
        productLink.classList.add("product-link");

        // Création de la balise article
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);
        productArticle.classList.add("product");

        //Création de la div image
        let imageDiv = document.createElement("div");
        productArticle.appendChild(imageDiv);
        imageDiv.classList.add("imageDiv");

        // Création de la balise image
        let productImage = document.createElement("img");
        imageDiv.appendChild(productImage);
        productImage.src = data[article].imageUrl;
        productImage.alt = data[article].altTxt;
        productImage.classList.add("productImage");
        
        //Création du titre produit
        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.innerHTML = data[article].name;
        productName.classList.add("productName");

        // Création de la description
        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.innerHTML = data[article].description;
        productDescription.classList.add("productDescription");
      }
    });
}
