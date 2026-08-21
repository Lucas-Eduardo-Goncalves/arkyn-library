#!/usr/bin/env bash
#
# Idempotent, provenance-enabled npm publish wrapper shared by every
# @arkyn/* package's "publish:beta" / "publish:latest" scripts.
#
# Usage (run from inside a package directory, e.g. packages/shared):
#   bash ../../scripts/publish-idempotent.sh <dist-tag>
#
#   <dist-tag>: the npm dist-tag to publish under (e.g. "beta" or "latest")
#
# Behavior:
#   - Adds --provenance to the actual `npm publish` call so the OIDC-based
#     provenance attestation (permissions: id-token: write in the release
#     workflow) is actually generated.
#   - Treats "this exact version is already published" as a soft-success
#     (idempotent no-op), so re-running the release pipeline after a
#     partial failure doesn't abort on packages that already made it to
#     the registry. This is detected two ways:
#       1) Proactively, via `npm view <pkg>@<version> version` before
#          publishing.
#       2) Reactively, by inspecting the `npm publish` error output for
#          the "cannot publish over previously published version"
#          signature, in case of a race with another run.
#   - Any OTHER failure (auth, network, registry, or real package errors)
#     still exits non-zero, so the calling workflow still stops and
#     reports failure correctly.
set -euo pipefail

TAG="${1:?Usage: publish-idempotent.sh <dist-tag>}"

NAME="$(node -p "require('./package.json').name")"
VERSION="$(node -p "require('./package.json').version")"
SPEC="${NAME}@${VERSION}"

echo "Checking whether ${SPEC} is already published..."

# `npm view` exits non-zero (e.g. E404) when the package or the specific
# version doesn't exist yet. That's the expected case for a fresh
# release, so we don't want `set -e` to abort here.
PUBLISHED_VERSION="$(npm view "${SPEC}" version 2>/dev/null || true)"

if [ "${PUBLISHED_VERSION}" = "${VERSION}" ]; then
	echo "${SPEC} is already published on the registry. Skipping publish (idempotent no-op)."
	exit 0
fi

echo "${SPEC} not found on the registry yet. Publishing with tag \"${TAG}\"..."

PUBLISH_OUTPUT_FILE="$(mktemp)"
trap 'rm -f "${PUBLISH_OUTPUT_FILE}"' EXIT

set +e
npm publish --tag "${TAG}" --provenance >"${PUBLISH_OUTPUT_FILE}" 2>&1
PUBLISH_EXIT_CODE=$?
set -e

cat "${PUBLISH_OUTPUT_FILE}"

if [ "${PUBLISH_EXIT_CODE}" -eq 0 ]; then
	echo "Published ${SPEC} successfully."
	exit 0
fi

if grep -qiE "cannot publish over (the )?previously published version" "${PUBLISH_OUTPUT_FILE}"; then
	echo "${SPEC} was already published (detected from npm publish error output). Treating as idempotent success."
	exit 0
fi

echo "Publish of ${SPEC} failed for a reason other than 'already published'. Failing the build."
exit "${PUBLISH_EXIT_CODE}"
