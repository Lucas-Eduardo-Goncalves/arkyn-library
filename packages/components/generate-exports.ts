import { resolve } from "node:path";
import Bun from "bun";

interface ExportEntry {
  import: string;
  types?: string;
  default?: string;
}

interface PackageJson {
  exports?: Record<string, ExportEntry>;
  [key: string]: unknown;
}

const root = process.cwd();
const srcDir = resolve(root, "src");

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

  const srcPath = resolve(srcDir, importPath);
  const isDirectory =
    (await Bun.file(`${srcPath}/index.ts`).exists()) ||
    (await Bun.file(`${srcPath}/index.tsx`).exists());

  const distImport = isDirectory
    ? `./dist/modules/${importPath}/index.js`
    : `./dist/modules/${importPath}.js`;

  const distTypes = isDirectory
    ? `./dist/${importPath}/index.d.ts`
    : `./dist/${importPath}.d.ts`;

  exportsMap[`./${exportName}`] = {
    import: distImport,
    types: distTypes,
    default: distImport,
  };
}

packageJson.exports = {
  ".": {
    import: "./dist/index.js",
    types: "./dist/index.d.ts",
    default: "./dist/index.js",
  },
  "./styles": {
    import: "./dist/components.css",
    default: "./dist/components.css",
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
