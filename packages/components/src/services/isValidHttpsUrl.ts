function isValidHttpsUrl(url: string): boolean {
	try {
		return new URL(url).protocol === "https:";
	} catch {
		return false;
	}
}

export { isValidHttpsUrl };
