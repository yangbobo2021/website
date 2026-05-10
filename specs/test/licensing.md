<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# LIC: Licensing Headers

## Intent

This spec defines acceptance tests for SPDX copyright and license headers.

## Header Checks

### LIC-6
Verifies: [LIC-1](../dev/licensing.md#lic-1)

Where the file has comment syntax and is not [excluded](../dev/licensing.md#exclusions), while git-tracked or `git add`-able, when checking its first comment block after any shebang, the file shall contain `SPDX-FileCopyrightText`.

### LIC-7
Verifies: [LIC-2](../dev/licensing.md#lic-2)

Where the file has comment syntax, is not [excluded](../dev/licensing.md#exclusions), and a [license file](../dev/licensing.md#license-file-detection) exists at project root, while git-tracked or `git add`-able, when checking its first comment block after any shebang, the file shall contain `SPDX-License-Identifier`.

### LIC-8
Verifies: [LIC-5](../dev/licensing.md#lic-5)

Where a file is derived from an upstream scaffold or template that supplies SPDX headers, when checking its first comment block after any shebang, the `SPDX-FileCopyrightText` and `SPDX-License-Identifier` lines shall match the upstream values verbatim, and no additional project-license `SPDX-License-Identifier` line shall be present.
