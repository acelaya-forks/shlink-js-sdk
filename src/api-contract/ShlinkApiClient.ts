import type {
  ShlinkCreateShortUrlData,
  ShlinkDomainRedirects,
  ShlinkDomainsResponse,
  ShlinkEditDomainRedirects,
  ShlinkEditShortUrlData,
  ShlinkHealth,
  ShlinkMercureInfo,
  ShlinkShortUrl,
  ShlinkShortUrlsListParams,
  ShlinkShortUrlsResponse,
  ShlinkTags,
  ShlinkVisits,
  ShlinkVisitsOverview,
  ShlinkVisitsParams,
} from './types';

export type ShlinkApiClient = {
  listShortUrls(params?: ShlinkShortUrlsListParams): Promise<ShlinkShortUrlsResponse>;

  createShortUrl(options: ShlinkCreateShortUrlData): Promise<ShlinkShortUrl>;

  getShortUrlVisits(shortCode: string, query?: ShlinkVisitsParams): Promise<ShlinkVisits>;

  getTagVisits(tag: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getDomainVisits(domain: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getOrphanVisits(query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getNonOrphanVisits(query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getVisitsOverview(): Promise<ShlinkVisitsOverview>;

  getShortUrl(shortCode: string, domain?: string | null): Promise<ShlinkShortUrl>;

  deleteShortUrl(shortCode: string, domain?: string | null): Promise<void>;

  updateShortUrl(
    shortCode: string,
    domain: string | null | undefined,
    body: ShlinkEditShortUrlData,
  ): Promise<ShlinkShortUrl>;

  listTags(): Promise<ShlinkTags>;

  tagsStats(): Promise<ShlinkTags>;

  deleteTags(tags: string[]): Promise<{ tags: string[] }>;

  editTag(oldName: string, newName: string): Promise<{ oldName: string; newName: string }>;

  health(authority?: string): Promise<ShlinkHealth>;

  mercureInfo(): Promise<ShlinkMercureInfo>;

  listDomains(): Promise<ShlinkDomainsResponse>;

  editDomainRedirects(domainRedirects: ShlinkEditDomainRedirects): Promise<ShlinkDomainRedirects>;
};
