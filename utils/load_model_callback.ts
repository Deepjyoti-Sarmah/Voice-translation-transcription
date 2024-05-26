import { sendDownloadingMessage } from "./whisper.worker";

export async function  oad_model_callback(data: any) {
  const { status } = data;
  if (status === "progress") {
    const { file, progress, loading, total } = data;
    sendDownloadingMessage(file, progress, loading, total);
  }
}
