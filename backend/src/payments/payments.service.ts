import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

// Server-side price table. This is the ONLY source of truth for what a session
// costs — the amount is never accepted from the client.
const PRICES: Record<number, number> = {
  15: 12.0,
  30: 22.0,
};

@Injectable()
export class PaymentsService {
  private get base(): string {
    return process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
  }

  get currency(): string {
    return process.env.PAYPAL_CURRENCY || 'USD';
  }

  get clientId(): string {
    return process.env.PAYPAL_CLIENT_ID || '';
  }

  isConfigured(): boolean {
    return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET);
  }

  /** Authoritative price for a session length, in major units (e.g. 22.00). */
  priceFor(durationMin: number): number {
    const price = PRICES[durationMin];
    if (price === undefined) {
      throw new BadRequestException('Unsupported session duration');
    }
    return price;
  }

  // ── PayPal REST helpers ─────────────────────────────────────────────────────
  private async getAccessToken(): Promise<string> {
    if (!this.isConfigured()) {
      throw new InternalServerErrorException(
        'PayPal no configurado: define PAYPAL_CLIENT_ID y PAYPAL_SECRET en backend/.env',
      );
    }
    const credentials = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString('base64');

    const res = await fetch(`${this.base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('PayPal token error:', detail);
      throw new InternalServerErrorException('No se pudo autenticar con PayPal');
    }
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  /** Create a CAPTURE order for the given amount. Returns the PayPal order id. */
  async createOrder(amount: number, description: string): Promise<{ id: string }> {
    const token = await this.getAccessToken();

    const res = await fetch(`${this.base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description,
            amount: {
              currency_code: this.currency,
              value: amount.toFixed(2),
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('PayPal createOrder error:', detail);
      throw new InternalServerErrorException('No se pudo crear la orden de PayPal');
    }
    const data = (await res.json()) as { id: string };
    return { id: data.id };
  }

  /**
   * Capture a previously created order. Returns the captured status, the
   * capture id, and the captured amount so the caller can verify it.
   */
  async captureOrder(orderId: string): Promise<{
    status: string;
    captureId: string | null;
    amount: number | null;
    currency: string | null;
  }> {
    const token = await this.getAccessToken();

    const res = await fetch(
      `${this.base}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('PayPal captureOrder error:', detail);
      throw new BadRequestException('No se pudo capturar el pago de PayPal');
    }

    const data = (await res.json()) as any;
    const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
    return {
      status: data?.status ?? 'UNKNOWN',
      captureId: capture?.id ?? null,
      amount: capture?.amount?.value ? Number(capture.amount.value) : null,
      currency: capture?.amount?.currency_code ?? null,
    };
  }
}
