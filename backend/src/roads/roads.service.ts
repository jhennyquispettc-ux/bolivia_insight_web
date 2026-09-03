import { Injectable, Logger } from '@nestjs/common';

const ABC_URL = 'https://transitabilidad.abc.gob.bo/api/v1/data';

const OK_TTL_MS = 5 * 60 * 1000;
const FAIL_TTL_MS = 60 * 1000;
const TIMEOUT_MS = 8000;

export type RoadsStatus = {
  status: 'ok' | 'unavailable';
  source: { name: string; url: string };
  fetchedAt: string | null;
  reason: string | null;
  data: unknown[];
};

@Injectable()
export class RoadsService {
  private readonly logger = new Logger(RoadsService.name);
  private cache: { payload: RoadsStatus; expiresAt: number } | null = null;

  async getStatus(): Promise<RoadsStatus> {
    if (this.cache && Date.now() < this.cache.expiresAt) {
      return this.cache.payload;
    }

    const payload = await this.fetchUpstream();
    const ttl = payload.status === 'ok' ? OK_TTL_MS : FAIL_TTL_MS;
    this.cache = { payload, expiresAt: Date.now() + ttl };
    return payload;
  }

  private base(): Omit<RoadsStatus, 'status' | 'fetchedAt' | 'reason' | 'data'> {
    return {
      source: {
        name: 'ABC - Administradora Boliviana de Carreteras',
        url: 'https://transitabilidad.abc.gob.bo',
      },
    };
  }

  private unavailable(reason: string): RoadsStatus {
    return { ...this.base(), status: 'unavailable', fetchedAt: null, reason, data: [] };
  }

  private async fetchUpstream(): Promise<RoadsStatus> {
    try {
      const res = await fetch(ABC_URL, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: 'application/json' },
      });

      const body = await res.text();

      if (!res.ok) {
        // The upstream currently gates this endpoint behind a manual captcha.
        const captcha = /captcha/i.test(body);
        this.logger.warn(
          `ABC upstream returned ${res.status}${captcha ? ' (captcha gate)' : ''}`,
        );
        return this.unavailable(captcha ? 'upstream_captcha' : `upstream_http_${res.status}`);
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(body);
      } catch {
        return this.unavailable('upstream_not_json');
      }

      if (!Array.isArray(parsed)) {
        return this.unavailable('upstream_unexpected_shape');
      }

      return {
        ...this.base(),
        status: 'ok',
        fetchedAt: new Date().toISOString(),
        reason: null,
        data: parsed,
      };
    } catch (err) {
      const timedOut = err instanceof Error && err.name === 'TimeoutError';
      this.logger.warn(`ABC upstream unreachable: ${(err as Error).message}`);
      return this.unavailable(timedOut ? 'timeout' : 'upstream_error');
    }
  }
}
