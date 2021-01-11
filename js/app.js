//CAMPOS DEL FORMULARIO
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const teleInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const listaCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id );

    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
    }


}

class UI {

    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar calse a ltipo de error
        if( tipo === 'error' ){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        
        setTimeout(() => {
            divMensaje.remove();
        }, 2500);
    }

    imprimirCitas({citas}){
        
        this.limpiarHTML();

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.setAttribute('id', id);

            //Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario:</span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Teléfono:</span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha de la cita:</span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora:</span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Síntomas de la mascota:</span> ${sintomas}
            `;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>`;

             btnEliminar.onclick = () => eliminarCita(id);

             //añade un botón para editar
             const btnEditar = document.createElement('button');
             btnEditar.classList.add('btn', 'btn-info');
             btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>`;
            btnEditar.onclick = () => cargarCita(cita);

            //agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar las citas al HTML
            listaCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(listaCitas.firstChild){
            listaCitas.firstChild.remove()
        }
    }
}

const ui = new UI();
const administradorCitas = new Citas();

//EVENT LISTENERS
eventListeners();

function eventListeners(){
    mascotaInput.addEventListener('input', datosCitas);
    propietarioInput.addEventListener('input', datosCitas);
    teleInput.addEventListener('input', datosCitas);
    fechaInput.addEventListener('input', datosCitas);
    horaInput.addEventListener('input', datosCitas);
    sintomasInput.addEventListener('input', datosCitas);

    formulario.addEventListener('submit', nuevaCita)
}

//Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// FUNCIONES
function datosCitas(e){
    citaObj[e.target.name] = e.target.value;

}

//Valida y agrega a la clase de citas
function nuevaCita(e){
    e.preventDefault();

    //Extraer la informacion del objeto de citas
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return
    }

    if(editando){
        ui.imprimirAlerta('Cita editada');

        administradorCitas.editarCita({...citaObj})

        //Regredar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        //Desactivar el modo edicion
        editando = false;

    }else {
        //Generar un id unico para la cita
        citaObj.id = Date.now();

        //Crear una nueva cita
        administradorCitas.agregarCita({...citaObj});

        //Agregar el mensaje 
        ui.imprimirAlerta('Se agregó la cita correctamente');
    }

    

    //Reinicia el formulario
    formulario.reset();

    //Reinicia las propieades del objeto
    reiniciarObjeto();

    //Mostrar citas en el HTML
    ui.imprimirCitas(administradorCitas);
  
}


function reiniciarObjeto() {
    //Debido a que citaObj es const no podemos cambiar su valor como tal, pero si podemos ir propiedad x propiedad reiniciando los valores

    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.telefono = '';
    citaObj.sintomas = '';

}

function eliminarCita(id){
    //Eliminar cita
    administradorCitas.eliminarCita(id);

    //Mostrar mensaje
    ui.imprimirAlerta('Cita borrada correctamente');

    //Refrescar las citas
    ui.imprimirCitas(administradorCitas);
   
}

function cargarCita(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    teleInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar los inputs
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar texto del formulario
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true
}