# Creating a WASM Plugin (Schema Version 3)

WASM plugins are the preferred way of developing plugins (as opposed to process plugins) because they are portable and run sandboxed in a WASM runtime. They can be written in any language that supports compiling to a WebAssembly file (_.wasm_)—emscripten solutions do not work.

## Rust - Using `dprint-core`

Implementing a WASM plugin is easier if you're using Rust as there are several helpers in `dprint-core`.

1. Use the `wasm` feature from `dprint-core` in _Cargo.toml_:

   ```toml
   dprint-core = { version = "...", features = ["wasm"] }
   serde = { version = "1.0.88", features = ["derive"] }
   serde_json = "1.0"
   ```

2. Add the following to _Cargo.toml_:

   ```toml
   [lib]
   crate-type = ["lib", "cdylib"]
   ```

3. Create a `Configuration` struct somewhere in your project:

   ```rust
   use serde::{Serialize, Deserialize};

   #[derive(Clone, Serialize, Deserialize)]
   #[serde(rename_all = "camelCase")]
   pub struct Configuration {
       // add configuration properties here...
       line_width: u32, // for example
   }
   ```

4. Use the `generate_plugin_code` macro:

   ```rust
   use std::path::PathBuf;
   use std::collections::HashMap;
   use dprint_core::generate_plugin_code;
   use dprint_core::configuration::{
       GlobalConfiguration,
       ResolveConfigurationResult,
       get_unknown_property_diagnostics,
       ConfigurationDiagnostic,
       get_value,
       ConfigKeyMap,
   };

   use super::configuration::Configuration; // import the Configuration from above

   fn resolve_config(
       config: HashMap<String, ConfigKeyMap>,
       global_config: &GlobalConfiguration,
   ) -> ResolveConfigurationResult<Configuration> {
       // implement. For example...
       let mut config = config;
       let mut diagnostics = Vec::new();
       let line_width = get_value(&mut config, "line_width", global_config.line_width.unwrap_or(120), &mut diagnostics);

       diagnostics.extend(get_unknown_property_diagnostics(config));

       ResolveConfigurationResult {
           config: Configuration { line_width },
           diagnostics,
       }
   }

   fn get_plugin_config_key() -> String {
       // return the JSON object key name used in the configuration file
       // ex. String::from("json")
   }

   fn get_plugin_file_extensions() -> Vec<String> {
       // return the file extensions this plugin will format
       // ex. vec![String::from("json")]
   }

   fn get_plugin_help_url() -> String {
       // return the help url of the plugin
       // ex. String::from("https://dprint.dev/plugins/json")
   }

   fn get_plugin_config_schema_url() -> String {
       // for now, return an empty string. Return a schema url once VSCode
       // supports $schema properties in descendant objects:
       // https://github.com/microsoft/vscode/issues/98443
       String::new()
   }

   fn get_plugin_license_text() -> String {
       std::str::from_utf8(include_bytes!("../LICENSE")).unwrap().into()
   }

   fn format_text(
       file_path: &Path,
       file_text: &str,
       config: &Configuration,
   ) -> Result<String, String> {
       // implement...
   }

   generate_plugin_code!();
   ```

5. Finally, compile with:

   ```bash
   cargo build --release --target=wasm32-unknown-unknown
   ```

### Format using other plugin

To format code using a different plugin, call the `format_with_host(file_path, file_text)` method that is exposed via the `generate_plugin_code!()` macro.

For example, this function is used by the markdown plugin to format code blocks.

## Schema Version 3 Overview

If you are not using `Rust`, then you must implement a lot of low level functionality.

How it works:

1. The WASM plugin initializes a shared memory buffer. Data between the CLI and WASM plugin is transferred in here.
2. Generally, the WASM plugin stores its own local byte array. The plugin should copy from the shared memory buffer into this byte array for composing the final received data or copy from this array into the shared memory buffer for sending back data. This is referred to as "shared bytes" below, but that could probably have used a better name like "local bytes" or something.
3. The CLI/host will communicate by calling the WASM exports.
4. The plugin may get the CLI/host to format other text by using the provided WASM imports.

## WASM Exports

Low level communication:

