mod tray;
mod notifications;
mod updater;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            // System tray
            tray::setup_tray(app)?;

            // Global shortcut Cmd/Ctrl+N → new deadline
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
                let shortcut_new = "CmdOrCtrl+N".parse::<Shortcut>().unwrap();
                let handle = app.handle().clone();
                app.global_shortcut().on_shortcut(shortcut_new, move |_app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        if let Some(window) = handle.get_webview_window("main") {
                            let _ = window.emit("shortcut:new-deadline", ());
                        }
                    }
                })?;
            }

            // Check for updates on startup (non-blocking)
            #[cfg(desktop)]
            {
                let handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    let _ = updater::check_for_updates(handle).await;
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            notifications::send_deadline_notification,
            notifications::schedule_notifications,
            updater::check_update_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
