document.addEventListener("DOMContentLoaded", () => {
  // ✅ Función para cargar un archivo HTML en un elemento del DOM
  function cargarHTML(ruta, elementoID) {
    fetch(ruta)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar ${ruta}: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        const contenedor = document.getElementById(elementoID);
        if (!contenedor) {
          console.warn(`No se encontró el elemento con ID: ${elementoID}`);
          return;
        }

        contenedor.innerHTML = html;

        if (elementoID === "header") {
          setTimeout(() => {
            inicializarDropdownsBootstrap();
            inicializarTema(); // 👈 Aquí se activa el cambio de tema
          }, 50);
        }
      })
      .catch(error => {
        console.error("Error al cargar contenido dinámico:", error);
      });
  }

  // 🧩 Reinicializar dropdowns de Bootstrap (necesario si el contenido es cargado dinámicamente)
  function inicializarDropdownsBootstrap() {
    const dropdownTriggerList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownTriggerList.forEach(triggerEl => {
      new bootstrap.Dropdown(triggerEl);
    });
  }

  // 🟦 Cambiar color del separador visual según el tema
  function actualizarSeparador(tema) {
    const separadorVR = document.getElementById("separador-vr");
    const separadorHR = document.getElementById("separador-hr");

    const colorClaro = "#212529";      // oscuro para modo claro
    const colorOscuro = "#ffffff";     // claro para modo oscuro
    const colorClaro50 = "#21252999";  // semitransparente
    const colorOscuro50 = "#ffffff99";

    if (separadorVR) {
      separadorVR.style.backgroundColor = tema === "dark" ? colorOscuro : colorClaro;
    }

    if (separadorHR) {
      separadorHR.style.borderColor = tema === "dark" ? colorOscuro50 : colorClaro50;
    }
  }

  // 🌗 Inicializar y manejar cambio de tema + ícono
  function inicializarTema() {
    const html = document.documentElement;
    const contenedor = document.getElementById("icono-tema");

    if (!contenedor) return;

    const temaGuardado = localStorage.getItem("tema");
    const temaInicial = temaGuardado || "light";
    html.setAttribute("data-bs-theme", temaInicial);
    actualizarIcono(temaInicial);
    actualizarSeparador(temaInicial);

    contenedor.addEventListener("click", () => {
      const temaActual = html.getAttribute("data-bs-theme");
      const nuevoTema = temaActual === "light" ? "dark" : "light";
      html.setAttribute("data-bs-theme", nuevoTema);
      localStorage.setItem("tema", nuevoTema);
      actualizarIcono(nuevoTema);
      actualizarSeparador(nuevoTema);
    });

    function actualizarIcono(tema) {
      const icono = document.getElementById("icono-bootstrap");
      if (!icono) return;

      if (tema === "light") {
        icono.className = "bi bi-moon-stars";
        icono.style.color = "#212529"; // tono oscuro
      } else {
        icono.className = "bi bi-sun";
        icono.style.color = "#ffffff"; // tono claro
      }
    }
  }

  // 📦 Carga las secciones del sitio
  cargarHTML("resources/header.html", "header");
  cargarHTML("resources/main.html", "main");
  cargarHTML("resources/footer.html", "footer");
});



