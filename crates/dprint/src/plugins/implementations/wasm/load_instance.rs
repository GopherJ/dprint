use dprint_core::types::ErrBox;
use wasmer::{Instance, Store, Module, ImportObject, Memory, MemoryType};

/// Loads a compiled wasm module from the specified bytes.
pub fn load_instance(compiled_module_bytes: &[u8], import_object: &ImportObject) -> Result<(Instance, Memory), ErrBox> {
    let store = Store::default();
    let memory = Memory::new(&store, MemoryType::new(1, Some(1), false))?;

    let module = unsafe { match Module::deserialize(&store, &compiled_module_bytes) {
        Ok(module) => module,
        Err(err) => { return err!("Error deserializing compiled wasm module: {:?}", err); }
    } };
    let instance = Instance::new(&module, import_object);
    match instance {
        Ok(instance) => Ok((instance, memory)),
        Err(err) => err!("Error instantiating module: {}", err),
    }
}
