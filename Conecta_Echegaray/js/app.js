/* ==================================================
   CONECTA ECHEGARAY
   APP.JS
================================================== */


/* ==================================================
   1. MENÚ MÓVIL
================================================== */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        const isOpen = mobileMenu.classList.toggle("active");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");

        });

    });

}


/* ==================================================
   1.1 BUSCADOR GENERAL
================================================== */

const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const backendEnabled = ["http:", "https:"].includes(
    window.location.protocol
);

if (searchButton && searchBox) {

    searchButton.addEventListener("click", () => {

        const isActive = searchBox.classList.toggle("active");

        searchButton.setAttribute(
            "aria-expanded",
            String(isActive)
        );

        if (isActive && searchInput) {
            searchInput.focus();
        }

    });

}

else if (searchButton) {

    searchButton.addEventListener("click", () => {

        const directoryInput =
            document.getElementById("businessSearch");

        if (directoryInput) {
            directoryInput.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            directoryInput.focus();
        }

    });

}


if (searchInput) {

    searchInput.addEventListener("keydown", event => {

        if (event.key !== "Enter") {
            return;
        }

        const query = searchInput.value.trim();

        if (!query) {
            return;
        }

        const eventsList = document.getElementById("eventsList");

        if (eventsList) {
            filtrarEventos(query);
            return;
        }

        window.location.href =
            "noticias.html?q=" + encodeURIComponent(query);

    });

}



/* ==================================================
   2. DATOS DE LAS NOTICIAS
================================================== */

/*
    Por ahora utilizamos datos de prueba.

    Más adelante estos datos vendrán desde:

        PostgreSQL
             ↓
        Backend / API
             ↓
        JavaScript
             ↓
        detalle.html
*/

const noticias = {

    1: {

        categoria: "Comunidad",

        categoriaSlug: "comunidad",

        titulo:
            "Jornada de limpieza comunitaria en Echegaray",

        fecha:
            "29 de agosto de 2026",

        fechaCorta:
            "29 Ago 2026",

        ubicacion:
            "Echegaray",

        icono:
            "🧹",

        descripcion:
            "Vecinos de la comunidad organizan una jornada para mejorar y mantener limpios los espacios comunes.",

        caption:
            "Actividad comunitaria de limpieza en Echegaray.",

        introduccion:
            "Vecinos de Echegaray organizan una jornada de limpieza comunitaria con el objetivo de mejorar y conservar los espacios comunes de la zona.",

        contenido: `

            <p>
                La actividad busca reunir a habitantes
                interesados en colaborar con el mantenimiento
                de diferentes áreas de la comunidad.
            </p>

            <h2>
                ¿En qué consiste?
            </h2>

            <p>
                Durante la jornada se realizarán actividades
                de limpieza y recolección de residuos en
                espacios comunes. La intención es fomentar
                la participación de los habitantes y generar
                un mayor sentido de responsabilidad sobre
                nuestro entorno.
            </p>

            <h2>
                ¿Dónde y cuándo?
            </h2>

            <div class="article-event-box">

                <div>

                    <span>📍</span>

                    <div>

                        <strong>
                            Lugar
                        </strong>

                        <p>
                            Espacios comunes de Echegaray
                        </p>

                    </div>

                </div>


                <div>

                    <span>📅</span>

                    <div>

                        <strong>
                            Fecha
                        </strong>

                        <p>
                            29 de agosto de 2026
                        </p>

                    </div>

                </div>


                <div>

                    <span>⏰</span>

                    <div>

                        <strong>
                            Horario
                        </strong>

                        <p>
                            09:00 AM
                        </p>

                    </div>

                </div>

            </div>

            <h2>
                Participación
            </h2>

            <p>
                Quienes deseen participar pueden acudir
                directamente al punto de reunión. Se
                recomienda llevar guantes y, si es posible,
                herramientas básicas para realizar las
                actividades de limpieza.
            </p>

            <p>
                Este tipo de iniciativas buscan fortalecer
                la participación y colaboración entre los
                habitantes de Echegaray.
            </p>

        `

    },


    2: {

        categoria: "Avisos",

        categoriaSlug: "avisos",

        titulo:
            "Aviso sobre mantenimiento de espacios públicos",

        fecha:
            "28 de agosto de 2026",

        fechaCorta:
            "28 Ago 2026",

        ubicacion:
            "Echegaray",

        icono:
            "📢",

        descripcion:
            "Información importante para los habitantes relacionada con trabajos y mantenimiento en diferentes zonas.",

        caption:
            "Aviso comunitario sobre mantenimiento de espacios públicos.",

        introduccion:
            "Se informa a los habitantes de Echegaray sobre trabajos de mantenimiento que se realizarán en diferentes espacios de la comunidad.",

        contenido: `

            <p>
                Los trabajos tienen como finalidad conservar
                en mejores condiciones los espacios utilizados
                diariamente por los habitantes.
            </p>

            <h2>
                ¿Qué se realizará?
            </h2>

            <p>
                Las actividades contemplan labores de
                mantenimiento y limpieza en diferentes
                puntos de la comunidad.
            </p>

            <h2>
                Recomendaciones
            </h2>

            <p>
                Se recomienda a los habitantes tomar
                precauciones al transitar por las zonas
                donde se estén realizando trabajos.
            </p>

            <p>
                Agradecemos la comprensión y colaboración
                de la comunidad.
            </p>

        `

    },


    3: {

        categoria: "Eventos",

        categoriaSlug: "eventos",

        titulo:
            "Próximo evento comunitario en la zona",

        fecha:
            "27 de agosto de 2026",

        fechaCorta:
            "27 Ago 2026",

        ubicacion:
            "Echegaray",

        icono:
            "📅",

        descripcion:
            "Consulta los detalles de las próximas actividades y encuentros organizados dentro de la comunidad.",

        caption:
            "Evento comunitario en Echegaray.",

        introduccion:
            "La comunidad contará próximamente con una actividad abierta para los habitantes de Echegaray.",

        contenido: `

            <p>
                Este evento busca generar un espacio de
                convivencia y participación entre los
                habitantes de la comunidad.
            </p>

            <h2>
                Actividad comunitaria
            </h2>

            <p>
                Durante el encuentro se podrán realizar
                diferentes actividades y conocer a otros
                habitantes interesados en participar en
                iniciativas comunitarias.
            </p>

            <h2>
                Información del evento
            </h2>

            <div class="article-event-box">

                <div>

                    <span>📍</span>

                    <div>

                        <strong>
                            Lugar
                        </strong>

                        <p>
                            Echegaray
                        </p>

                    </div>

                </div>


                <div>

                    <span>📅</span>

                    <div>

                        <strong>
                            Fecha
                        </strong>

                        <p>
                            Próximamente
                        </p>

                    </div>

                </div>

            </div>

            <p>
                Mantente pendiente de Conecta Echegaray
                para conocer más detalles.
            </p>

        `

    },


    4: {

        categoria: "Iniciativas",

        categoriaSlug: "iniciativas",

        titulo:
            "Nueva iniciativa para fortalecer la participación comunitaria",

        fecha:
            "26 de agosto de 2026",

        fechaCorta:
            "26 Ago 2026",

        ubicacion:
            "Echegaray",

        icono:
            "💡",

        descripcion:
            "Conoce propuestas e iniciativas que buscan generar una mayor participación entre los habitantes.",

        caption:
            "Nueva iniciativa comunitaria en Echegaray.",

        introduccion:
            "Habitantes de Echegaray proponen nuevas formas de fortalecer la participación y colaboración dentro de la comunidad.",

        contenido: `

            <p>
                Las iniciativas comunitarias pueden ayudar
                a generar nuevos espacios de colaboración
                entre vecinos.
            </p>

            <h2>
                ¿Cuál es la propuesta?
            </h2>

            <p>
                La propuesta busca facilitar la participación
                de los habitantes mediante actividades e
                iniciativas que puedan beneficiar a la
                comunidad.
            </p>

            <h2>
                Participación
            </h2>

            <p>
                Los habitantes interesados pueden mantenerse
                informados a través de Conecta Echegaray para
                conocer nuevas actividades y oportunidades
                de colaboración.
            </p>

        `

    },


    5: {

        categoria: "Comercios",

        categoriaSlug: "comercios",

        titulo:
            "Conoce los comercios de nuestra comunidad",

        fecha:
            "25 de agosto de 2026",

        fechaCorta:
            "25 Ago 2026",

        ubicacion:
            "Echegaray",

        icono:
            "🛍️",

        descripcion:
            "Descubre negocios y servicios locales que forman parte de la comunidad de Echegaray.",

        caption:
            "Comercio local de la comunidad de Echegaray.",

        introduccion:
            "Los comercios y servicios locales forman parte importante de la actividad cotidiana de nuestra comunidad.",

        contenido: `

            <p>
                Conecta Echegaray busca también servir como
                un espacio para dar visibilidad a los negocios
                y servicios que existen dentro de la comunidad.
            </p>

            <h2>
                Comercio local
            </h2>

            <p>
                A través del portal, los habitantes podrán
                conocer diferentes establecimientos, servicios
                y emprendimientos disponibles en la zona.
            </p>

            <h2>
                Participación de los comercios
            </h2>

            <p>
                Los comerciantes y emprendedores podrán
                proporcionar información sobre sus negocios
                para que pueda ser consultada por los
                habitantes.
            </p>

        `

    }

};



