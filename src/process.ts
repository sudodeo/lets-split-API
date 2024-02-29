// import { errorHandler } from "./middleware/error.middleware";


process.on('uncaughtException', (error: Error) => {
    console.log(`Uncaught Exception: ${error.message}`);
  
    // errorHandler(error);
  });