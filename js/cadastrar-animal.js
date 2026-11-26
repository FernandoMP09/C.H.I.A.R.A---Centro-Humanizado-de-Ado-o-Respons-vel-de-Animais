console.log("JavaScript do cadastro de animais conectado!");
const formulario = document.getElementById("form-cadastrar-animal");

console.log(formulario);

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  console.log("Botão Salvar animal foi acionado!");

  const nome = document.getElementById("nome-novo-pet").value;
  const especie = document.getElementById("especie").value;
  const raca = document.getElementById("raca").value;
  const sexo = document.getElementById("sexo").value;
  const idade = document.getElementById("idade").value;
  const porte = document.getElementById("porte").value;
  const situacao = document.getElementById("situacao").value;
  const descricao = document.getElementById("descricao-novo-animal").value;

  console.log(nome, especie, raca, sexo, idade, porte, situacao, descricao);
  const instituicaoId = sessionStorage.getItem("idInstituicao");
  const animal = {
    instituicao_id: instituicaoId,
    nome: nome,
    especie: especie,
    raca: raca,
    sexo: sexo,
    idade: idade,
    porte: porte,
    situacao: situacao,
    descricao: descricao,
  };

  console.log(animal);



  console.log("ID da instituição:", instituicaoId);
});
