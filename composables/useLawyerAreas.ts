import { computed } from 'vue'

export interface LegalArea {
  id: string
  name: string
  slug: string
  category: LegalCategory
  description?: string
}

export type LegalCategory =
  | 'civil'
  | 'family'
  | 'labor'
  | 'criminal'
  | 'commercial'
  | 'consumer'
  | 'tax'
  | 'administrative'
  | 'international'
  | 'environmental'
  | 'humanRights'
  | 'other'

export const useLawyerAreas = () => {
  const areas: LegalArea[] = [
    // Civil Law
    {
      id: 'contratos',
      name: 'Contratos',
      slug: 'contratos',
      category: 'civil',
      description: 'Asesoría y litigios en materia de contratos civiles'
    },
    {
      id: 'sucesiones',
      name: 'Sucesiones',
      slug: 'sucesiones',
      category: 'civil',
      description: 'Herencias y derecho sucesorio'
    },
    {
      id: 'testamentos',
      name: 'Testamentos',
      slug: 'testamentos',
      category: 'civil',
      description: 'Preparación y disputas de testamentos'
    },
    {
      id: 'propiedad',
      name: 'Propiedad',
      slug: 'propiedad',
      category: 'civil',
      description: 'Derechos de propiedad y bienes raíces'
    },
    {
      id: 'compra-arriendo-propiedades',
      name: 'Compra y Arriendo de Propiedades',
      slug: 'compra-arriendo-propiedades',
      category: 'civil'
    },
    {
      id: 'estudios-titulos',
      name: 'Estudios de Títulos',
      slug: 'estudios-titulos',
      category: 'civil'
    },
    {
      id: 'pago-honorarios',
      name: 'Pago de Honorarios',
      slug: 'pago-honorarios',
      category: 'civil'
    },
    {
      id: 'inmigracion-civil',
      name: 'Inmigración',
      slug: 'inmigracion-civil',
      category: 'civil'
    },
    {
      id: 'deudas-embargos',
      name: 'Deudas y Embargos',
      slug: 'deudas-embargos',
      category: 'civil'
    },
    {
      id: 'recurso-isapres',
      name: 'Recurso de protección contra alza en Isapres',
      slug: 'recurso-isapres',
      category: 'civil'
    },
    {
      id: 'mascotas',
      name: 'Mascotas',
      slug: 'mascotas',
      category: 'civil'
    },
    {
      id: 'problemas-vecinos',
      name: 'Problemas entre vecinos',
      slug: 'problemas-vecinos',
      category: 'civil'
    },
    {
      id: 'negligencia-medica',
      name: 'Negligencia médica',
      slug: 'negligencia-medica',
      category: 'civil'
    },

    // Family Law
    {
      id: 'violencia-intrafamiliar',
      name: 'Violencia Intrafamiliar',
      slug: 'violencia-intrafamiliar',
      category: 'family'
    },
    {
      id: 'adopciones',
      name: 'Adopciones',
      slug: 'adopciones',
      category: 'family'
    },
    {
      id: 'juicio-paternidad',
      name: 'Juicio o reconocimiento de Paternidad',
      slug: 'juicio-paternidad',
      category: 'family'
    },
    {
      id: 'tuicion',
      name: 'Tuición',
      slug: 'tuicion',
      category: 'family'
    },
    {
      id: 'regimen-visitas',
      name: 'Régimen de Visitas',
      slug: 'regimen-visitas',
      category: 'family'
    },
    {
      id: 'pension-alimenticia',
      name: 'Pensión Alimenticia',
      slug: 'pension-alimenticia',
      category: 'family'
    },
    {
      id: 'divorcio',
      name: 'Divorcio',
      slug: 'divorcio',
      category: 'family'
    },
    {
      id: 'cambio-nombre',
      name: 'Cambio de Nombre',
      slug: 'cambio-nombre',
      category: 'family'
    },
    {
      id: 'declaracion-interdiccion',
      name: 'Declaración de Interdicción',
      slug: 'declaracion-interdiccion',
      category: 'family'
    },

    // Labor Law
    {
      id: 'accidentes-laborales',
      name: 'Accidentes Laborales',
      slug: 'accidentes-laborales',
      category: 'labor'
    },
    {
      id: 'negociacion-colectiva',
      name: 'Negociación Colectiva',
      slug: 'negociacion-colectiva',
      category: 'labor'
    },
    {
      id: 'asesoria-sindicatos',
      name: 'Constitución y Asesoría de Sindicatos',
      slug: 'asesoria-sindicatos',
      category: 'labor'
    },
    {
      id: 'despido-injustificado',
      name: 'Despido Injustificado',
      slug: 'despido-injustificado',
      category: 'labor'
    },
    {
      id: 'acoso-sexual',
      name: 'Acoso Sexual',
      slug: 'acoso-sexual',
      category: 'labor'
    },
    {
      id: 'derechos-laborales',
      name: 'Defensa de Derechos Laborales',
      slug: 'derechos-laborales',
      category: 'labor'
    },
    {
      id: 'autodespido',
      name: 'Autodespido',
      slug: 'autodespido',
      category: 'labor'
    },
    {
      id: 'licencia-medica',
      name: 'Licencia médica',
      slug: 'licencia-medica',
      category: 'labor'
    },

    // Criminal Law
    {
      id: 'delitos-informaticos',
      name: 'Delitos Informáticos',
      slug: 'delitos-informaticos',
      category: 'criminal'
    },
    {
      id: 'robos-hurtos',
      name: 'Robos y Hurtos',
      slug: 'robos-hurtos',
      category: 'criminal'
    },
    {
      id: 'abuso-sexual',
      name: 'Abuso Sexual y Violación',
      slug: 'abuso-sexual',
      category: 'criminal'
    },
    {
      id: 'homicidios',
      name: 'Homicidios',
      slug: 'homicidios',
      category: 'criminal'
    },
    {
      id: 'estafas',
      name: 'Estafas y Delitos económicos',
      slug: 'estafas',
      category: 'criminal'
    },
    {
      id: 'trafico-drogas',
      name: 'Tráfico de Drogas',
      slug: 'trafico-drogas',
      category: 'criminal'
    },
    {
      id: 'discriminacion-delitos',
      name: 'Discriminación y Delitos de odio',
      slug: 'discriminacion-delitos',
      category: 'criminal'
    },
    {
      id: 'accidentes-transito',
      name: 'Accidentes de Tránsito',
      slug: 'accidentes-transito',
      category: 'criminal'
    },
    {
      id: 'agresiones',
      name: 'Agresiones y Riñas',
      slug: 'agresiones',
      category: 'criminal'
    },
    {
      id: 'manejo-ebriedad',
      name: 'Manejo en estado de ebriedad',
      slug: 'manejo-ebriedad',
      category: 'criminal'
    },
    {
      id: 'amenazas',
      name: 'Amenazas y extorsiones',
      slug: 'amenazas',
      category: 'criminal'
    },
    {
      id: 'injurias-calumnias',
      name: 'Injurias y Calumnias',
      slug: 'injurias-calumnias',
      category: 'criminal'
    },

    // Tax Law
    {
      id: 'asesoria-tributaria',
      name: 'Asesoría tributaria',
      slug: 'asesoria-tributaria',
      category: 'tax'
    },
    {
      id: 'defensa-tributaria',
      name: 'Defensa tributaria',
      slug: 'defensa-tributaria',
      category: 'tax'
    },
    {
      id: 'reorganizacion-empresarial',
      name: 'Reorganización empresarial',
      slug: 'reorganizacion-empresarial',
      category: 'tax'
    },
    {
      id: 'planificacion-tributaria',
      name: 'Planificación Tributaria',
      slug: 'planificacion-tributaria',
      category: 'tax'
    },
    {
      id: 'litigios-tributarios',
      name: 'Litigios Tributarios',
      slug: 'litigios-tributarios',
      category: 'tax'
    },

    // Commercial Law
    {
      id: 'constitucion-empresas',
      name: 'Constitución de empresas',
      slug: 'constitucion-empresas',
      category: 'commercial'
    },
    {
      id: 'contratos-comerciales',
      name: 'Contratos comerciales',
      slug: 'contratos-comerciales',
      category: 'commercial'
    },
    {
      id: 'propiedad-intelectual',
      name: 'Propiedad intelectual e industrial',
      slug: 'propiedad-intelectual',
      category: 'commercial'
    },
    {
      id: 'litigios-comerciales',
      name: 'Litigios comerciales',
      slug: 'litigios-comerciales',
      category: 'commercial'
    },
    {
      id: 'mercado-capitales',
      name: 'Mercado de Capitales',
      slug: 'mercado-capitales',
      category: 'commercial'
    },
    {
      id: 'insolvencia-quiebras',
      name: 'Insolvencia y Quiebras',
      slug: 'insolvencia-quiebras',
      category: 'commercial'
    },
    {
      id: 'litigio-arbitrajes',
      name: 'Litigio y Arbitrajes',
      slug: 'litigio-arbitrajes',
      category: 'commercial'
    },
    {
      id: 'inversion-extranjera',
      name: 'Inversión Extranjera',
      slug: 'inversion-extranjera',
      category: 'commercial'
    },
    {
      id: 'recursos-naturales',
      name: 'Recursos Naturales y Medioambientales',
      slug: 'recursos-naturales',
      category: 'commercial'
    },
    {
      id: 'derecho-aduanero-comercial',
      name: 'Importaciones, exportaciones y derecho aduanero',
      slug: 'derecho-aduanero-comercial',
      category: 'commercial'
    },

    // Consumer Protection
    {
      id: 'telecomunicaciones',
      name: 'Telecomunicaciones',
      slug: 'telecomunicaciones',
      category: 'consumer'
    },
    {
      id: 'retail',
      name: 'Tiendas comerciales y retail',
      slug: 'retail',
      category: 'consumer'
    },
    {
      id: 'servicios-financieros',
      name: 'Bancos, AFPs y empresa financieras',
      slug: 'servicios-financieros',
      category: 'consumer'
    },
    {
      id: 'transporte',
      name: 'Transporte',
      slug: 'transporte',
      category: 'consumer'
    },
    {
      id: 'servicios-basicos',
      name: 'Servicios básicos',
      slug: 'servicios-basicos',
      category: 'consumer',
      description: 'Agua, luz, electricidad, etc.'
    },
    {
      id: 'aseguradoras',
      name: 'Aseguradoras',
      slug: 'aseguradoras',
      category: 'consumer'
    },
    {
      id: 'comercio-electronico',
      name: 'Comercio electrónico',
      slug: 'comercio-electronico',
      category: 'consumer'
    },
    {
      id: 'educacion',
      name: 'Educación',
      slug: 'educacion',
      category: 'consumer'
    },
    {
      id: 'automoviles',
      name: 'Automóviles e Indumotoras',
      slug: 'automoviles',
      category: 'consumer'
    },
    {
      id: 'inmobiliarias',
      name: 'Inmobiliarias y constructoras',
      slug: 'inmobiliarias',
      category: 'consumer'
    },
    {
      id: 'salud',
      name: 'Salud',
      slug: 'salud',
      category: 'consumer',
      description: 'Hospitales, clínicas, etc.'
    },
    {
      id: 'entretencion',
      name: 'Entretención y turismo',
      slug: 'entretencion',
      category: 'consumer'
    },

    // Human Rights
    {
      id: 'violacion-ddhh-estado',
      name: 'Violación a los Derechos humanos por parte del Estado',
      slug: 'violacion-ddhh-estado',
      category: 'humanRights'
    },
    {
      id: 'otros-ddhh',
      name: 'Otros casos de violación a los Derechos humanos',
      slug: 'otros-ddhh',
      category: 'humanRights'
    },

    // Administrative Law
    {
      id: 'procedimientos-administrativos',
      name: 'Procedimientos administrativos',
      slug: 'procedimientos-administrativos',
      category: 'administrative'
    },
    {
      id: 'contratos-estado',
      name: 'Contratos con el Estado',
      slug: 'contratos-estado',
      category: 'administrative'
    },
    {
      id: 'permisos-licencias',
      name: 'Permisos y licencias',
      slug: 'permisos-licencias',
      category: 'administrative'
    },
    {
      id: 'responsabilidad-estado',
      name: 'Responsabilidad del Estado',
      slug: 'responsabilidad-estado',
      category: 'administrative'
    },

    // International Law
    {
      id: 'comercio-internacional',
      name: 'Comercio internacional',
      slug: 'comercio-internacional',
      category: 'international'
    },
    {
      id: 'derechos-humanos-internacional',
      name: 'Derechos humanos',
      slug: 'derechos-humanos-internacional',
      category: 'international'
    },
    {
      id: 'arbitraje-internacional',
      name: 'Arbitraje internacional',
      slug: 'arbitraje-internacional',
      category: 'international'
    },

    // Environmental Law
    {
      id: 'evaluacion-impacto-ambiental',
      name: 'Evaluación de impacto ambiental',
      slug: 'evaluacion-impacto-ambiental',
      category: 'environmental'
    },
    {
      id: 'litigios-ambientales',
      name: 'Litigios ambientales',
      slug: 'litigios-ambientales',
      category: 'environmental'
    },
    {
      id: 'regulacion-ambiental',
      name: 'Regulación ambiental',
      slug: 'regulacion-ambiental',
      category: 'environmental'
    },

    // Other Areas
    {
      id: 'franquicias',
      name: 'Abogados franquicias',
      slug: 'franquicias',
      category: 'other'
    },
    {
      id: 'inmigracion',
      name: 'Abogados inmigración',
      slug: 'inmigracion',
      category: 'other'
    },
    {
      id: 'quiebras',
      name: 'Abogados quiebras',
      slug: 'quiebras',
      category: 'other'
    },
    {
      id: 'telecomunicaciones-otros',
      name: 'Abogados telecomunicaciones',
      slug: 'telecomunicaciones-otros',
      category: 'other'
    },
    {
      id: 'auditoria',
      name: 'Auditoría',
      slug: 'auditoria',
      category: 'other'
    },
    {
      id: 'derecho-informatico',
      name: 'Derecho informático',
      slug: 'derecho-informatico',
      category: 'other'
    },
    {
      id: 'derecho-publicidad',
      name: 'Derecho publicidad',
      slug: 'derecho-publicidad',
      category: 'other'
    },
    {
      id: 'derechos-agua',
      name: 'Derechos de agua',
      slug: 'derechos-agua',
      category: 'other'
    },
    {
      id: 'derechos-mujer',
      name: 'Derechos de la mujer',
      slug: 'derechos-mujer',
      category: 'other'
    },
    {
      id: 'derechos-ninos',
      name: 'Derechos de los niños',
      slug: 'derechos-ninos',
      category: 'other'
    },
    {
      id: 'discriminacion',
      name: 'Discriminación',
      slug: 'discriminacion',
      category: 'other'
    },
    {
      id: 'fuero-maternal',
      name: 'Fuero maternal',
      slug: 'fuero-maternal',
      category: 'other'
    },
    {
      id: 'ley-transparencia',
      name: 'Ley de transparencia',
      slug: 'ley-transparencia',
      category: 'other'
    },
    {
      id: 'multas',
      name: 'Multas',
      slug: 'multas',
      category: 'other'
    },
    {
      id: 'nacionalidad',
      name: 'Nacionalidad',
      slug: 'nacionalidad',
      category: 'other'
    },
    {
      id: 'participacion-ciudadana',
      name: 'Participación ciudadana',
      slug: 'participacion-ciudadana',
      category: 'other'
    },
    {
      id: 'prevaricacion',
      name: 'Prevaricación',
      slug: 'prevaricacion',
      category: 'other'
    },
    {
      id: 'proteccion-datos',
      name: 'Protección de datos',
      slug: 'proteccion-datos',
      category: 'other'
    },
    {
      id: 'pueblos-indigenas',
      name: 'Pueblos indígenas',
      slug: 'pueblos-indigenas',
      category: 'other'
    },
    {
      id: 'remates',
      name: 'Remates',
      slug: 'remates',
      category: 'other'
    },
    {
      id: 'seguro-cesantia',
      name: 'Seguro de cesantía',
      slug: 'seguro-cesantia',
      category: 'other'
    },
    {
      id: 'seguros',
      name: 'Seguros',
      slug: 'seguros',
      category: 'other'
    },
    {
      id: 'visas',
      name: 'Visas',
      slug: 'visas',
      category: 'other'
    }
  ]

  const categories = {
    civil: 'Civil',
    family: 'Familia',
    labor: 'Laboral',
    criminal: 'Penal',
    commercial: 'Comercial',
    consumer: 'Consumidor',
    tax: 'Tributario',
    administrative: 'Administrativo',
    international: 'Internacional',
    environmental: 'Ambiental',
    humanRights: 'Derechos Humanos',
    other: 'Otros'
  } as const

  const groupedAreas = computed(() => {
    return areas.reduce(
      (acc, area) => {
        if (!acc[area.category]) {
          acc[area.category] = []
        }
        acc[area.category].push(area)
        return acc
      },
      {} as Record<LegalCategory, LegalArea[]>
    )
  })

  return {
    areas,
    groupedAreas,
    categories
  }
}
