import { ScriptLine } from '../../components/solutions/sections/ScriptSection';

export const activationScripts: ScriptLine[][] = [
  [
    { text: "Gracias por contarnos la situación. Entiendo lo importante que es tener tu servicio activo a tiempo.", type: "empathy" },
    { text: "Permíteme validar en RR el estado de tu instalación/activación y detectar qué está retrasando el proceso.", type: "action" },
    { text: "Según lo que veo, puedo confirmar agenda o ajustar la visita para acelerar el proceso sin pasos adicionales para ti.", type: "solution" },
    { text: "Dejaré la marcación con el detalle y te compartiré el compromiso de seguimiento para que tengas total claridad.", type: "closing" }
  ],
  [
    { text: "Lamento la demora; me encargo de revisarlo personalmente y darte una ruta clara hoy mismo.", type: "empathy" },
    { text: "Voy a consultar la orden/OT y la disponibilidad de agenda para confirmar el siguiente paso.", type: "action" },
    { text: "Puedo coordinar una reprogramación prioritaria o ver si aplica verificación técnica para agilizar la activación.", type: "solution" },
    { text: "Registraré la marcación con lo acordado y te indicaré el número de seguimiento o visita en agenda.", type: "closing" }
  ],
  [
    { text: "Entiendo tu preocupación. Quiero ayudarte a que el servicio quede activo cuanto antes.", type: "empathy" },
    { text: "Validaré en sistema si hubo intento de visita, novedad o verificación pendiente.", type: "action" },
    { text: "Si corresponde, confirmo nuevamente la activación y te comparto el rango horario disponible.", type: "solution" },
    { text: "Dejo la marcación con los detalles y te indico el paso a seguir para que tengas visibilidad.", type: "closing" }
  ]
];

export const activationActions = [
  { id: "a1", title: "Validar titularidad", detail: "Confirma cédula y nombre completo en RR. Opcional: dirección del servicio.", required: true },
  { id: "a2", title: "Revisar OT/orden", detail: "Consulta si existe orden creada, novedad, intento de visita o agenda pendiente.", required: true },
  { id: "a3", title: "Confirmar agenda", detail: "Si no hay agenda activa, ofrece rango disponible y confirma con el cliente.", required: true },
  { id: "a4", title: "Registrar marcación", detail: "Resumen: causa del retraso, acción tomada y compromiso informado." },
  { id: "a5", title: "Compartir compromiso", detail: "Informar fecha/rango estimado y canal de verificación (Mi Claro/SMS)." }
];

export const activationFaqs = [
  { q: "¿Por qué se demora la activación?", a: "Puede deberse a agenda técnica, novedad de red, verificación pendiente o visita no exitosa. Se valida y se coordina el siguiente paso." },
  { q: "¿Puedo cambiar el horario de la visita?", a: "Sí, según disponibilidad. Podemos reprogramar y confirmarte en esta llamada." },
  { q: "¿Cómo confirmo que quedó programado?", a: "Te confirmo en línea y puedes verificar por SMS o en Mi Claro." },
  { q: "¿Tiene costo adicional?", a: "No se generan cobros por coordinar o reprogramar la activación. Si aplica algún ajuste por afectación, se gestiona según políticas internas." }
];
