/**
 * Simple in-memory cache with TTL.
 */
export class CacheManager {
	constructor(defaultTtlMs = 5 * 60_000) {
		this.ttl = defaultTtlMs;
		this.map = new Map();
	}

	set(key, value, ttlMs = this.ttl) {
		const expiresAt = Date.now() + ttlMs;
		this.map.set(key, { value, expiresAt });
		return value;
	}

	get(key) {
		const entry = this.map.get(key);
		if (!entry) return null;
		if (entry.expiresAt < Date.now()) {
			this.map.delete(key);
			return null;
		}
		return entry.value;
	}

	has(key) {
		return this.get(key) !== null;
	}

	clear() {
		this.map.clear();
	}
}
