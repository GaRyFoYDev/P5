function confirmation() {
  let params = new URL(document.location).searchParams;
  let confId = document.querySelector("#orderId");
  confId.innerHTML = params.get("id");
  localStorage.clear();
 

}

confirmation();