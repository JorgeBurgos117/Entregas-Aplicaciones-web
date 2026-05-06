function operacion(a, b, op, callback) {
  const resultados = {
    "+": a + b,
    "-": a - b,
    "*": a * b,
    "/": b !== 0 ? a / b : "Error: división por cero",
  };
  callback(resultados[op]);
}

function calcular() {
  const a = parseFloat(document.getElementById("numA").value);
  const b = parseFloat(document.getElementById("numB").value);
  const op = document.getElementById("opSel").value;
  const simbolos = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  operacion(a, b, op, function (resultado) {
    document.getElementById("out2").textContent =
      `${a} ${simbolos[op]} ${b} = ${resultado}`;
  });
}
