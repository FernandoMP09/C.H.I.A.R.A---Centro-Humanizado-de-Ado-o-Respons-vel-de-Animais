const nomeAdotante = sessionStorage.getItem("nomeAdotante");

const primeiroNome = nomeAdotante.split(" ")[0];

document.getElementById("nome-adotante").textContent = primeiroNome;