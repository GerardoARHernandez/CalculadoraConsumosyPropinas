let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Principal',
    2: 'Individuales',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some( campo => campo === '');

    if (camposVacios) {
        //Verificar si ya hay una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if (!existeAlerta) {
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center', 'text-uppercase');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            //Eliminar alerta
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        
        return;
    }

    //Asignar los datos del formulario al cliente
    cliente = { ...cliente, mesa, hora }
    // console.log(cliente)

    //Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrar las secciones
    mostrarSecciones();

    //Obtener platillos de la API de JSON-Server
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
     seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));

}

function obtenerPlatillos(){
    const url = './db.json';

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => mostrarPlatillos(resultado.platillos))
        .catch ( error => console.log(error))
        
}

function mostrarPlatillos(platillos){

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-3');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-4', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[ platillo.categoria]
        
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Funcu¿ión que detecta la cantidad y platillo a agregar
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad})
        };

        const agregarInput = document.createElement('div');
        agregarInput.classList.add('col-md-2');
        agregarInput.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregarInput);

        contenido.appendChild(row);

    })
}

function agregarPlatillo(producto){
    //Extraer el pedido actual
    let { pedido } = cliente;

    //Revisar que la cantidad sea mayor a 0
    if (producto.cantidad > 0) {

        //Comprueba si el elemento ya existe en el array
        if( pedido.some( articulo => articulo.id === producto.id)){
            //El articulo ya existe, actualizamos la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if ( articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            //Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];

        }else{
            //El artiuclo no existe y lo agregamos al array
            cliente.pedido = [...pedido, producto];
        }

    }else{
        //Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    //Limpiar el codigo HTML previo
    limpiarHTML();

    //Verificamos si hay algo en el resumen
    if (cliente.pedido.length) {
        //Mostrar el resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }


}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    //Información de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Información de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a los elemntos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan)

    //Titulo de la sección
    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center')
    heading.textContent = 'Platillos Consumidos';

    //Iterar sobre al array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const { pedido} = cliente;
    pedido.forEach( articulo =>{
        const { cantidad, id, nombre, precio} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');
        
        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio del articulo
        const precioEl = document.createElement('h4');
        precioEl.classList.add('my-4');
        precioEl.textContent = 'Precio: ';
        
        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        //Subtotal del articulo
        const subtotalEl = document.createElement('h4');
        subtotalEl.classList.add('my-4');
        subtotalEl.textContent = 'Subtotal: ';
        
        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        //Boton de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del Pedido';

        //Función para eliminar del pedido
        btnEliminar.onclick = () =>{
            eliminarProducto(id);
        }

        //Agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        //Agregar elemenos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);


        //Agregar lista al grupo principal
        grupo.appendChild(lista);

    });

    //Agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(hora);
    resumen.appendChild(mesa);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar las propinas
    formularioPropinas();
}

function calcularSubtotal(precio, cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const { pedido} = cliente;

    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    //Limpiar el codigo HTML previo
    limpiarHTML();

    //Verificamos si hay algo en el resumen
    if (cliente.pedido.length) {
        //Mostrar el resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    //El prodcuto se elimino, se regresa a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while( contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio button 0%
    const radio0 = document.createElement('input');
    radio0.type = 'radio';
    radio0.name = 'propina';
    radio0.value = "0";
    radio0.classList.add('form-check-input');
    radio0.onclick = calcularPropina;

    const radio0label = document.createElement('label');
    radio0label.textContent = '0%';
    radio0label.classList.add('form-check-label');

    const radio0div = document.createElement('div');
    radio0div.classList.add('from-check');

    radio0div.appendChild(radio0);
    radio0div.appendChild(radio0label);

    //Radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10label = document.createElement('label');
    radio10label.textContent = '10%';
    radio10label.classList.add('form-check-label');

    const radio10div = document.createElement('div');
    radio10div.classList.add('from-check');

    radio10div.appendChild(radio10);
    radio10div.appendChild(radio10label);

    //Radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25label = document.createElement('label');
    radio25label.textContent = '25%';
    radio25label.classList.add('form-check-label');

    const radio25div = document.createElement('div');
    radio25div.classList.add('from-check');

    radio25div.appendChild(radio25);
    radio25div.appendChild(radio25label);

    //Radio button 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50label = document.createElement('label');
    radio50label.textContent = '50%';
    radio50label.classList.add('form-check-label');

    const radio50div = document.createElement('div');
    radio50div.classList.add('from-check');

    radio50div.appendChild(radio50);
    radio50div.appendChild(radio50label);

    //Agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio0div);
    divFormulario.appendChild(radio10div);
    divFormulario.appendChild(radio25div);
    divFormulario.appendChild(radio50div);

    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
}

function calcularPropina(){

    const { pedido} = cliente;
    let subtotal = 0;

    //Calcular el subtotal a pagar
    pedido.forEach( articulo =>{
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Seleccionar el button de la propina
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //Calcular la propina
    const propina = (subtotal * parseInt( propinaSeleccionada)) /100;

    //Calcular el total a pagar
    const total = subtotal + propina;
    
    mostrarTotalHTML(subtotal, total, propina);
}

function mostrarTotalHTML(subtotal, total, propina){
    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar', 'my-5');

    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';
    
    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    propinaParrafo.textContent = 'Propina: ';
    
    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total
    const TotalParrafo = document.createElement('p');
    TotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    TotalParrafo.textContent = 'Total: ';
    
    const TotalSpan = document.createElement('span');
    TotalSpan.classList.add('fw-normal');
    TotalSpan.textContent = `$${total}`;

    TotalParrafo.appendChild(TotalSpan);

    //Eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar');

    if (totalPagarDiv) {
        totalPagarDiv.remove();
    }

    //Agregamos al div total
    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(TotalParrafo);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);
}