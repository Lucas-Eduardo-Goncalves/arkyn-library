function clear(value: string) {
	return value?.replace(/[^0-9]/g, "");
}

const TYPES = {
	EIGHT: "(99) 9999-9999",
	NINE: "(99) 99999-9999",
};

function applyMask(value: string, maskPattern: string) {
	let result = "";
	let digitIndex = 0;

	for (let i = 0; i < maskPattern.length; i++) {
		if (maskPattern[i] === "9") {
			if (digitIndex < value.length) {
				result += value[digitIndex];
				digitIndex++;
			} else {
				break;
			}
		} else {
			if (digitIndex < value.length) {
				result += maskPattern[i];
			} else {
				break;
			}
		}
	}

	return result;
}

function getMask(value: string): "NINE" | "EIGHT" {
	const mask = value.length > 10 ? "NINE" : "EIGHT";
	return mask;
}

const MAX_LENGTH = clear(TYPES.NINE).length;

export { applyMask, clear, getMask, MAX_LENGTH, TYPES };