/* ==================================================
   2.1 DATOS DEL DIRECTORIO LOCAL
================================================== */

const businesses = [

    {
        id: "cafe-del-parque",
        name: "Café del Parque",
        category: "alimentos",
        categoryLabel: "Alimentos",
        icon: "☕",
        description:
            "Cafetería de ejemplo con bebidas, pan recién hecho y opciones para llevar.",
        location: "Echegaray",
        address: "Zona del parque de Echegaray",
        schedule: "Lunes a sábado · 08:00 a 20:00",
        contact: "Información de contacto en validación",
        services: ["Café", "Panadería", "Para llevar"]
    },

    {
        id: "soluciones-del-hogar",
        name: "Soluciones del Hogar",
        category: "servicios",
        categoryLabel: "Servicios",
        icon: "🔧",
        description:
            "Servicio de ejemplo para reparaciones menores y apoyo en el mantenimiento del hogar.",
        location: "Echegaray",
        address: "Servicio a domicilio en Echegaray",
        schedule: "Lunes a viernes · 09:00 a 18:00",
        contact: "Información de contacto en validación",
        services: ["Reparaciones", "Mantenimiento", "Visita a domicilio"]
    },

    {
        id: "espacio-bienestar",
        name: "Espacio Bienestar",
        category: "salud",
        categoryLabel: "Salud",
        icon: "🌿",
        description:
            "Espacio de ejemplo dedicado a actividades de bienestar y cuidado personal.",
        location: "Echegaray",
        address: "Echegaray",
        schedule: "Previa cita",
        contact: "Información de contacto en validación",
        services: ["Bienestar", "Actividades guiadas", "Previa cita"]
    },

    {
        id: "casa-y-jardin",
        name: "Casa y Jardín",
        category: "hogar",
        categoryLabel: "Hogar",
        icon: "🪴",
        description:
            "Proyecto de ejemplo con artículos y asesoría para el cuidado de casa y jardín.",
        location: "Echegaray",
        address: "Echegaray",
        schedule: "Lunes a sábado · 10:00 a 18:00",
        contact: "Información de contacto en validación",
        services: ["Jardinería", "Artículos para hogar", "Asesoría"]
    },

    {
        id: "aula-comunitaria",
        name: "Aula Comunitaria",
        category: "educacion",
        categoryLabel: "Educación",
        icon: "📚",
        description:
            "Espacio de ejemplo para clases, asesorías y actividades de aprendizaje.",
        location: "Echegaray",
        address: "Echegaray",
        schedule: "Consulta horarios disponibles",
        contact: "Información de contacto en validación",
        services: ["Clases", "Asesorías", "Talleres"]
    }

];



