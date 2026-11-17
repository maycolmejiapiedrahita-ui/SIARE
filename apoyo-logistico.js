



document.addEventListener("DOMContentLoaded", function () {

    // EVITAR QUE EL SCRIPT SE EJECUTE DOS VECES
    if (window.siareIniciado) return;
    window.siareIniciado = true;

    // DETECTAR EL INICIO DE SESIÓN
    const formularioLogin = document.querySelector("#usuario");

    if (formularioLogin) {
        const formulario = formularioLogin.closest("form");

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const usuario = formularioLogin.value.trim();

            if (usuario === "") {
                alert("Ingresa tu usuario.");
                return;
            }

            sessionStorage.setItem("usuario", usuario);
            sessionStorage.setItem("rol", "Apoyo logístico");

            window.location.href = "apoyo-logistico.html";
        });

        return;
    }

    // MENSAJE DE BIENVENIDA
    // MENSAJE DE BIENVENIDA
const usuario = sessionStorage.getItem("usuario") || "Usuario";

const tituloBienvenida = document.querySelector(".welcome h1");

if (tituloBienvenida) {
    tituloBienvenida.textContent = "¡Bienvenido, " + usuario + "!";
}

    // SECCIONES Y FORMULARIOS
    const secciones = [
        "inventario",
        "recepcion",
        "movimientos",
        "proveedores"
    ];

    // CREAR ESPACIOS PARA MOSTRAR LOS REGISTROS
    secciones.forEach(function (tipo) {

        const seccion = document.getElementById(tipo);

        if (!seccion) return;

        const lista = document.createElement("div");
        lista.id = "lista-" + tipo;
        lista.className = "lista-registros";

        const formulario = seccion.querySelector("form");

        if (formulario) {
            formulario.insertAdjacentElement("afterend", lista);
        }

    });

    // MOSTRAR LOS REGISTROS GUARDADOS
    function mostrarRegistros(tipo) {

        const lista = document.getElementById("lista-" + tipo);

        if (!lista) return;

        const registros = JSON.parse(
            localStorage.getItem("siare_" + tipo) || "[]"
        );

        lista.innerHTML = "";

        if (registros.length === 0) {
            lista.textContent = "No hay registros guardados.";
            return;
        }

        registros.forEach(function (registro, indice) {

            const tarjeta = document.createElement("div");
            tarjeta.className = "registro";

            Object.entries(registro).forEach(function ([campo, valor]) {

                const dato = document.createElement("p");
                dato.textContent = campo + ": " + valor;
                tarjeta.appendChild(dato);

            });

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.textContent = "Eliminar";
            eliminar.className = "btn btn-light";

            eliminar.addEventListener("click", function () {

                if (!confirm("¿Deseas eliminar este registro?")) return;

                registros.splice(indice, 1);

                localStorage.setItem(
                    "siare_" + tipo,
                    JSON.stringify(registros)
                );

                mostrarRegistros(tipo);
            });

            tarjeta.appendChild(eliminar);
            lista.appendChild(tarjeta);

        });
    }

    // GUARDAR LOS DATOS DE CADA FORMULARIO
    secciones.forEach(function (tipo) {

        const seccion = document.getElementById(tipo);

        if (!seccion) return;

        const formulario = seccion.querySelector("form");

        if (!formulario) return;

        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const datos = Object.fromEntries(
                new FormData(formulario).entries()
            );

            datos.fechaRegistro =
                new Date().toLocaleString("es-CO");

            const registros = JSON.parse(
                localStorage.getItem("siare_" + tipo) || "[]"
            );

            registros.push(datos);

            localStorage.setItem(
                "siare_" + tipo,
                JSON.stringify(registros)
            );

            alert("¡Registro guardado correctamente!");

            formulario.reset();

            mostrarRegistros(tipo);

        });

    });

    // CARGAR LOS REGISTROS AL ENTRAR
    secciones.forEach(mostrarRegistros);

});
