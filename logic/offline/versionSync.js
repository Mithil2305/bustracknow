/**
 * Compare remote/local versions to decide if update needed.
 * @returns {Object} { shouldUpdate: boolean, reason: string }
 */
export function checkVersionSync(localVersion, remoteVersion) {
	if (!remoteVersion)
		return { shouldUpdate: false, reason: "No remote version" };
	if (!localVersion) return { shouldUpdate: true, reason: "No local version" };

	const lv = toTuple(localVersion);
	const rv = toTuple(remoteVersion);

	for (let i = 0; i < Math.max(lv.length, rv.length); i++) {
		const a = lv[i] || 0;
		const b = rv[i] || 0;
		if (b > a) return { shouldUpdate: true, reason: "Remote is newer" };
		if (b < a) return { shouldUpdate: false, reason: "Local is newer" };
	}
	return { shouldUpdate: false, reason: "Versions match" };
}

function toTuple(v) {
	return String(v)
		.split(".")
		.map((x) => Number.parseInt(x, 10) || 0);
}