/* ==================================================
   3. BUSCADOR Y FILTROS DE NOTICIAS
================================================== */

const newsResults =
    document.getElementById("newsResults");

const newsSearch =
    document.getElementById("newsSearch");

const noResults =
    document.getElementById("noResults");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const sidebarCategoryButtons =
    document.querySelectorAll(
        ".sidebar-categories button"
    );


let categoriaActual = "all";



function filtrarNoticias() {

    if (!newsResults) {
        return;
    }


    const cards =
        newsResults.querySelectorAll(
            ".news-list-card"
        );


    const texto =
        newsSearch
            ? newsSearch.value
                .toLowerCase()
                .trim()
            : "";


    let resultados = 0;


    cards.forEach(card => {

        const categoria =
            card.dataset.category;

        const titulo =
            card.dataset.title
                .toLowerCase();


        const coincideCategoria =
            categoriaActual === "all" ||
            categoria === categoriaActual;


        const coincideBusqueda =
            texto === "" ||
            titulo.includes(texto);


        if (
            coincideCategoria &&
            coincideBusqueda
        ) {

            card.style.display = "";

            resultados++;

        } else {

            card.style.display = "none";

        }

    });


    if (noResults) {

        noResults.style.display =
            resultados === 0
                ? "block"
                : "none";

    }

}



/* FILTROS SUPERIORES */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoriaActual =
            button.dataset.category;


        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        filtrarNoticias();

    });

});



/* CATEGORÍAS DEL SIDEBAR */

sidebarCategoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoriaActual =
            button.dataset.category;


        filterButtons.forEach(btn => {

            btn.classList.remove("active");


            if (
                btn.dataset.category ===
                categoriaActual
            ) {

                btn.classList.add("active");

            }

        });


        filtrarNoticias();


        if (newsResults) {

            newsResults.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    });

});



/* BUSCADOR */

if (newsSearch) {

    const query = new URLSearchParams(
        window.location.search
    ).get("q");

    if (query) {
        newsSearch.value = query;
    }

    newsSearch.addEventListener(
        "input",
        filtrarNoticias
    );

}


/* ==================================================
   3.1 FILTROS DE EVENTOS
================================================== */

const eventsList = document.getElementById("eventsList");
const eventFilterButtons = eventsList
    ? eventsList.closest(".section")
        .querySelectorAll(".filter-btn")
    : [];

let categoriaEventoActual = "all";

function filtrarEventos(query = "") {

    if (!eventsList) {
        return;
    }

    const texto = query.toLowerCase().trim();

    eventsList.querySelectorAll(".event-card").forEach(card => {

        const coincideCategoria =
            categoriaEventoActual === "all" ||
            card.dataset.category === categoriaEventoActual;

        const coincideTexto =
            !texto ||
            card.textContent.toLowerCase().includes(texto);

        card.style.display =
            coincideCategoria && coincideTexto ? "" : "none";

    });

}


eventFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoriaEventoActual = button.dataset.category;

        eventFilterButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        filtrarEventos(searchInput ? searchInput.value : "");

    });

});


/* ==================================================
   3.2 DIRECTORIO DE COMERCIOS
================================================== */

const businessGrid = document.getElementById("businessGrid");
const businessSearch = document.getElementById("businessSearch");
const businessNoResults = document.getElementById("businessNoResults");
const businessFilterButtons = businessGrid
    ? businessGrid.closest(".section")
        .querySelectorAll(".filter-btn")
    : [];

let categoriaComercioActual = "all";

function escaparHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


const directoryCategoryMeta = {
    alimentos: { label: "Alimentos", icon: "🍽️" },
    servicios: { label: "Servicios", icon: "🔧" },
    salud: { label: "Salud", icon: "🌿" },
    hogar: { label: "Hogar", icon: "🪴" },
    educacion: { label: "Educación", icon: "📚" }
};


function normalizarComercio(business) {

    const meta = directoryCategoryMeta[business.category] || {};

    return {
        ...business,
        categoryLabel: business.categoryLabel || meta.label || "Directorio local",
        icon: business.icon || meta.icon || "🏪",
        location: business.location || "Echegaray",
        address: business.address || business.location || "Echegaray",
        schedule: business.schedule || "Consulta horarios disponibles",
        contact: business.contact || "Contacto disponible próximamente",
        services: Array.isArray(business.services)
            ? business.services
            : business.title ? [business.title] : []
    };

}


function normalizarPublicacion(publication) {

    return {
        ...publication,
        businessName: publication.businessName || publication.business_name,
        createdAt: publication.createdAt || publication.created_at,
        reviewedAt: publication.reviewedAt || publication.reviewed_at
    };

}


