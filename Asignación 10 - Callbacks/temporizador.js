function esperarYMostrar(segundos, mensaje, callback) {
  setTimeout(function () {
    callback(mensaje);
  }, segundos * 1000);
}

function iniciarTemporizador() {
  const segundos = parseInt(document.getElementById("secs").value);
  const output = document.getElementById("out1");
  output.textContent = `Esperando ${segundos} segundos...`;

  esperarYMostrar(segundos, "El tiempo ha terminado", function (msg) {
    output.textContent = `Callback ejecutado: "${msg}"`;
  });
}
