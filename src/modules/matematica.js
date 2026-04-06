/* Este es el módulo "matematicas" */
const PI = 3.14;
const numerosTexto = ["dos", "cuatro", "ocho", "diez"];
function sumar(x, y) {
     return x + y;
}
const restar = (a, b) => {
 return a - b;  
};
const multiplicar = (a, b) => {
 return a * b;
 };
function dividir(a, b) {
    return a / b;
}
// Exporto todo lo que yo quiero exponer del módulo hacia el exterior.
export {PI,numerosTexto, sumar, multiplicar,dividir,restar};
