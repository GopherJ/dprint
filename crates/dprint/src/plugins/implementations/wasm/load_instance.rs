use dprint_core::types::ErrBox;
use wasmer::{Instance, Store, Module, ImportObject};

/// Loads a compiled wasm module from the specified bytes.
pub fn load_instance(compiled_module_bytes: &[u8], import_object: &ImportObject) -> Result<Instance, ErrBox> {
    let store = Store::default();

    let module = unsafe { match Module::deserialize(&store, &compiled_module_bytes) {
        Ok(module) => module,
        Err(err) => { return err!("Error deserializing compiled wasm module: {:?}", err); }
    } };
    let instance = Instance::new(&module, import_object);
    match instance {
        Ok(instance) => Ok(instance),
        Err(err) => err!("Error instantiating module: {}", err),
    }
}
