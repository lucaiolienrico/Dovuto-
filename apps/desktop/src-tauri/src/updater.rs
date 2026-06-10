use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

/// Checks for updates silently on startup and installs if available.
#[cfg(desktop)]
pub async fn check_for_updates(app: AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(update) = app.updater()?.check().await? {
        println!("Aggiornamento disponibile: {}", update.version);

        let mut downloaded = 0;
        update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    println!("Scaricati {downloaded} / {content_length:?}");
                },
                || {
                    println!("Download completato, installazione...");
                },
            )
            .await?;

        println!("Aggiornamento installato. Riavvia per applicare.");
    } else {
        println!("Nessun aggiornamento disponibile.");
    }
    Ok(())
}

/// Manual update check invokable from the frontend.
#[tauri::command]
pub async fn check_update_command(app: AppHandle) -> Result<bool, String> {
    #[cfg(desktop)]
    {
        match app.updater() {
            Ok(updater) => match updater.check().await {
                Ok(Some(_)) => Ok(true),
                Ok(None) => Ok(false),
                Err(e) => Err(e.to_string()),
            },
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(not(desktop))]
    {
        let _ = app;
        Ok(false)
    }
}
