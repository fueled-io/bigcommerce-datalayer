import Ajv, { ValidationError } from 'ajv';
const dataLayerSchema = require('../schema/datalayer.schema.json');

// Schema validation

const ajv = new Ajv();
ajv.addSchema(dataLayerSchema);

export default function validateDatalayerJson(object, type) {
  const validate = ajv.getSchema(`https://fueled.io/schemas/datalayer/v1.0#/$defs/${type}`);
  if (!validate) throw new Error(`Couldn't find the right schema: ${type}`);

  const valid = validate(object);
  if (!valid) {
    console.debug(object);
    throw new ValidationError(validate.errors);
  }
}