function renderBusinessCards() {

    if (!businessGrid) {
        return;
    }

    businessGrid.innerHTML = businesses.map(normalizarComercio).map(business => `

        <a
            class="business-card"
            href="comercio-detalle.html?id=${encodeURIComponent(business.id)}"
            data-category="${escaparHTML(business.category)}"
        >
            <div class="business-icon" aria-hidden="true">
                ${escaparHTML(business.icon)}
            </div>

            <div>
                <span class="tag">
                    ${escaparHTML(business.categoryLabel)}
                </span>

                <h3>
                    ${escaparHTML(business.name)}
                </h3>

                <p>
                    ${escaparHTML(business.description)}
                </p>

                <small>
                    📍 ${escaparHTML(business.location)}
                </small>
            </div>
        </a>

    `).join("");

}


function filtrarComercios() {

    if (!businessGrid) {
        return;
    }

    const texto = businessSearch
        ? businessSearch.value.toLowerCase().trim()
        : "";

    let resultados = 0;

    businessGrid.querySelectorAll(".business-card").forEach(card => {

        const coincideCategoria =
            categoriaComercioActual === "all" ||
            card.dataset.category === categoriaComercioActual;

        const coincideTexto =
            !texto ||
            card.textContent.toLowerCase().includes(texto);

        card.style.display =
            coincideCategoria && coincideTexto ? "" : "none";

        if (coincideCategoria && coincideTexto) {
            resultados++;
        }

    });

    if (businessNoResults) {
        businessNoResults.hidden = resultados !== 0;
    }

}


businessFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoriaComercioActual = button.dataset.category;

        businessFilterButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        filtrarComercios();

    });

});


if (businessSearch) {
    businessSearch.addEventListener("input", filtrarComercios);
}


renderBusinessCards();
filtrarComercios();


async function cargarComerciosAprobados() {

    if (!businessGrid || !backendEnabled) {
        return;
    }

    try {

        const response = await fetch("/api/businesses");

        if (!response.ok) {
            return;
        }

        const approvedBusinesses = await response.json();

        if (!Array.isArray(approvedBusinesses)) {
            return;
        }

        const existingIds = new Set(
            businesses.map(item => item.id)
        );

        approvedBusinesses.forEach(business => {
            if (!existingIds.has(business.id)) {
                businesses.push(business);
            }
        });

        renderBusinessCards();
        filtrarComercios();

    } catch (error) {

        // El directorio de ejemplo sigue disponible sin el backend.

    }

}


cargarComerciosAprobados();



/* ==================================================
   4. CARGAR DETALLE DE NOTICIA
================================================== */

const articleTitle =
    document.getElementById("articleTitle");

const articleCategory =
    document.getElementById("articleCategory");

const articleDate =
    document.getElementById("articleDate");

const articleLocation =
    document.getElementById("articleLocation");

const articleImage =
    document.getElementById("articleImage");

const articleCaption =
    document.getElementById("articleCaption");

const articleBody =
    document.getElementById("articleBody");



/*
    Verificamos si estamos en detalle.html.

    URL:

        detalle.html?id=1
*/

if (articleTitle) {


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    const noticia =
        noticias[id];



    /* ===============================
       SI EXISTE LA NOTICIA
    =============================== */

    if (noticia) {


        /* TÍTULO */

        articleTitle.textContent =
            noticia.titulo;



        /* CATEGORÍA */

        articleCategory.textContent =
            noticia.categoria;



        /* FECHA */

        articleDate.textContent =
            "📅 " + noticia.fecha;



        /* UBICACIÓN */

        articleLocation.textContent =
            "📍 " + noticia.ubicacion;



        /* IMAGEN / ICONO */

        articleImage.innerHTML = `

            <span>
                ${noticia.icono}
            </span>

        `;



        /* DESCRIPCIÓN DE IMAGEN */

        articleCaption.textContent =
            noticia.caption;



        /* CUERPO */

        articleBody.innerHTML = `

            <p class="article-lead">
                ${noticia.introduccion}
            </p>

            ${noticia.contenido}

        `;



        /* TÍTULO DEL NAVEGADOR */

        document.title =
            noticia.titulo +
            " | Conecta Echegaray";



        /* META DESCRIPTION */

        const metaDescription =
            document.querySelector(
                'meta[name="description"]'
            );


        if (metaDescription) {

            metaDescription.setAttribute(
                "content",
                noticia.descripcion
            );

        }


    }



    /* ===============================
       SI NO EXISTE
    =============================== */

    else {


        articleTitle.textContent =
            "Publicación no encontrada";


        articleCategory.textContent =
            "Conecta Echegaray";


        articleDate.textContent =
            "";


        articleLocation.textContent =
            "";


        articleImage.innerHTML = `

            <span>
                🔎
            </span>

        `;


        articleCaption.textContent =
            "No encontramos la publicación solicitada.";


        articleBody.innerHTML = `

            <p class="article-lead">
                La publicación que estás buscando
                no existe o ya no está disponible.
            </p>

            <p>
                Regresa a la sección de noticias para
                consultar las publicaciones disponibles.
            </p>

        `;


        document.title =
            "Publicación no encontrada | Conecta Echegaray";

    }

}



/* ==================================================
   5. CARGAR FICHA DE COMERCIO
================================================== */

const businessDetailTitle =
    document.getElementById("businessDetailTitle");

const businessCategory =
    document.getElementById("businessCategory");

const businessLocation =
    document.getElementById("businessLocation");

const businessSchedule =
    document.getElementById("businessSchedule");

const businessIcon =
    document.getElementById("businessIcon");

const businessCaption =
    document.getElementById("businessCaption");

const businessDetailBody =
    document.getElementById("businessDetailBody");


