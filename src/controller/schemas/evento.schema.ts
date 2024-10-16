import Joi from "joi";

const addInvitadoToEventoSchema = Joi.object({
  eventoId: Joi.number().required(),
  grupoId: Joi.number().required(),
  unidadNegocioId: Joi.number().required(),
  filialId: Joi.number().required(),
  nombre: Joi.string().required(),
  edad: Joi.number().required(),
  tipoInvitado: Joi.string().valid("Colaborador", "Externo").required(),
  fechaIngreso: Joi.date().allow(null),
  requiereTransporte: Joi.bool().required(),
  origen: Joi.string().allow(null, ""),
  destino: Joi.string().allow(null, ""),
  comentarios: Joi.string().allow(null, ""),
  relacionarConOtroEvento: Joi.bool(),
  eventoRelacionadoId: Joi.number().allow(null),
  fechaEstanciaInicio: Joi.date().allow(null),
  fechaEstanciaFin: Joi.date().allow(null),
});

export { addInvitadoToEventoSchema };
