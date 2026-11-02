// Fase 4: cuestionario interactivo sobre Alfredo Parte Sáiz.
// Este archivo se conecta con index.html mediante la etiqueta <script>.

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario-quiz");
    const progreso = document.getElementById("progreso-quiz");
    const aviso = document.getElementById("aviso-quiz");
    const resultado = document.getElementById("resultado-quiz");
    const botonComprobar = document.getElementById("corregir-quiz");
    const botonReiniciar = document.getElementById("reiniciar-quiz");

    // Cada pregunta tiene un nombre, la opción correcta y una explicación.
    const preguntas = [
        {
            nombre: "pregunta1",
            correcta: "1899",
            explicacion: "Alfredo Parte Sáiz nació en 1899, en Cilleruelo de Bricia."
        },
        {
            nombre: "pregunta2",
            correcta: "villacarriedo",
            explicacion: "Desarrolló gran parte de su trabajo educativo en Villacarriedo."
        },
        {
            nombre: "pregunta3",
            correcta: "escolapios",
            explicacion: "Pertenecía a las Escuelas Pías, también llamadas orden de los escolapios."
        },
        {
            nombre: "pregunta4",
            correcta: "1995",
            explicacion: "Fue beatificado por Juan Pablo II el 1 de octubre de 1995."
        },
        {
            nombre: "pregunta5",
            correcta: "procurador",
            explicacion: "Entre 1930 y 1936 también fue procurador del colegio de Villacarriedo."
        }
    ];

    // Contamos cuántas preguntas tienen una opción marcada.
    function contarRespondidas() {
        let cantidad = 0;
        preguntas.forEach(function (pregunta) {
            const elegida = formulario.querySelector('input[name="' + pregunta.nombre + '"]:checked');
            if (elegida) {
                cantidad++;
            }
        });
        return cantidad;
    }

    // Se actualiza cada vez que alguien cambia una respuesta.
    formulario.addEventListener("change", function () {
        progreso.textContent = "Preguntas respondidas: " + contarRespondidas() + " de " + preguntas.length;
        aviso.hidden = true;
    });

    // Al hacer clic en Comprobar, evitamos que el formulario recargue la página.
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const pendientes = preguntas.filter(function (pregunta) {
            return !formulario.querySelector('input[name="' + pregunta.nombre + '"]:checked');
        });

        // No corregimos hasta que estén respondidas las cinco preguntas.
        if (pendientes.length > 0) {
            const palabra = pendientes.length === 1 ? "pregunta" : "preguntas";
            aviso.textContent = "Te faltan " + pendientes.length + " " + palabra + ". Respondé todas antes de comprobar.";
            aviso.hidden = false;
            formulario.querySelector('input[name="' + pendientes[0].nombre + '"]').focus();
            return;
        }

        aviso.hidden = true;
        let aciertos = 0;

        preguntas.forEach(function (pregunta) {
            const elegida = formulario.querySelector('input[name="' + pregunta.nombre + '"]:checked');
            const bloque = formulario.querySelector('fieldset[data-pregunta="' + pregunta.nombre + '"]');
            const mensaje = bloque.querySelector(".feedback-pregunta");
            const opcionCorrecta = bloque.querySelector('input[value="' + pregunta.correcta + '"]');

            if (elegida.value === pregunta.correcta) {
                aciertos++;
                bloque.classList.add("pregunta-correcta");
                mensaje.textContent = "¡Correcto! " + pregunta.explicacion;
            } else {
                bloque.classList.add("pregunta-incorrecta");
                elegida.closest("label").classList.add("opcion-incorrecta");
                mensaje.textContent = "Incorrecto. " + pregunta.explicacion;
            }

            opcionCorrecta.closest("label").classList.add("opcion-correcta");
            mensaje.hidden = false;

            // Bloqueamos las opciones después de corregir. Se activan al reiniciar.
            bloque.querySelectorAll('input[type="radio"]').forEach(function (opcion) {
                opcion.disabled = true;
            });
        });

        let comentario;
        if (aciertos === preguntas.length) {
            comentario = "¡Excelente! Respondiste todo correctamente.";
        } else if (aciertos >= 3) {
            comentario = "¡Buen trabajo! Podés revisar las explicaciones y volver a intentar.";
        } else {
            comentario = "Podés releer la página e intentarlo otra vez.";
        }

        resultado.textContent = "Resultado: " + aciertos + " de " + preguntas.length + " respuestas correctas. " + comentario;
        resultado.hidden = false;
        botonComprobar.disabled = true;
        botonReiniciar.hidden = false;
        resultado.focus();
    });

    // Restablecemos el cuestionario para que se pueda jugar otra vez.
    botonReiniciar.addEventListener("click", function () {
        formulario.reset();

        formulario.querySelectorAll('input[type="radio"]').forEach(function (opcion) {
            opcion.disabled = false;
        });

        formulario.querySelectorAll("fieldset").forEach(function (bloque) {
            bloque.classList.remove("pregunta-correcta", "pregunta-incorrecta");
            bloque.querySelectorAll("label").forEach(function (etiqueta) {
                etiqueta.classList.remove("opcion-correcta", "opcion-incorrecta");
            });
            const mensaje = bloque.querySelector(".feedback-pregunta");
            mensaje.textContent = "";
            mensaje.hidden = true;
        });

        aviso.textContent = "";
        aviso.hidden = true;
        resultado.textContent = "";
        resultado.hidden = true;
        botonComprobar.disabled = false;
        botonReiniciar.hidden = true;
        progreso.textContent = "Preguntas respondidas: 0 de " + preguntas.length;
        formulario.querySelector('input[type="radio"]').focus();
    });
});
