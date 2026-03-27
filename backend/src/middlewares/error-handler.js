import { CustomError } from "../errors/custom-error.js";

export const errorHandler = (err, req, res) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);

  return res.status(400).send({
    errors: [{ message: "generic-error" }],
  });
};
