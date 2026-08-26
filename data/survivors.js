const survivors = [
    { 
        name: "ACE VISCONTI", 
        hint: "Un apostador con mucha suerte que, tras acumular deudas peligrosas en Argentina, confió en que la niebla sería su vía de escape.", 
        image: "img/survivors/ace.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Masculino",
        origin: "Argentino"
    },
    { 
        name: "ADA WONG", 
        hint: "Una espía corporativa experta que, mientras escapaba de la destrucción en Raccoon City, fue envuelta por una misteriosa niebla negra.", 
        image: "img/survivors/ada.png",
        speed: "4.0 m/s",
        year: "2022",
        gender: "Femenino",
        origin: "China/Estadounidense"
    },
    { 
        name: "ADAM FRANCIS", 
        hint: "Un profesor jamaicano que vivía en Japón. Fue tragado por el Ente tras sacrificarse para proteger a una estudiante en un accidente de tren.", 
        image: "img/survivors/adam.png",
        speed: "4.0 m/s",
        year: "2018",
        gender: "Masculino",
        origin: "Jamaicano"
    },
    { 
        name: "ALAN WAKE", 
        hint: "Un escritor atrapado en el Lugar Oscuro. El Ente lo sacó de su interminable bucle de pesadillas para llevarlo a un nuevo infierno.", 
        image: "img/survivors/alan.png",
        speed: "4.0 m/s",
        year: "2024",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "ASH WILLIAMS", 
        hint: "Tras luchar contra los demonios del Necronomicón en una cabaña, un portal lo arrastró directamente hacia el Reino del Ente.", 
        image: "img/survivors/ash.png",
        speed: "4.0 m/s",
        year: "2019",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "BILL OVERBECK", 
        hint: "Un veterano de guerra que se sacrificó por su equipo durante el apocalipsis zombi, despertando en la fogata en lugar de morir.", 
        image: "img/survivors/bill.png",
        speed: "4.0 m/s",
        year: "2017",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "CHERYL MASON", 
        hint: "Una joven con conexiones a fuerzas oscuras que, tras sobrevivir a los horrores de Silent Hill, fue reclamada por el Ente.", 
        image: "img/survivors/cheryl.png",
        speed: "4.0 m/s",
        year: "2020",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "CLAUDETTE MOREL", 
        hint: "Una botánica introvertida que se perdió en el bosque durante un paseo recolectando plantas y nunca encontró el camino a casa.", 
        image: "img/survivors/claudette.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Femenino",
        origin: "Canadiense"
    },
    { 
        name: "DAVID KING", 
        hint: "Un ex-luchador rudo de Manchester que, tras una violenta pelea de bar que se salió de control, desapareció sin dejar rastro.", 
        image: "img/survivors/david.png",
        speed: "4.0 m/s",
        year: "2017",
        gender: "Masculino",
        origin: "Británico"
    },
    { 
        name: "DUSTIN HENDERSON", 
        hint: "Un chico de Hawkins con una mente brillante y una gorra icónica, arrastrado a la niebla por su conexión con el Mundo del Revés.", 
        image: "img/survivors/dustin.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "DWIGHT FAIRFIELD", 
        hint: "Un líder nervioso que fue abandonado por sus abusivos compañeros de trabajo en lo profundo del bosque durante un ejercicio de integración.", 
        image: "img/survivors/dwight.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "ELLEN RIPLEY", 
        hint: "Una teniente espacial curtida en supervivencia que fue arrebatada por el Ente desde las frías y oscuras profundidades del espacio.", 
        image: "img/survivors/ellen.png",
        speed: "4.0 m/s",
        year: "2023",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "ÉLODIE RAKOTO", 
        hint: "Una investigadora que viajó a la Isla Dyer buscando la verdad sobre la desaparición de sus padres y fue absorbida por el ocultismo.", 
        image: "img/survivors/elodie.png",
        speed: "4.0 m/s",
        year: "2020",
        gender: "Femenino",
        origin: "Francesa"
    },
    { 
        name: "FELIX RICHTER", 
        hint: "Un exitoso arquitecto que desapareció en la misma niebla oscura que años atrás se había llevado a su padre en la Isla Dyer.", 
        image: "img/survivors/felix.png",
        speed: "4.0 m/s",
        year: "2020",
        gender: "Masculino",
        origin: "Alemán"
    },
    { 
        name: "FENG MIN", 
        hint: "Una jugadora de e-sports profesional que, abrumada por la presión y el fracaso, bebió hasta quedarse dormida y despertó en la niebla.", 
        image: "img/survivors/feng.png",
        speed: "4.0 m/s",
        year: "2017",
        gender: "Femenino",
        origin: "China"
    },
    { 
        name: "GABRIEL SOMA", 
        hint: "Un ingeniero espacial clonado. Fue el único sobreviviente de una misión fallida antes de que la Singularidad y el Ente lo alcanzaran.", 
        image: "img/survivors/gabriel.png",
        speed: "4.0 m/s",
        year: "2023",
        gender: "Masculino",
        origin: "Desconocido"
    },
    { 
        name: "HADDIE KAUR", 
        hint: "Una podcaster paranormal con la habilidad de ver 'Cicatrices' entre mundos. Investigó demasiado cerca y cayó en el Reino del Ente.", 
        image: "img/survivors/haddie.png",
        speed: "4.0 m/s",
        year: "2022",
        gender: "Femenino",
        origin: "India"
    },
    { 
        name: "JAKE PARK", 
        hint: "Heredero de una fortuna que huyó de la presión familiar para vivir en la naturaleza, donde la niebla lo consumió lentamente.", 
        image: "img/survivors/jake.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "JANE ROMERO", 
        hint: "Una famosa presentadora de televisión que, exhausta tras un largo día de trabajo, estrelló su auto en un río y despertó junto a la fogata.", 
        image: "img/survivors/jane.png",
        speed: "4.0 m/s",
        year: "2019",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "JEFF JOHANSEN", 
        hint: "Un artista de heavy metal con un corazón de oro. Tomó un viaje por carretera hacia su ciudad natal, Ormond, y nunca llegó a su destino.", 
        image: "img/survivors/jeff.png",
        speed: "4.0 m/s",
        year: "2018",
        gender: "Masculino",
        origin: "Canadiense"
    },
    { 
        name: "JILL VALENTINE", 
        hint: "Una agente experta de S.T.A.R.S. que fue secuestrada por la niebla negra justo cuando intentaba escapar de un arma biológica imparable.", 
        image: "img/survivors/jill.png",
        speed: "4.0 m/s",
        year: "2021",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "JONAH VASQUEZ", 
        hint: "Un matemático de la CIA que rastreó un misterioso patrón numérico hasta un cementerio en Chile, donde una bandada de cuervos lo rodeó.", 
        image: "img/survivors/jonah.png",
        speed: "4.0 m/s",
        year: "2021",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "KATE DENSON", 
        hint: "Una cantante de folk que, mientras buscaba inspiración en el bosque, fue arrastrada a un agujero oscuro por tentáculos de niebla.", 
        image: "img/survivors/kate.png",
        speed: "4.0 m/s",
        year: "2018",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "KWON", 
        hint: "Un superviviente metódico que desapareció en las sombras mientras buscaba respuestas a un misterio que consumió a su familia.", 
        image: "img/survivors/kwon.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Masculino",
        origin: "Coreano"
    },
    { 
        name: "LARA CROFT", 
        hint: "Una legendaria saqueadora de tumbas que, tras quedar atrapada en el derrumbe de unas antiguas ruinas, fue reclamada por la oscuridad.", 
        image: "img/survivors/lara.png",
        speed: "4.0 m/s",
        year: "2024",
        gender: "Femenino",
        origin: "Británica"
    },
    { 
        name: "LAURIE STRODE", 
        hint: "La chica final original. Mientras luchaba por su vida contra la maldad encarnada en la noche de Halloween, la niebla los tragó a ambos.", 
        image: "img/survivors/laurie.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "YUN JIN LEE", 
        hint: "Una productora musical egocéntrica. El Ente se la llevó tras presenciar cómo el idol que ella misma creó masacraba a la junta directiva.", 
        image: "img/survivors/lee.png",
        speed: "4.0 m/s",
        year: "2021",
        gender: "Femenino",
        origin: "Coreana"
    },
    { 
        name: "LEON KENNEDY", 
        hint: "Un policía novato que sobrevivió al infierno en su primer día en Raccoon City, solo para ser trasladado a un infierno aún peor.", 
        image: "img/survivors/leon.png",
        speed: "4.0 m/s",
        year: "2021",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "MEG THOMAS", 
        hint: "Una atleta llena de energía que cuidaba a su madre enferma. Salió a correr al bosque para despejar su mente y nunca regresó.", 
        image: "img/survivors/meg.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "MICHONNE", 
        hint: "Una guerrera letal que, tras sobrevivir incontables días en el apocalipsis zombi, caminó directo hacia una espesa y antinatural niebla.", 
        image: "img/survivors/michonne.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "MIKAELA REID", 
        hint: "Una bruja moderna que desapareció sin dejar rastro en medio de su cafetería tras leer una historia de terror en la noche de Halloween.", 
        image: "img/survivors/mikaela.png",
        speed: "4.0 m/s",
        year: "2021",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "NANCY WHEELER", 
        hint: "Una aspirante a periodista que, al adentrarse en los misterios del Laboratorio Nacional de Hawkins, fue arrastrada a este oscuro reino.", 
        image: "img/survivors/nancy.png",
        speed: "4.0 m/s",
        year: "2019",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "NEA KARLSSON", 
        hint: "Una grafitera rebelde y solitaria que decidió patinar en el asilo abandonado de Crotus Prenn y se desvaneció en la oscuridad.", 
        image: "img/survivors/nea.png",
        speed: "4.0 m/s",
        year: "2016",
        gender: "Femenino",
        origin: "Sueca"
    },
    { 
        name: "NICOLAS CAGE", 
        hint: "Un legendario actor que pronunció unas líneas de un guion maldito con demasiada convicción, invocando a la Entidad en pleno set de grabación.", 
        image: "img/survivors/nicolas.png",
        speed: "4.0 m/s",
        year: "2023",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "ONCE", 
        hint: "Una joven con habilidades telequinéticas. Su poderosa conexión psíquica con el Mundo del Revés atrajo la mirada hambrienta de la Entidad.", 
        image: "img/survivors/once.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "ORELA", 
        hint: "Desapareció en las sombras mientras intentaba huir desesperadamente de una misteriosa secta, despertando aterrada junto a la fogata.", 
        image: "img/survivors/orela.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Femenino",
        origin: "Desconocido"
    },
    { 
        name: "LA COMPANIA", 
        hint: "Un grupo de bardos aventureros que, durante una de sus misiones en tierras de fantasía, fueron transportados por una niebla mágica directamente al Reino del Ente.", 
        image: "img/survivors/compañia.png",
        speed: "4.0 m/s",
        year: "2024",
        gender: "Mixto",
        origin: "Desconocido"
    },
    { 
        name: "QUENTIN SMITH", 
        hint: "Un joven atrapado en el Mundo de los Sueños. Cuando creyó que no podía despertar de su pesadilla, el Ente lo reclamó.", 
        image: "img/survivors/quentin.png",
        speed: "4.0 m/s",
        year: "2017",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "REBECCA CHAMBERS", 
        hint: "Una médica prodigio de S.T.A.R.S. que sobrevivió a los horrores de las montañas Arklay, pero no pudo escapar de las garras de la niebla.", 
        image: "img/survivors/rebecca.png",
        speed: "4.0 m/s",
        year: "2022",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "RENATO LYRA", 
        hint: "Un chico brasileño que, junto a su hermana, fue atacado por un macabro dron cibernético en la playa antes de que la niebla los engullera.", 
        image: "img/survivors/renato.png",
        speed: "4.0 m/s",
        year: "2023",
        gender: "Masculino",
        origin: "Brasileño"
    },
    { 
        name: "RICK GRIMES", 
        hint: "Un líder implacable que despertó en un mundo desolado. Guiando a su grupo en busca de un refugio, fue devorado por una extraña tormenta.", 
        image: "img/survivors/rick.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "SABLE WARD", 
        hint: "Una chica interesada en el ocultismo. Caminó voluntariamente hacia la niebla en el sótano de un cine para buscar a su mejor amiga perdida.", 
        image: "img/survivors/sable.png",
        speed: "4.0 m/s",
        year: "2024",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "STEVE HARRINGTON", 
        hint: "Un ex-chico popular convertido en niñero valiente. Fue absorbido por la niebla mientras protegía a sus amigos de fuerzas interdimensionales.", 
        image: "img/survivors/steve.png",
        speed: "4.0 m/s",
        year: "2019",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "DAVID TAPP", 
        hint: "Un detective obsesionado. Justo cuando se desangraba en el suelo tras recibir un disparo investigando a Jigsaw, la Entidad se lo llevó.", 
        image: "img/survivors/tapp.png",
        speed: "4.0 m/s",
        year: "2018",
        gender: "Masculino",
        origin: "Estadounidense"
    },
    { 
        name: "TAURIE", 
        hint: "Atrapada por la niebla negra y arrastrada hacia la fogata tras perderse irremediablemente en un denso bosque durante una tormenta.", 
        image: "img/survivors/taurie.png",
        speed: "4.0 m/s",
        year: "2024",
        gender: "Femenino",
        origin: "Desconocido"
    },
    { 
        name: "THALITA LYRA", 
        hint: "Una fabricante de cometas brasileña que desapareció de las cálidas arenas de su hogar tras enfrentarse a una letal máquina de matar.", 
        image: "img/survivors/thalita.png",
        speed: "4.0 m/s",
        year: "2023",
        gender: "Femenino",
        origin: "Brasileña"
    },
    { 
        name: "TREVOR BELMONT", 
        hint: "Un cazador implacable. Mientras erradicaba las fuerzas de la noche, la niebla lo reclamó junto con el mismísimo Señor Oscuro.", 
        image: "img/survivors/trevor.png",
        speed: "4.0 m/s",
        year: "2024",
        gender: "Masculino",
        origin: "Europeo"
    },
    { 
        name: "VEE", 
        hint: "Una viajera solitaria cuya caravana fue envuelta repentinamente por una gélida y sobrenatural niebla negra a mitad de la carretera.", 
        image: "img/survivors/vee.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Femenino",
        origin: "Desconocido"
    },
    { 
        name: "VITTORIO TOSCANO", 
        hint: "Un erudito medieval traicionado por su caballero protector. Ha vagado por los rincones del Reino del Ente durante siglos.", 
        image: "img/survivors/vittorio.png",
        speed: "4.0 m/s",
        year: "2022",
        gender: "Masculino",
        origin: "Italiano"
    },
    { 
        name: "YOICHI ASAKAWA", 
        hint: "Un biólogo marino marcado por una maldición familiar. Viajó en barco buscando curar su pasado y terminó navegando directo a la oscuridad.", 
        image: "img/survivors/yoichi.png",
        speed: "4.0 m/s",
        year: "2022",
        gender: "Masculino",
        origin: "Japonés"
    },
    { 
        name: "YUI KIMURA", 
        hint: "Una valiente corredora de motos callejeras. En medio de una carrera ilegal en las montañas de Japón, atravesó un denso y espectral humo.", 
        image: "img/survivors/yui.png",
        speed: "4.0 m/s",
        year: "2019",
        gender: "Femenino",
        origin: "Japonesa"
    },
    { 
        name: "ZARINA KASSIR", 
        hint: "Una cineasta independiente audaz. Investigando una masacre en la Penitenciaría de Hellshire, quedó atrapada tras los muros de la prisión eterna.", 
        image: "img/survivors/zarina.png",
        speed: "4.0 m/s",
        year: "2020",
        gender: "Femenino",
        origin: "Estadounidense"
    },
    { 
        name: "SHANE", 
        hint: "Un superviviente profundamente conectado con sus raíces que confía en sus instintos y su gran valentía para guiar a otros a través de la niebla.", 
        image: "img/survivors/shane.png",
        speed: "4.0 m/s",
        year: "2026",
        gender: "Masculino",
        origin: "Norteamericano"
    },
    {
        name: "Aurora Stardotter",
        gender: "Femenino",
        speed: "4.0 m/s",
        year: "2026",
        image: "img/survivors/aurora.png",
        hint: "Es vista como una salvadora para su pueblo y obtiene visión del futuro leyendo las estrellas."
    }
];

module.exports = survivors;