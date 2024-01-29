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

  const consumerKey: string = "axioOaWgT8LBwX4ZjfzmG7yEsIpX7N1h";
  const consumerSecret: string = "V5CTiNxJi4xo6hcP";
  const url: string =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth =
    "Basic " +
    Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

  try {
    const response = await axios.get(url, { headers: { Authorization: auth } });
    return { body: response.data };
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
