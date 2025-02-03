// import {
//   NexuHandler,
//   NexuRequest,
//   NexuResponse,
//   processRequest,
//   throwError,
// } from "nexujs";

// type RequestOptions = {
//   errorMessage?: string;
//   errorHandler?: (req: NexuRequest, res: NexuResponse, error: Error) => void;
//   action: NexuHandler;
// };

// export const request = (options: RequestOptions) =>
//   processRequest({
//     async action(req, res, next) {
//       try {
//         options.action(req, res, next);
//       } catch (error) {
//         if (options.errorHandler) {
//           return options.errorHandler(req, res, error as Error);
//         }

//         return throwError({
//           res,
//           error,
//           message: options.errorMessage,
//           status: "500",
//         });
//       }
//     },
//   });