if (businessDetailTitle) {

    const businessId = new URLSearchParams(
        window.location.search
    ).get("id");

    const business = normalizarComercio(businesses.find(item =>
        item.id === businessId
    ) || {});

    if (business.id) {

        businessCategory.textContent = business.categoryLabel;
        businessDetailTitle.textContent = business.name;
        businessLocation.textContent = "📍 " + business.location;
        businessSchedule.textContent = "🕒 " + business.schedule;
        businessIcon.innerHTML = `
            <span>${escaparHTML(business.icon)}</span>
        `;
        businessCaption.textContent =
            `Ficha de ${business.categoryLabel.toLowerCase()} en Echegaray.`;

        const services = business.services.map(service => `
            <li>${escaparHTML(service)}</li>
        `).join("");

        businessDetailBody.innerHTML = `

            <p class="article-lead">
                ${escaparHTML(business.description)}
            </p>

            <h2>Servicios y productos</h2>

            <ul class="business-services">
                ${services}
            </ul>

            <h2>Información del comercio</h2>

            <div class="article-event-box">
                <div>
                    <span>📍</span>
                    <div>
                        <strong>Ubicación</strong>
                        <p>${escaparHTML(business.address)}</p>
                    </div>
                </div>

                <div>
                    <span>🕒</span>
                    <div>
                        <strong>Horario</strong>
                        <p>${escaparHTML(business.schedule)}</p>
                    </div>
                </div>
            </div>

            <div class="article-contact">
                <div class="article-contact-icon">ℹ️</div>
                <div>
                    <strong>Contacto</strong>
                    <p>${escaparHTML(business.contact)}</p>
                </div>
            </div>

        `;

        document.title =
            `${business.name} | Conecta Echegaray`;

        const metaDescription = document.querySelector(
            'meta[name="description"]'
        );

        if (metaDescription) {
            metaDescription.setAttribute(
                "content",
                business.description
            );
        }

    } else {

        businessCategory.textContent = "Directorio local";
        businessDetailTitle.textContent = "Comercio no encontrado";
        businessLocation.textContent = "";
        businessSchedule.textContent = "";
        businessIcon.innerHTML = "<span>🔎</span>";
        businessCaption.textContent =
            "No encontramos la ficha solicitada.";

        businessDetailBody.innerHTML = `
            <p class="article-lead">
                El comercio o servicio que buscas no existe
                o aún no ha sido publicado.
            </p>
            <p>
                Regresa al directorio para descubrir los comercios
                y servicios disponibles.
            </p>
        `;

        document.title =
            "Comercio no encontrado | Conecta Echegaray";

    }

}


async function cargarFichaDeComercio() {

    if (!businessDetailTitle || !backendEnabled) {
        return;
    }

    const businessId = new URLSearchParams(
        window.location.search
    ).get("id");

    if (!businessId || businesses.some(item => item.id === businessId)) {
        return;
    }

    try {

        const response = await fetch(
            `/api/businesses/${encodeURIComponent(businessId)}`
        );

        if (!response.ok) {
            return;
        }

        const business = normalizarComercio(await response.json());
        const services = business.services.map(service => `
            <li>${escaparHTML(service)}</li>
        `).join("");

        businessCategory.textContent = business.categoryLabel;
        businessDetailTitle.textContent = business.name;
        businessLocation.textContent = "📍 " + business.location;
        businessSchedule.textContent = "🕒 " + business.schedule;
        businessIcon.innerHTML = `<span>${escaparHTML(business.icon)}</span>`;
        businessCaption.textContent =
            `Ficha de ${business.categoryLabel.toLowerCase()} en Echegaray.`;
        businessDetailBody.innerHTML = `
            <p class="article-lead">${escaparHTML(business.description || "")}</p>
            <h2>Servicios y productos</h2>
            <ul class="business-services">${services}</ul>
            <h2>Información del comercio</h2>
            <div class="article-event-box">
                <div><span>📍</span><div><strong>Ubicación</strong><p>${escaparHTML(business.address)}</p></div></div>
                <div><span>🕒</span><div><strong>Horario</strong><p>${escaparHTML(business.schedule)}</p></div></div>
            </div>
            <div class="article-contact">
                <div class="article-contact-icon">ℹ️</div>
                <div><strong>Contacto</strong><p>${escaparHTML(business.contact)}</p></div>
            </div>
        `;

        document.title = `${business.name} | Conecta Echegaray`;

    } catch (error) {

        // La ficha local sigue disponible cuando no hay conexión.

    }

}


cargarFichaDeComercio();



/* ==================================================
   6. BOTÓN COMPARTIR
================================================== */

const shareButton =
    document.getElementById("shareButton");


if (shareButton) {


    shareButton.addEventListener(
        "click",
        async () => {


            const shareData = {

                title:
                    document.title,

                text:
                    "Mira esta publicación de Conecta Echegaray.",

                url:
                    window.location.href

            };



            /*
                En dispositivos compatibles
                utilizamos el menú nativo.
            */

            if (
                navigator.share &&
                window.isSecureContext
            ) {


                try {

                    await navigator.share(
                        shareData
                    );


                } catch (error) {

                    /*
                        El usuario canceló
                        el menú de compartir.
                    */

                    console.log(
                        "Compartir cancelado."
                    );

                }


            }


            /*
                Si el navegador no soporta
                navigator.share, copiamos
                el enlace.
            */

            else {


                try {


                    await navigator.clipboard
                        .writeText(
                            window.location.href
                        );


                    shareButton.textContent =
                        "✓ Enlace copiado";


                    setTimeout(() => {

                        shareButton.textContent =
                            "↗ Compartir";

                    }, 2000);


                } catch (error) {


                    alert(
                        "No fue posible copiar el enlace."
                    );

                }

            }

        }
    );

}



