import { ZodType, z } from "zod";

import { ServerError } from "../http/badResponses/serverError";
import { UnprocessableEntity } from "../http/badResponses/unprocessableEntity";
import { formParse } from "./formParse";
import { getCaller } from "./getCaller";
import { httpDebug } from "./httpDebug";

function formatErrorMessage(error: z.ZodError) {
  const title = "Error validating:";
  const lines = error.issues.map(
    ({ path, message }) => `-> ${path.join(".")}: ${message}`
  );

  return [title, ...lines].join("\n");
}

class SchemaValidator<T extends ZodType> {
  functionName: string;
  callerInfo: string;

  constructor(readonly schema: T) {
    const { callerInfo, functionName } = getCaller();
    this.callerInfo = callerInfo;
    this.functionName = functionName;
  }

  isValid(data: any): boolean {
    return this.schema.safeParse(data).success;
  }

  safeValidate(data: any): z.ZodSafeParseResult<z.infer<T>> {
    return this.schema.safeParse(data);
  }

  validate(data: any): z.infer<T> {
    try {
      return this.schema.parse(data);
    } catch (error: any) {
      throw new ServerError(formatErrorMessage(error));
    }
  }

  formValidate(data: any, message?: string): z.infer<T> {
    const formParsed = formParse([data, this.schema]);

    if (!formParsed.success) {
      httpDebug("UnprocessableEntity", formParsed);
      const firstErrorKey = Object.keys(formParsed.fieldErrors)[0];

      throw new UnprocessableEntity(
        {
          fields: formParsed.fields,
          fieldErrors: formParsed.fieldErrors,
          data: { scrollTo: firstErrorKey },
          message,
        },
        false
      );
    }

    return formParsed.data as z.infer<T>;
  }
}

export { SchemaValidator };
