---
title: Markdown Plugin
description: Documentation on the Markdown code formatting plugin for dprint.
---

<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li><a href="/plugins">Plugins</a></li>
    <li><a href="/plugins/markdown">Markdown</a></li>
  </ul>
</nav>

# Markdown Code Formatter

## Install and Setup

In _.dprintrc.json_:

1. Specify the plugin url in the `"plugins"` array.
2. Ensure `.md` file extensions are matched in an `"includes"` pattern.
3. Add a `"markdown"` configuration property if desired.

```json
{
  // omitted...
  "markdown": {
    // markdown config goes here
  },
  "plugins": [
    "https://plugins.dprint.dev/markdown-x.x.x.wasm"
  ]
}
```

## Code block formatters

Code blocks are formatted based on the other provided plugins. For example, if you wish to format JSON, TypeScript, and JavaScript code blocks, then ensure those plugins are also specified in the list of plugins to use.

```json
{
  // omitted...
  "plugins": [
    "https://plugins.dprint.dev/typescript-x.x.x.wasm",
    "https://plugins.dprint.dev/json-x.x.x.wasm",
    "https://plugins.dprint.dev/markdown-x.x.x.wasm"
  ]
}
```

## Configuration

See [Configuration](/plugins/markdown/config)

## Playground

See [Playground](https://dprint.dev/playground#language/markdown)