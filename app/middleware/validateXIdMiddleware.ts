import type { HttpContext } from "@adonisjs/core/http";

export const validateXId = async (ctx: HttpContext, next: () => Promise<void>) => {
  const xId = ctx.request.header("x-teacher-id");

  if (!xId) {
    return ctx.response.status(400).json({
      error: "Header x-teacher-id is required",
      message: "The x-teacher-id header must be provided for this operation",
    });
  }

  if (typeof xId !== "string" || xId.trim().length === 0) {
    return ctx.response.status(400).json({
      error: "Invalid x-teacher-id format",
      message: "The x-teacher-id header must be a non-empty string",
    });
  }

  await next();
};
