import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function BuyGoods(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer luNWuKYj96zOvFHARYFy6PxpIbE3");
    return fetch("https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ShortCode: 600989,
        CommandID: "CustomerBuyGoodsOnline",
        Amount: 60,
        Msisdn: 254705912645,
        BillRefNumber: "",
      }),
    })
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

app.http("BuyGoods", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: BuyGoods,
});
