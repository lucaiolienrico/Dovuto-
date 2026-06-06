use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

#[derive(Serialize, Deserialize)]
pub struct DeadlineNotif {
    pub title: String,
    pub body: String,
    pub deadline_id: i64,
}

#[tauri::command]
pub fn send_deadline_notification(
    app: AppHandle,
    title: String,
    body: String,
) -> Result<(), String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn schedule_notifications(
    app: AppHandle,
    deadlines: Vec<DeadlineNotif>,
) -> Result<(), String> {
    for deadline in deadlines {
        app.notification()
            .builder()
            .title(format!("⚠️ {}", deadline.title))
            .body(deadline.body)
            .show()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
