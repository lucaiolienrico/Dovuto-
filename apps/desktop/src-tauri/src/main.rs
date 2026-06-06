// Prevents an additional console window on Windows in release mode
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod tray;
mod notifications;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            // Setup system tray
            tray::setup_tray(app)?;

            // Register global shortcuts
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
                let shortcut_new = "CmdOrCtrl+N".parse::<Shortcut>().unwrap();
                app.global_shortcut().on_shortcut(shortcut_new, |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        // Open new deadline window or emit event to frontend
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("shortcut:new-deadline", ());
                        }
                    }
                })?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            notifications::send_deadline_notification,
            notifications::schedule_notifications,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
