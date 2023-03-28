/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

import {
  AxiosErrorResponseFormat,
  ErrorFormat,
  ResponseFormat,
} from "src/common/response-format";

interface ChildParams {
  name: string;
  type?: any;
  isArray?: boolean;
  children?: ChildParams[];
  example?: any;
  description?: string;
}

class Options {
  type?: any;
  children?: ChildParams[];
  isArray?: boolean;
  example?: any;
  description?: string;
  status?: number;
  hasPagination?: boolean | { type: any };
}

export const ApiCommonOkResponse = (options?: Options) => {
  return applyDecorators(
    ApiExtraModels(ResponseFormat),
    ApiResponse({
      schema: {
        allOf: [
          { properties: { error: { default: null } } },
          { $ref: getSchemaPath(ResponseFormat) },
          {
            properties: {
              ...(options?.isArray
                ? {
                    data: {
                      type: "array",
                      items: {
                        allOf: [
                          typeof options?.type === "function"
                            ? options.type.length
                              ? { example: new options.type() }
                              : { $ref: getSchemaPath(options.type) }
                            : { type: "string" },
                          {
                            ...((options as any)?.children?.length > 0 &&
                              getChildSchemaRecursively(
                                (options as any).children
                              )),
                          },
                          { example: options?.example },
                        ],
                      },
                    },
                  }
                : {
                    data: {
                      allOf: [
                        typeof options?.type === "function"
                          ? options.type.length
                            ? { example: new options.type() }
                            : { $ref: getSchemaPath(options.type) }
                          : { type: "string" },
                        {
                          ...((options as any)?.children?.length > 0 &&
                            getChildSchemaRecursively(
                              (options as any).children
                            )),
                        },
                        { example: options?.example },
                      ],
                    },
                  }),

              ...{
                statusCode: { default: options?.status },
                timestamp: { default: new Date() },
              },
            },
          },
        ],
      },
      description: options?.description,
      status: options?.status || 200,
    })
  );
};

export const ApiCommonErrorResponse = (options?: Options) => {
  return applyDecorators(
    ApiExtraModels(AxiosErrorResponseFormat),
    ApiExtraModels(ErrorFormat),
    ApiResponse({
      schema: {
        allOf: [
          { properties: { data: { default: null } } },
          { $ref: getSchemaPath(AxiosErrorResponseFormat) },
          {
            properties: {
              error: {
                allOf: [
                  typeof options?.type === "function"
                    ? options.type.length
                      ? { example: new options.type() }
                      : { $ref: getSchemaPath(options.type) }
                    : { type: "string" },
                  {
                    ...((options as any)?.children?.length > 0 &&
                      getChildSchemaRecursively((options as any).children)),
                  },
                  { example: options?.example },
                ],
              },
              statusCode: { default: options?.status },
              timestamp: { default: new Date() },
            },
          },
        ],
      },
      description: options?.description,
      status: options?.status || 500,
    })
  );
};

function getChildSchemaRecursively(children: ChildParams[]) {
  return {
    properties: {
      ...children.reduce(
        (
          acc,
          { name, type, isArray = false, children, description, example }
        ) => ({
          ...acc,
          [name]: {
            ...(isArray
              ? {
                  type: "array",
                  items: {
                    allOf: [
                      typeof type === "function"
                        ? type.length
                          ? { example: new type() }
                          : { $ref: getSchemaPath(type) }
                        : { type: "string" },
                      {
                        ...((children as ChildParams[])?.length > 0 &&
                          getChildSchemaRecursively(children as ChildParams[])),
                      },
                      { description },
                      { example },
                    ],
                  },
                }
              : {
                  allOf: [
                    typeof type === "function"
                      ? type.length
                        ? { example: new type() }
                        : { $ref: getSchemaPath(type) }
                      : { type: "string" },
                    {
                      ...((children as ChildParams[])?.length > 0 &&
                        getChildSchemaRecursively(children as ChildParams[])),
                    },
                    { description },
                    { example },
                  ],
                }),
          },
        }),
        {}
      ),
    },
  };
}
