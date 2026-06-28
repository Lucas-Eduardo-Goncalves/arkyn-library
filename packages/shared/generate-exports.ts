import { resolve } from "node:path";
import Bun from "bun";

interface ExportEntry {
  import: string;
  types?: string;
}

interface PackageJson {
  exports?: Record<string, ExportEntry>;
  [key: string]: unknown;
}

const root = process.cwd();

const indexContent = await Bun.file(resolve(root, "src/index.ts")).text();

const packageJson = (await Bun.file(
  resolve(root, "package.json"),
).json()) as PackageJson;

const exportsMap: Record<string, ExportEntry> = {};

const regex =
  /export\s+(?:\*|\{[\s\S]*?\}|type\s+\{[\s\S]*?\})\s+from\s+["'](.+)["']/g;

for (const match of indexContent.matchAll(regex)) {
  let importPath = match[1];

  if (!importPath.startsWith(".")) continue;

  importPath = importPath.replace(/^\.\//, "");

  const exportName = importPath.split("/").pop()!;

  exportsMap[`./${exportName}`] = {
    import: `./dist/${importPath}/index.js`,
    types: `./dist/${importPath}/index.d.ts`,
  };
}

packageJson.exports = {
  ".": {
    import: "./dist/bundle.js",
    types: "./dist/index.d.ts",
  },
  ...Object.fromEntries(
    Object.entries(exportsMap).sort(([a], [b]) => a.localeCompare(b)),
  ),
};

await Bun.write(
  resolve(root, "package.json"),
  JSON.stringify(packageJson, null, 2) + "\n",
);

console.log(`Added ${Object.keys(exportsMap).length + 2} exports.`);
