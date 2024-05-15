import { sendDownloadingMessage } from "./wisper.worker";

export async function load_model_callback(data: ProgressEvent) {
  const { status } = data;
  if (status === "progress") {
    const { file, progress, loading, total } = data;
    sendDownloadingMessage(file, progress, loading, total);
  }
}
