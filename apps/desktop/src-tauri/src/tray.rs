use tauri::{
    App, Manager,
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    menu::{Menu, MenuItem, PredefinedMenuItem},
};

pub fn setup_tray(app: &mut App) -> tauri::Result<()> {
    let quit = MenuItem::with_id(app, "quit", "Esci da Dovuto", true, None::<&str>)?;
    let show = MenuItem::with_id(app, "show", "Apri Dovuto", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let new_deadline = MenuItem::with_id(app, "new", "➕ Nuova scadenza...", true, Some("CmdOrCtrl+N"))?;

    let menu = Menu::with_items(app, &[&show, &separator, &new_deadline, &separator, &quit])?;

    let _tray = TrayIconBuilder::new()
        .menu(&menu)
        .menu_on_left_click(false)
        .tooltip("Dovuto — Le tue scadenze")
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "new" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                    let _ = window.emit("shortcut:new-deadline", ());
                }
            }
            _ => {}
        })
        .build(app)?;

    Ok(())
}