- `get_wasm_memory_buffer_size() -> usize` - Called to get the size of the shared WASM memory buffer.
- `get_wasm_memory_buffer() -> *const u8` - Called to get a pointer to the WASM memory buffer.
- `clear_shared_bytes(capacity: usize)` - Called to get the plugin to clear its local byte array.
- `set_buffer_with_shared_bytes(offset: usize, length: usize)` - Gets the plugin to set the WASM memory buffer with the local byte array at the specified position and length.
- `add_to_shared_bytes_from_buffer(length: usize)` - Gets the plugin to add to its shared bytes from the WASM memory buffer. The plugin should keep track of the current index.

Initialization functions:

- `get_plugin_schema_version() -> u32` - Return `3`
- `set_global_config()` - Called when the global configuration is done transferring over. Store it somewhere.
- `set_plugin_config()` - Called when the plugin specific configuration is done transferring over. Store it somewhere.
- `get_config_diagnostics() -> usize` - Called by the CLI to get the configuration diagnostics. Serialize the diagnostics as a JSON string, store it in the local bytes, and return the byte length.
- `get_resolved_config() -> usize` - Called by the CLI to get the resolved configuration for display in the CLI. Serialize it as a JSON string, store it in the local bytes, and return the byte length.
- `get_license_text() -> usize` - Store the plugin's license text in the local bytes and return the byte length.
- `get_plugin_info() -> usize` - Store the plugin's JSON serialized information in the local bytes and return the byte length. The plugin info is a JSON object with the following properties:
  - `name` - String saying the plugin name.
  - `version` - Version of the plugin (ex. `"0.1.0"`)
  - `configKey` - Configuration key to use for this plugin in `.dprintrc.json`
  - `fileExtensions` - An array of strings that say the file extensions this plugin supports (it should NOT have a leading period on the extension)
  - `helpUrl` - A string containing the URL to some web help.
  - `configSchemaUrl` - Return an empty string for now.

Formatting functions:

- `set_file_path()` - Called by the CLI for the plugin to take from its local byte array and store that data as the file path.
- `set_override_config()` - Possibly called by the CLI for the plugin to take from its local byte array and store that data as the format specific configuration.
- `format() -> u8`
  - Return `0` when there's no change.
  - `1` when there's a change.
  - `2` when there's an error.
- `get_formatted_text() -> usize` - Plugin should put the formatted text into its local byte array and return the size of that data.
- `get_error_text() -> usize` - Plugin should put the error text into its local byte array and return the size of that data.

### WASM Imports

These functions are provided by the dprint CLI on the `dprint` module of the WASM imports. They may be used for getting the CLI to format code with another plugin. The WASM plugin must expect these otherwise the CLI will error. You don't have to implement using them though.

Communication is done by using a shared WASM buffer. Essentially, the plugin stores its data somewhere, then writes to the shared WASM buffer, and communicates this information to the host. The host does what the plugin tells it to do and stores its information in a local byte array.

Low level communication:

- `host_clear_bytes(length: u32)` - Tell the host to clear its local byte array and reinitialize it with the provided length.
- `host_read_buffer(pointer: u32, length: u32)` - Tell the host to read from provided WASM memory address and store it in its local byte array.
- `host_write_buffer(pointer: u32, offset: u32, length: u32)` - Tell the host to write to the provided WASM memory address using the provided offset and length of its local byte array.

High level functions:

- `host_take_file_path()` - Tell the host to take the file path from its local byte array.
- `host_take_override_config()` - Tell the host to take the override configuration from its local byte array.
- `host_format() -> u8` - Tell the host to format using the file text in its local byte array.
  - Returns `0` for no change (do nothing else, no transfer needed)
  - `1` for change (use `host_get_formatted_text()`)
  - `2` for error (use `host_get_error_text()`)
- `host_get_formatted_text() -> u32` - Tell the host to store the formatted text in its local byte array and return back the byte length of that text.
- `host_get_error_text() -> u32` - Tell the host to store the error text in its local byte array and return back the byte length of that error message.

I recommend looking in the [`dprint-core` wasm module](https://github.com/dprint/dprint/blob/master/crates/core/src/plugins/wasm/mod.rs) for how to use these.