/* ==================================================
   7. FORMULARIO DE PUBLICACIÓN
================================================== */

const publishForm = document.getElementById("publishForm");
const publicationType = document.getElementById("type");
const descriptionField = document.getElementById("description");
const characterCounter = document.getElementById("characterCounter");
const eventFields = document.getElementById("eventFields");
const eventDate = document.getElementById("eventDate");
const eventTime = document.getElementById("eventTime");
const businessFields = document.getElementById("businessFields");
const businessName = document.getElementById("businessName");
const businessCategoryField =
    document.getElementById("businessCategory");
const formMessage = document.getElementById("formMessage");

function actualizarCamposCondicionales() {

    const esEvento = publicationType &&
        publicationType.value === "evento";

    const esDirectorio = publicationType && [
        "comercio",
        "servicio"
    ].includes(publicationType.value);

    if (eventFields) {
        eventFields.classList.toggle("active", esEvento);
    }

    if (eventDate) {
        eventDate.required = esEvento;
    }

    if (eventTime) {
        eventTime.required = esEvento;
    }

    if (businessFields) {
        businessFields.classList.toggle("active", esDirectorio);
    }

    if (businessName) {
        businessName.required = esDirectorio;
    }

    if (businessCategoryField) {
        businessCategoryField.required = esDirectorio;
    }

}


if (publicationType) {
    publicationType.addEventListener(
        "change",
        actualizarCamposCondicionales
    );
    actualizarCamposCondicionales();
}


if (descriptionField && characterCounter) {

    const actualizarContador = () => {
        characterCounter.textContent =
            `${descriptionField.value.length} / 1000`;
    };

    descriptionField.addEventListener("input", actualizarContador);
    actualizarContador();

}


if (publishForm) {

    const storageKey =
        "conectaEchegarayPendingDirectoryRequests";

    const guardarSolicitud = async () => {

        const request = {
            type: publicationType.value,
            title: document.getElementById("title").value.trim(),
            description: descriptionField.value.trim(),
            businessName: businessName.value.trim(),
            category: businessCategoryField.value,
            hours: document.getElementById("businessHours").value.trim(),
            location: document.getElementById("location").value.trim(),
            contact: document.getElementById("contact").value.trim(),
            eventDate: eventDate ? eventDate.value : "",
            eventTime: eventTime ? eventTime.value : ""
        };

        if (backendEnabled) {

            try {

                const formData = new FormData();

                Object.entries(request).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                const imageInput = document.getElementById("image");

                if (imageInput && imageInput.files[0]) {
                    formData.append("image", imageInput.files[0]);
                }

                const response = await fetch(
                    "/api/publications",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                if (response.ok) {
                    return "backend";
                }

                const error = await response.json().catch(() => ({}));
                throw new Error(
                    error.detail || "No fue posible enviar la publicación."
                );

            } catch (error) {

                // En desarrollo sin API, conservamos un respaldo local.
                // No usamos ese respaldo para errores de validación del servidor.
                if (error.message && !error.message.includes("Failed to fetch")) {
                    throw error;
                }

            }

        }

        try {

            const storedRequests = JSON.parse(
                window.localStorage.getItem(storageKey) || "[]"
            );

            const requests = Array.isArray(storedRequests)
                ? storedRequests
                : [];

            requests.push({
                id: `local-${Date.now()}`,
                status: "pendiente",
                createdAt: new Date().toISOString(),
                ...request
            });

            window.localStorage.setItem(
                storageKey,
                JSON.stringify(requests)
            );

            return "local";

        } catch (error) {

            return null;

        }

    };

    publishForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (!publishForm.checkValidity()) {
            publishForm.reportValidity();
            return;
        }

        let resultadoGuardado;

        try {
            resultadoGuardado = await guardarSolicitud();
        } catch (error) {
            resultadoGuardado = null;

            if (formMessage) {
                formMessage.textContent = error.message;
                formMessage.classList.remove("form-success");
                formMessage.classList.add("form-error");
            }
        }

        const seGuardo = Boolean(resultadoGuardado);

        if (formMessage) {
            formMessage.classList.remove("form-success", "form-error");

            if (seGuardo) {
                formMessage.textContent = resultadoGuardado === "backend"
                    ? "Solicitud enviada al panel de revisión."
                    : "Solicitud guardada en este navegador como pendiente de revisión.";

                formMessage.classList.add("form-success");

            } else {
                formMessage.textContent =
                    "No fue posible guardar la solicitud en este navegador.";

                formMessage.classList.add("form-error");
            }
        }

        if (!seGuardo) {
            return;
        }

        publishForm.reset();
        actualizarCamposCondicionales();

        if (characterCounter) {
            characterCounter.textContent = "0 / 1000";
        }

    });

}


/* ==================================================
   8. PANEL DE REVISIÓN
================================================== */

const reviewList = document.getElementById("reviewList");
const reviewEmpty = document.getElementById("reviewEmpty");
const pendingCount = document.getElementById("pendingCount");
const reviewSource = document.getElementById("reviewSource");
const refreshReviews = document.getElementById("refreshReviews");
const pendingDirectoryStorageKey =
    "conectaEchegarayPendingDirectoryRequests";

let reviewMode = "local";

function formatReviewDate(value) {

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);

}


