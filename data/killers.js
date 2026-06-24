const killers = [
    { 
        name: "EL TRAMPERO", 
        hint: "Su territorio está lleno de letales trampas para osos ocultas en la hierba.", 
        image: "img/trampero.png",
        speed: "4.6 m/s",
        year: "2016",
        gender: "Masculino"
    },
    { 
        name: "EL ESPECTRO", 
        hint: "Toca una campana ensangrentada para volverse invisible y acechar a sus víctimas.", 
        image: "img/espectro.png",
        speed: "4.6 m/s (Invisible: 6.0 m/s)",
        year: "2016",
        gender: "Masculino"
    },
    { 
        name: "EL PUEBLERINO", 
        hint: "Carga con una motosierra letal para correr a gran velocidad por el mapa.", 
        image: "img/pueblerino.png",
        speed: "4.6 m/s (Motosierra: 9.2 m/s)",
        year: "2016",
        gender: "Masculino"
    },
    { 
        name: "LA ENFERMERA", 
        hint: "Una figura fantasmal capaz de teletransportarse a través de paredes y obstáculos.", 
        image: "img/enfermera.png",
        speed: "3.85 m/s (Teletransporte)",
        year: "2016",
        gender: "Femenino"
    },
    { 
        name: "LA FORMA", 
        hint: "La maldad encarnada. Te observa en silencio para aumentar su poder antes de atacar.", 
        image: "img/forma.png",
        speed: "4.6 m/s (Nivel 1: 4.2 m/s)",
        year: "2016",
        gender: "Masculino"
    },
    { 
        name: "LA BRUJA", 
        hint: "Dibuja trampas de barro en el suelo a las que puede teletransportarse si las pisas.", 
        image: "img/bruja.png",
        speed: "4.4 m/s",
        year: "2016",
        gender: "Femenino"
    },
    { 
        name: "EL DOCTOR", 
        hint: "Usa terapia de choque eléctrico para hacer gritar a los supervivientes e inducirles locura.", 
        image: "img/doctor.png",
        speed: "4.6 m/s",
        year: "2017",
        gender: "Masculino"
    },
    { 
        name: "LA CAZADORA", 
        hint: "Tararea una escalofriante canción de cuna mientras arroja destrales a gran distancia.", 
        image: "img/cazadora.png",
        speed: "4.4 m/s",
        year: "2017",
        gender: "Femenino"
    },
    { 
        name: "EL CANIBAL", 
        hint: "Agita su motosierra en un frenesí letal capaz de derribar a múltiples víctimas a la vez.", 
        image: "img/canibal.png",
        speed: "4.6 m/s (Frenesí: 5.29 m/s)",
        year: "2017",
        gender: "Masculino"
    },
    { 
        name: "LA PESADILLA", 
        hint: "Te arrastra al Mundo de los Sueños, donde sus garras son letales y las paredes sangran.", 
        image: "img/pesadilla.png",
        speed: "4.6 m/s",
        year: "2017",
        gender: "Masculino"
    },
    { 
        name: "LA CERDA", 
        hint: "Te coloca trampas para osos invertidas en la cabeza que debes quitarte antes de que el temporizador acabe.", 
        image: "img/cerda.png",
        speed: "4.6 m/s (Agachada: 3.6 m/s)",
        year: "2018",
        gender: "Femenino"
    },
    { 
        name: "EL PAYASO", 
        hint: "Lanza botellas con tónicos tóxicos que nublan la visión y ralentizan a sus presas.", 
        image: "img/payaso.png",
        speed: "4.6 m/s",
        year: "2018",
        gender: "Masculino"
    },
    { 
        name: "EL ESPIRITU", 
        hint: "Abandona su cuerpo físico para moverse rápidamente sin ser vista, guiándose por el sonido.", 
        image: "img/espiritu.png",
        speed: "4.4 m/s (Faseo: 7.04 m/s)",
        year: "2018",
        gender: "Femenino"
    },
    { 
        name: "LA LEGION", 
        hint: "Un grupo de adolescentes frenéticos que corren rápido y apuñalan a varios en cadena.", 
        image: "img/legion.png",
        speed: "4.6 m/s (Frenesí: 5.2 m/s)",
        year: "2018",
        gender: "Mixto"
    },
    { 
        name: "LA PLAGA", 
        hint: "Una sacerdotisa babilónica que purga bilis infecciosa sobre los supervivientes y objetos.", 
        image: "img/plaga.png",
        speed: "4.6 m/s",
        year: "2019",
        gender: "Femenino"
    },
    { 
        name: "GHOST FACE", 
        hint: "Se asoma desde las esquinas y te acecha en silencio para exponerte con un solo golpe.", 
        image: "img/ghostface.png",
        speed: "4.6 m/s (Acecho: 3.6 m/s)",
        year: "2019",
        gender: "Masculino"
    },
    { 
        name: "EL DEMOGORGON", 
        hint: "Una bestia de otra dimensión que viaja por portales en el suelo y se abalanza con sus garras.", 
        image: "img/demogorgon.png",
        speed: "4.6 m/s",
        year: "2019",
        gender: "Sin género (Monstruo)"
    },
    { 
        name: "EL ONI", 
        hint: "Un demonio samurái que absorbe la sangre de sus víctimas para entrar en una furia imparable con su kanabo.", 
        image: "img/oni.png",
        speed: "4.6 m/s (Furia: 7.82 m/s)",
        year: "2019",
        gender: "Masculino"
    },
    { 
        name: "EL ARPONERO", 
        hint: "Usa un rifle modificado que dispara un arpón para arrastrar a los supervivientes hacia él.", 
        image: "img/arponero.png",
        speed: "4.4 m/s",
        year: "2020",
        gender: "Masculino"
    },
    { 
        name: "EL VERDUGO", 
        hint: "Arrastra su enorme espada por el suelo creando zanjas infernales y envía a sus víctimas a jaulas.", 
        image: "img/verdugo.png",
        speed: "4.6 m/s",
        year: "2020",
        gender: "Masculino"
    },
    { 
        name: "EL DETERIORO", 
        hint: "Un alquimista adicto al suero que rebota violentamente contra los muros para alcanzar gran velocidad.", 
        image: "img/deterioro.png",
        speed: "4.6 m/s (Embestida: 9.2 m/s)",
        year: "2020",
        gender: "Masculino"
    },
    { 
        name: "LOS GEMELOS", 
        hint: "Un dúo macabro donde puedes soltar a un pequeño deforme para que persiga y salte sobre los supervivientes.", 
        image: "img/gemelos.png",
        speed: "4.6 m/s (Victor: 6.0 m/s)",
        year: "2020",
        gender: "Mixto"
    },
    { 
        name: "EL EMBAUCADOR", 
        hint: "Un sádico ídolo del K-Pop que lanza una rápida ráfaga de cuchillos a sus presas.", 
        image: "img/embaucador.png",
        speed: "4.4 m/s",
        year: "2021",
        gender: "Masculino"
    },
    { 
        name: "EL NEMESIS", 
        hint: "Un arma biológica implacable que te ataca con un tentáculo y es ayudado por zombis en el mapa.", 
        image: "img/nemesis.png",
        speed: "4.6 m/s",
        year: "2021",
        gender: "Masculino"
    },
    { 
        name: "EL CENOBITA", 
        hint: "Invoca cadenas del infierno y protege un cubo rompecabezas (la Configuración del Lamento).", 
        image: "img/cenobita.png",
        speed: "4.6 m/s",
        year: "2021",
        gender: "Masculino"
    },
    { 
        name: "LA ARTISTA", 
        hint: "Lanza enjambres de cuervos de tinta negra a través de todo el mapa para dañar y revelar.", 
        image: "img/artista.png",
        speed: "4.6 m/s",
        year: "2021",
        gender: "Femenino"
    },
    { 
        name: "LA ONRYO", 
        hint: "Se proyecta a través de televisores estáticos y maldice a los supervivientes con cintas de video.", 
        image: "img/onryo.png",
        speed: "4.6 m/s",
        year: "2022",
        gender: "Femenino"
    },
    { 
        name: "LA DRAGA", 
        hint: "Una abominación de carne y sombras que se teletransporta entre los casilleros y sume el mapa en la oscuridad.", 
        image: "img/draga.png",
        speed: "4.6 m/s",
        year: "2022",
        gender: "Sin género (Abominación)"
    },
    { 
        name: "EL CEREBRO", 
        hint: "Un villano que usa el virus Uroboros para embestir a gran velocidad y lanzar a los supervivientes por los aires.", 
        image: "img/cerebro.png",
        speed: "4.6 m/s",
        year: "2022",
        gender: "Masculino"
    },
    { 
        name: "EL CABALLERO", 
        hint: "Invoca a sus guardias leales para que patrullen el mapa y persigan a sus presas por él.", 
        image: "img/caballero.png",
        speed: "4.6 m/s",
        year: "2022",
        gender: "Masculino"
    },
    { 
        name: "COMERCIANTE DE CALAVERAS", 
        hint: "Despliega drones aéreos que escanean zonas para detectar, exponer y rastrear a los supervivientes.", 
        image: "img/comerciante.png",
        speed: "4.6 m/s",
        year: "2023",
        gender: "Femenino"
    },
    { 
        name: "LA SINGULARIDAD", 
        hint: "Una IA corrupta que dispara biocápsulas a las paredes para observar y teletransportarse hacia ti.", 
        image: "img/singularidad.png",
        speed: "4.6 m/s",
        year: "2023",
        gender: "Sin género (IA)"
    },
    { 
        name: "EL XENOMORFO", 
        hint: "Un alienígena perfecto que viaja por túneles subterráneos y ataca letalmente con su cola.", 
        image: "img/xenomorfo.png",
        speed: "4.6 m/s (Gateando: 9.0 m/s)",
        year: "2023",
        gender: "Sin género (Alien)"
    },
    { 
        name: "EL CHICO BUENO", 
        hint: "Un muñeco poseído muy bajito que insulta mientras corre bajo la hierba para apuñalarte.", 
        image: "img/chico.png",
        speed: "4.4 m/s",
        year: "2023",
        gender: "Masculino"
    },
    { 
        name: "LO DESCONOCIDO", 
        hint: "Una criatura de terror urbano que lanza proyectiles venenosos que rebotan y crea alucinaciones de sí mismo.", 
        image: "img/desconocido.png",
        speed: "4.6 m/s",
        year: "2024",
        gender: "Desconocido"
    },
    { 
        name: "EL LICHE", 
        hint: "Un poderoso archimago que vuela, conjura entidades mágicas y fuerza a usar objetos mágicos.", 
        image: "img/liche.png",
        speed: "4.6 m/s",
        year: "2024",
        gender: "Masculino"
    },
    { 
        name: "EL SEÑOR OSCURO", 
        hint: "Puede transformarse en un murciélago o un lobo para cazarte, y lanza pilares de fuego infernal.", 
        image: "img/dracula.png",
        speed: "4.6 m/s (Murciélago: 6.0 m/s)",
        year: "2024",
        gender: "Masculino"
    },
    { 
        name: "LA ADIESTRADORA", 
        hint: "Va acompañada de su enorme y leal sabueso, el cual puede enviar a rastrear, perseguir y arrastrar a los supervivientes por el suelo.", 
        image: "img/adiestradora.png",
        speed: "4.6 m/s",
        year: "2024",
        gender: "Femenino"
    },
    { 
        name: "VECNA", 
        hint: "Una entidad del Mundo del Revés que atormenta a sus víctimas con sus traumas del pasado, anunciando su maldición con el sonido de un viejo reloj de péndulo.", 
        image: "img/vecna.png",
        speed: "4.6 m/s",
        year: "2022 (Serie de TV)",
        gender: "Masculino"
    },
    { 
        name: "JASON VOORHEES", 
        hint: "Un asesino implacable e inmortal que acecha los alrededores de Crystal Lake con una máscara de hockey, guiado por la voz incorpórea de su madre.", 
        image: "img/jason.png",
        speed: "4.6 m/s",
        year: "1980 (Cine)",
        gender: "Masculino"
    },
    { 
        name: "LA KRASUE", 
        hint: "Un espíritu maldito del sudeste asiático que se manifiesta como una cabeza flotante con sus vísceras colgando. Condenada por una traición, el Ente la arrastró a la niebla.", 
        image: "img/krasue.png",
        speed: "4.6 m/s (Flotando)",
        year: "Folclore Tradicional",
        gender: "Femenino"
    },
    { 
        name: "KANEKI", 
        hint: "Un joven convertido en híbrido de ghoul tras un trágico trasplante. Consumido por la locura, desató su letal Kagune de ciempiés justo antes de ser reclamado.", 
        image: "img/kaneki.png",
        speed: "4.6 m/s (Kagune: 5.2 m/s)",
        year: "2011 (Manga)",
        gender: "Masculino"
    }
];

module.exports = killers;