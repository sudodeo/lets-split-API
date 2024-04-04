// Function to determine allowed methods for an endpoint
export const getAllowedMethodsForEndpoint = (path: string) => {
  switch (path) {
    case "/":
      return ["GET"];
    case "/api/v1/health":
      return ["GET"];
    case "/api/v1/auth/register":
      return ["POST"];
    case "/api/v1/auth/login":
      return ["POST"];
    case "/api/v1/auth/logout":
      return ["POST"];
    case "/api/v1/auth/refresh":
      return ["POST"];
    case "/api/v1/auth/forgot-password":
      return ["POST"];
    case "/api/v1/expenses":
      return ["POST", "GET"];
    case "/api/v1/expenses/expense-summary":
      return ["GET"];
    case "/api/v1/expenses/settle-expense":
      return ["POST"];
    case "/api/v1/currencies":
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
        return ["GET", "DELETE", "PATCH"];
      }
      return [];
  }
};
