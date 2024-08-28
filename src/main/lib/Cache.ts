import NodeCache from "node-cache";

export class Cache {
  private cache: NodeCache;
  private tagMap: Map<string, Set<string>>;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600,
      checkperiod: 600,
    });
    this.tagMap = new Map();
  }

  // Add data to cache with optional tags
  set(
    urlHash: string,
    data: any,
    { tags = [], ttl = 3600 }: { tags?: string[]; ttl?: number }
  ) {
    this.cache.set(urlHash, data, ttl);

    tags.forEach((tag) => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)?.add(urlHash);
    });
  }

  // Get data from cache
  get(urlHash: string): any | undefined {
    return this.cache.get(urlHash);
  }

  // Invalidate cache by tags
  invalidateByTag(tags: string[]) {
    tags.map((tag) => {
      const hashes = this.tagMap.get(tag);
      if (hashes) {
        hashes.forEach((urlHash) => {
          this.cache.del(urlHash);
        });
        this.tagMap.delete(tag);
      }
    });
  }

  // Invalidate cache by URL hash
  invalidateByUrlHash(urlHash: string) {
    this.cache.del(urlHash);
    this.tagMap.forEach((hashes, tag) => {
      if (hashes.has(urlHash)) {
        hashes.delete(urlHash);
        if (hashes.size === 0) {
          this.tagMap.delete(tag);
        }
      }
    });
  }
}
