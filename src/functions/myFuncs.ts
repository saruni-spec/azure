import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function myFuncs(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    let headers = new Headers();

    let consumerKey = "72hMwYgR2aeyjF71A3Ku7WVMAWVlCpWNsHzdGNvQf0Uju4Av";
    let consumerSecret =
      "GxVqOJByEfYxXNEDNJakqdA5XX6LgADfaMpPOTNZxjwxRKA4xbTTsZb5iZmAS736";
    let credentials = btoa(consumerKey + ":" + consumerSecret);
    headers.append("Authorization", "Basic " + credentials);
    return fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers }
    )
      .then((response) => response.text())
      .then((result) => ({ body: result }))
      .catch((error) => ({ body: error }));
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
