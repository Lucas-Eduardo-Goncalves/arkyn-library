// Loads each published package's built output under whatever Node.js binary
// runs this script. All build/test tooling (Vite 8, Vitest 4) requires
// Node >=20, so the declared "engines.node": ">=18.0.0" floor can only be
// verified against the plain compiled dist/ output, not by running the
// tooling itself on Node 18.
import assert from "node:assert/strict";

const packages = [
	"@arkyn/templates",
	"@arkyn/shared",
	"@arkyn/server",
	"@arkyn/components",
];

const results = [];

for (const name of packages) {
	try {
		const mod = await import(name);
		const exportNames = Object.keys(mod);
		assert.ok(exportNames.length > 0, `${name} resolved but has no exports`);
		results.push({ name, ok: true, exportCount: exportNames.length });
	} catch (error) {
		results.push({ name, ok: false, error });
	}
}

for (const result of results) {
	if (result.ok) {
		console.log(`✅ ${result.name} (${result.exportCount} exports)`);
	} else {
		console.error(`❌ ${result.name}`);
		console.error(result.error);
	}
}

const failed = results.filter((result) => !result.ok);

if (failed.length > 0) {
	console.error(
		`\n${failed.length} package(s) failed to load under Node ${process.version}`,
	);
	process.exit(1);
}

console.log(`\nAll packages loaded successfully under Node ${process.version}`);
