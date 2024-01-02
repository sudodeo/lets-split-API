// Function to determine allowed methods for an endpoint
const getAllowedMethodsForEndpoint = (path) => {
  switch (path) {
    case "/":
      return ["GET"];
    case "/api/health":
      return ["GET"];
    case "/api/auth/register":
      return ["POST"];
    case "/api/auth/login":
      return ["POST"];
    case "/api/auth/logout":
      return ["POST"];
    case "/api/auth/refresh":
      return ["POST"];
    case "/api/auth/forgot-password":
      return ["POST"];
    case "/api/expenses":
      return ["POST", "GET"];
    case "/api/expenses/expense-summary":
      return ["GET"];
    case "/api/expenses/settle-expense":
      return ["POST"];
    case "/api/currencies":
      return ["GET"];
    default:
      // Check for the reset-password pattern
      if (/^\/api\/auth\/reset-password\/[^/]+$/.test(path)) {
        return ["POST"];
      } else if (/^\/api\/expense\/[^/]+$/.test(path)) {
        // Check for the expense pattern with expenseID
        return ["POST"];
      } else if (/^\/api\/users\/[^/]+$/.test(path)) {
        // Check for the user pattern with userID
        return ["GET", "DELETE", "PUT"];
      }
      return [];
  }
};

const httpMethodHandler = async (req, res, next) => {
  const allowedMethods = getAllowedMethodsForEndpoint(req.path);
  if (allowedMethods.length === 0) {
    //endpoint does not exist
    return next();
  }

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: `The requested method ${req.method} is not allowed for this endpoint.`,
      allowedMethods,
    });
  }
  next();
};

export default httpMethodHandler;
