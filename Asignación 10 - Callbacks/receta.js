
function cortarIngredientes(callback) {
  log("Cortando ingredientes...");
  setTimeout(function () {
    log("Ingredientes listos.");
    callback();
  }, 2000);
}

function cocinar(callback) {
  log("Cocinando...");
  setTimeout(function () {
    log("Cocción completa.");
    callback();
  }, 3000);
}

function servirPlato() {
  log("Plato servido");
}

function prepararReceta() {
  document.getElementById("out3").textContent = "";
  cortarIngredientes(function () {
    cocinar(servirPlato);
  });
}

function log(msg) {
  const out = document.getElementById("out3");
  out.textContent += (out.textContent ? "\n" : "") + msg;
}
