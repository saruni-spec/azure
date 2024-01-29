import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import axios from "axios";

export async function myFuncs(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const auth =
    "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==";

  try {
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: auth,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { body: data };
  } catch (error) {
    if (error instanceof Error) {
      context.log(`Error calling M-Pesa API: ${error.message}`);
      return {
        status: 500,
        body: `Error calling M-Pesa API: ${error.message}`,
      };
    } else {
      // Handle any unexpected errors
      context.log(`Unexpected error: ${error}`);
      return {
        status: 500,
        body: `Unexpected error: ${error}`,
      };
    }
  }
}

app.http("myFuncs", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: myFuncs,
});
