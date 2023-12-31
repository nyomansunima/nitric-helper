import { HttpErrorException } from './http-exception'

/**
 * ## apiHandler
 *
 * allow to handle the api call
 * and manage the resource and throw into a response api
 *
 * @param fallbackFunction function to handle and return something
 * @returns {ctx}
 */
export function apiHandler(fallbackFunction: any) {
  return async (ctx: any, next: any) => {
    try {
      // get the initial data from the given fallback
      // allow to infer all of the function to running
      // then pass the response as json to api
      const returnedData = await fallbackFunction(ctx, next)

      if (returnedData && returnedData.request && returnedData.response) {
        return await next(ctx)
      }

      ctx.res.json(returnedData)
      return ctx
    } catch (err) {
      // catch some error
      // then spread it into a custom error http exception
      // this will work with custom http exceptions
      const { message, statusCode, description } = err as HttpErrorException

      ctx.res.status = statusCode
      ctx.res.json({ message, error: description, statusCode })
      return ctx
    }
  }
}