function renderReviewList(requests) {

    if (!reviewList) {
        return;
    }

    if (pendingCount) {
        pendingCount.textContent = requests.length;
    }

    if (reviewEmpty) {
        reviewEmpty.hidden = requests.length !== 0;
    }

    reviewList.innerHTML = requests.map(request => {

        request = normalizarPublicacion(request);

        return `

        <article class="review-card">

            <div class="review-card-header">
                <div>
                    <span class="tag">
                        ${escaparHTML(request.category || "Sin categoría")}
                    </span>

                    <h3>${escaparHTML(request.businessName || request.title)}</h3>

                    <p>${escaparHTML(request.title)}</p>
                </div>

                <small>${escaparHTML(formatReviewDate(request.createdAt))}</small>
            </div>

            <p>${escaparHTML(request.description)}</p>

            <div class="review-card-details">
                <div>
                    <strong>Tipo</strong>
                    <span>${escaparHTML(request.type)}</span>
                </div>
                <div>
                    <strong>Ubicación</strong>
                    <span>${escaparHTML(request.location || "Sin especificar")}</span>
                </div>
                <div>
                    <strong>Contacto</strong>
                    <span>${escaparHTML(request.contact || "Sin especificar")}</span>
                </div>
            </div>

            <div class="review-card-footer">
                <span>Horario: ${escaparHTML(request.hours || "Sin especificar")}</span>

                <div class="review-actions">
                    <button
                        class="btn btn-primary"
                        data-review-action="aprobar"
                        data-review-id="${escaparHTML(request.id)}"
                    >
                        Aprobar
                    </button>

                    <button
                        class="btn btn-danger"
                        data-review-action="rechazar"
                        data-review-id="${escaparHTML(request.id)}"
                    >
                        Rechazar
                    </button>
                </div>
            </div>

        </article>

    `;

    }).join("");

}


function getLocalPendingRequests() {

    try {

        const storedRequests = JSON.parse(
            window.localStorage.getItem(
                pendingDirectoryStorageKey
            ) || "[]"
        );

        return Array.isArray(storedRequests)
            ? storedRequests.filter(item =>
                item.status === "pendiente"
            )
            : [];

    } catch (error) {

        return [];

    }

}


async function loadReviewRequests() {

    if (!reviewList) {
        return;
    }

    let requests = [];
    reviewMode = "local";

    if (backendEnabled) {

        try {

            const response = await fetch(
                "/api/publications?status=pendiente"
            );

            if (!response.ok) {
                throw new Error("API no disponible");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Respuesta no válida");
            }

            requests = data;
            reviewMode = "backend";

        } catch (error) {

            requests = getLocalPendingRequests();

        }

    } else {

        requests = getLocalPendingRequests();

    }

    if (reviewSource) {
        reviewSource.textContent = reviewMode === "backend"
            ? "Conectado al backend local"
            : "Mostrando solicitudes guardadas en este navegador";
    }

    renderReviewList(requests);

}


