// 25. PROYECTO Administración de Presupuesto con Classes
// Pasos para lograr el proyecto
// 1. preguntarPresupuesto y validación del prompt
// 2. Agregar Presupuesto a la clase Presupuesto
// 3. Trabajando con la clase de UI. Pasar el presupuesto hacia la clase de UI e insertar HTML presupuesto y restante
// 4. El formulario validarlo, es decir, que agreguen información en el formulario y que los gastos tengan una cantidad válida
// 5. Crear un objeto con la info de gasto, cantidad y un ID para eliminar un gasto 
// 6Mostrar los Gastos en el HTML
// 7 Crear un nuevo método en la parte de listad, para que agregue los gastos, conforme los vamos registrando
// 8 Actualizar el Presupuesto Restante

// Nota: classList y ClassName: classList reporta que clases hay y con .add, .remove se agrega o quita la clase.
// mientras que className solo reporta las clases que hay. Y si le ponemos className = a, ya puedes asignar valor diferente
// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}
// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    // Al comienzo restante será igual a presupuesto
    nuevoGasto(gasto) {
        // console.log(gasto);
        // spread operator
        this.gastos = [...this.gastos, gasto];
        // para asegurar que se van al objeto principal
        console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante() {
        // .reduce itera sobre el arreglo y puede entregar un total. crea un nuevo arreglo entregando el total
        const gastado  = this.gastos.reduce((total, gastoso) => total += gastoso.cantidad, 0) 
        // console.log(gastado);
        this.restante = this.presupuesto - gastado;
        // console.log(this.restante);
    }

    eliminarGasto(id) {
        // console.log('desde la clase');
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
    }
}

class UI {

    // Métodos

    insertarPresupuesto(cantidad) {
        console.log(cantidad);//ver valor de clase Presupuesto

        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;
        // Insertar en HTML
        // .primario parte izq del formulario
        // insertBefore toma dos argumentos. 1¿que se inserta?, 2 ¿en que parte colocar?. ya se tiene una referencia de formulario, arriba en las variables
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar mensaje del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    agregarGastoListado(gastos) {

        this.limpiarHTML();// Elimina el HTML previo

        //console.log(gastos);//Tiene la referencia del arreglo gastos de la clase Presupuesto   
        // Iterar sobre los gastos   
        gastos.forEach( gasto => {
            // console.log(gasto);
            const {nombreGasto, cantidad, id} = gasto;
            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';

            // Para agregar atributos personalizados setAttribute data-id
            //  nuevoGasto.setAttribute('data-id', id);
            // data-id son de HTML5 para indentificar info
            // existe otra en las nuevas versiones de JS dataset.
            // dataset.humberto = id
            nuevoGasto.dataset.id = id;
            //  console.log(nuevoGasto);

            // Agregar el Html del gasto
            nuevoGasto.innerHTML = `
            ${nombreGasto} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>
            `;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            // https://www.w3schools.com/charsets/ref_html_entities_4.asp
            // HTML entities &times para ver todos ver el enlace
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                // no colocar directamente presupuesto.eliminargasto 
                // le da complejidad innecesaria. Mejor llamar de la función
                eliminarGasto(id);// pasar el id 
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);   
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        // Comprobar 25%
        if ((presupuesto / 4) > restante)  {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if ((presupuesto / 2) > restante) {

            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        // Si el total es menor a 0. da un mensaje y deshabilita el botón
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit').disabled = true;
        }
    }
}
// Instanciar
ui = new UI();

let presupuesto;
// Funciones

function preguntarPresupuesto() {
    // Ingresar un numero
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    // Cambiar de string a Number parseInt, parseFloat, Number    
    // console.log(Number (presupuestoUsuario));

    // si el usuario escribe una letra. la respuesta es NaN (not a number)

    // Si prompt es vacio entonces === ''
    // si prompt presiona cancelar === null
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        // Recarga la página
        window.location.reload();
    }

    // Presupuesto valido
    // Agregar Presupuesto a la clase Presupuesto
    presupuesto = new Presupuesto(presupuestoUsuario);
    // console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();
    
    // Leer los input #gasto #cantidad
    const nombreGasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar Inputs
    if (nombreGasto === '' || cantidad === '') {
        // console.log('Todos los campos son obligatorios');
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');//Argumento
        return;// return para que no siga ejecutando código
        // isNaN is not a number
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;// return para que no siga ejecutando código
    }
    console.log('Agregando Gasto');

    // Agregar ese nuevo gasto hacia la clase de presupuesto
    // Restar la cantidad
    // listar los gastos en la parte superior derecha

    // Generar un objeto de tipo gasto, object literal enhancement
    const gasto = {
        // Si tienen el mismo nombre entonces solo colocar uno, es de cir, nombre: nombre
        nombreGasto,
        cantidad,
        id: Date.now()
    }
    // pasar el objeto gasto a las clases Presupuesto y UI
    console.log(gasto);
    // Añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // no colocar el tipo, porque la validacion es solo para error
    // Mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado Correctamente');

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    // Renicia el Formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // console.log(id);
    // Eliminar del objeto
    presupuesto.eliminarGasto(id);
    // Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);    
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}