async function updateReviewStatus(id, status) {

    if (reviewMode === "backend") {

        const response = await fetch(
            `/api/publications/${encodeURIComponent(id)}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo actualizar la solicitud.");
        }

        return;

    }

    const storedRequests = JSON.parse(
        window.localStorage.getItem(
            pendingDirectoryStorageKey
        ) || "[]"
    );

    if (!Array.isArray(storedRequests)) {
        throw new Error("No hay solicitudes locales válidas.");
    }

    const request = storedRequests.find(item => item.id === id);

    if (!request) {
        throw new Error("Solicitud no encontrada.");
    }

    request.status = status;
    request.reviewedAt = new Date().toISOString();

    window.localStorage.setItem(
        pendingDirectoryStorageKey,
        JSON.stringify(storedRequests)
    );

}


if (reviewList) {

    reviewList.addEventListener("click", async event => {

        const button = event.target.closest("[data-review-action]");

        if (!button) {
            return;
        }

        const status = button.dataset.reviewAction === "aprobar"
            ? "aprobada"
            : "rechazada";

        try {

            await updateReviewStatus(button.dataset.reviewId, status);
            await loadReviewRequests();

        } catch (error) {

            if (reviewSource) {
                reviewSource.textContent = error.message;
            }

        }

    });

    loadReviewRequests();

}


if (refreshReviews) {
    refreshReviews.addEventListener("click", loadReviewRequests);
}


/* ==================================================
   8.1 PUBLICACIONES APROBADAS
================================================== */

const publicTypeMeta = {
    noticia: { label: "Noticias", category: "comunidad", icon: "📰" },
    aviso: { label: "Avisos", category: "avisos", icon: "📢" },
    evento: { label: "Eventos", category: "eventos", icon: "📅" },
    iniciativa: { label: "Iniciativas", category: "iniciativas", icon: "💡" },
    "compra-venta": { label: "Compra, venta e intercambio", category: "comunidad", icon: "🔄" }
};

function fechaPublicacion(publication, options = { dateStyle: "medium" }) {

    const rawDate = publication.event_date || publication.created_at;

    if (!rawDate) {
        return "Fecha por confirmar";
    }

    const date = publication.event_date
        ? new Date(`${publication.event_date}T12:00:00`)
        : new Date(rawDate);

    return new Intl.DateTimeFormat("es-MX", options).format(date);

}


function datosPublicacion(publication) {

    return publicTypeMeta[publication.type] || {
        label: "Comunidad",
        category: "comunidad",
        icon: "📌"
    };

}


async function cargarPublicacionesAprobadas(types) {

    if (!backendEnabled) {
        return [];
    }

    try {

        const response = await fetch(
            `/api/publications/public?types=${encodeURIComponent(types.join(","))}`
        );

        if (!response.ok) {
            return [];
        }

        const publications = await response.json();

        return Array.isArray(publications) ? publications : [];

    } catch (error) {

        return [];

    }

}


async function cargarNoticiasPublicadas() {

    if (!newsResults) {
        return;
    }

    const publications = await cargarPublicacionesAprobadas([
        "noticia", "aviso"
    ]);

    publications.forEach(publication => {

        const meta = datosPublicacion(publication);
        const image = publication.image_path
            ? `<img src="${escaparHTML(publication.image_path)}" alt="">`
            : `<span>${meta.icon}</span>`;

        newsResults.insertAdjacentHTML("afterbegin", `
            <article class="news-list-card"
                data-category="${escaparHTML(meta.category)}"
                data-title="${escaparHTML(publication.title)}">
                <div class="news-list-image placeholder">${image}</div>
                <div class="news-list-content">
                    <div class="news-list-top">
                        <span class="tag">${escaparHTML(meta.label)}</span>
                        <span class="news-date">${escaparHTML(fechaPublicacion(publication))}</span>
                    </div>
                    <h2>${escaparHTML(publication.title)}</h2>
                    <p>${escaparHTML(publication.description)}</p>
                    <div class="news-list-footer">
                        <span>📍 ${escaparHTML(publication.location || "Echegaray")}</span>
                        <a href="detalle.html?publication=${encodeURIComponent(publication.id)}">Leer más →</a>
                    </div>
                </div>
            </article>
        `);
    });

    filtrarNoticias();

}


async function cargarEventosPublicados() {

    if (!eventsList) {
        return;
    }

    const publications = await cargarPublicacionesAprobadas(["evento"]);

    publications.forEach(publication => {

        const date = publication.event_date
            ? new Date(`${publication.event_date}T12:00:00`)
            : null;
        const day = date ? String(date.getDate()).padStart(2, "0") : "--";
        const month = date
            ? new Intl.DateTimeFormat("es-MX", { month: "short" })
                .format(date).replace(".", "").toUpperCase()
            : "PRÓX.";
        const time = publication.event_time ? ` · ⏰ ${publication.event_time}` : "";

        eventsList.insertAdjacentHTML("afterbegin", `
            <article class="event-card" data-category="comunidad">
                <div class="event-date"><span>${day}</span><strong>${month}</strong></div>
                <div class="event-info">
                    <span class="tag">Eventos</span>
                    <h3>${escaparHTML(publication.title)}</h3>
                    <p>${escaparHTML(publication.description)}</p>
                    <small>📍 ${escaparHTML(publication.location || "Echegaray")}${escaparHTML(time)}</small>
                    <a href="detalle.html?publication=${encodeURIComponent(publication.id)}">Ver detalles →</a>
                </div>
                <span class="event-arrow">→</span>
            </article>
        `);
    });

    filtrarEventos(searchInput ? searchInput.value : "");

}


async function cargarComunidadPublicada() {

    const grid = document.getElementById("communityPublications");

    if (!grid) {
        return;
    }

    const publications = await cargarPublicacionesAprobadas([
        "iniciativa", "compra-venta"
    ]);

    publications.forEach(publication => {

        const meta = datosPublicacion(publication);
        const image = publication.image_path
            ? `<img src="${escaparHTML(publication.image_path)}" alt="">`
            : `<span>${meta.icon}</span>`;

        grid.insertAdjacentHTML("afterbegin", `
            <article class="news-card">
                <div class="news-image placeholder">${image}</div>
                <div class="news-content">
                    <span class="tag">${escaparHTML(meta.label)}</span>
                    <h3>${escaparHTML(publication.title)}</h3>
                    <p>${escaparHTML(publication.description)}</p>
                    <a href="detalle.html?publication=${encodeURIComponent(publication.id)}">Ver publicación →</a>
                </div>
            </article>
        `);
    });

}


async function cargarDetallePublicado() {

    const publicationId = new URLSearchParams(window.location.search)
        .get("publication");

    if (!articleTitle || !publicationId || !backendEnabled) {
        return;
    }

    try {

        const response = await fetch(
            `/api/publications/public/${encodeURIComponent(publicationId)}`
        );

        if (!response.ok) {
            return;
        }

        const publication = await response.json();
        const meta = datosPublicacion(publication);
        const description = escaparHTML(publication.description).replaceAll("\n", "<br>");
        const image = publication.image_path
            ? `<img src="${escaparHTML(publication.image_path)}" alt="">`
            : `<span>${meta.icon}</span>`;

        articleCategory.textContent = meta.label;
        articleTitle.textContent = publication.title;
        articleDate.textContent = `📅 ${fechaPublicacion(publication, { dateStyle: "long" })}`;
        articleLocation.textContent = `📍 ${publication.location || "Echegaray"}`;
        articleImage.innerHTML = image;
        articleCaption.textContent = `Publicación compartida en Conecta Echegaray.`;
        articleBody.innerHTML = `
            <p class="article-lead">${description}</p>
            ${publication.event_time ? `<p><strong>Horario:</strong> ${escaparHTML(publication.event_time)}</p>` : ""}
            ${publication.contact ? `<div class="article-contact"><div class="article-contact-icon">ℹ️</div><div><strong>Contacto</strong><p>${escaparHTML(publication.contact)}</p></div></div>` : ""}
        `;
        document.title = `${publication.title} | Conecta Echegaray`;

    } catch (error) {

        // La ficha estática se conserva si la API no está disponible.

    }

}


cargarNoticiasPublicadas();
cargarEventosPublicados();
cargarComunidadPublicada();
cargarDetallePublicado();


/* ==================================================
   9. INICIALIZAR FILTROS
================================================== */

filtrarNoticias();
