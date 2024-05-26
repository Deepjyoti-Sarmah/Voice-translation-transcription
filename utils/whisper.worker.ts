import { pipeline, env } from "@xenova/transformers"
env.allowLocalModels = false;

import { MessageTypes } from "./presets"

class MyTranscriptionPipeline {
    static task: any = "automatic-speech-recognition";
    static model: any = "openai/whisper-tiny.en";
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, null!, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    const { type, audio } = event.data;

    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio);
    }
})

async function transcribe(audio: any) {
    sendLoadingMessage("loading");

    let pipeline;

    try {
        pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback);
    } catch (err: any) {
        console.log(err.message);
    }

    sendLoadingMessage("success");

    const stride_length_s = 5;

    const generationTracker = new GenerationTracker(pipeline, stride_length_s);
    await pipeline(audio, {
        top_k: 0,
        do_sample: false,
        chunk_length: 30,
        stride_length_s,
        return_timestamps: true,
        callback_function:
        generationTracker.callbackFunction.bind(generationTracker),
        chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
    });
    generationTracker.sendFinalResult();
}

async function load_model_callback(data: any) {
    const { status } = data;
    if (status === "progress") {
        const { file, progress, loaded, total } = data;
        sendDownloadingMessage(file, progress, loaded, total);
    }
}

function sendLoadingMessage(status: any) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status,
    });
}

export async function sendDownloadingMessage(
    file: any,
    progress: any,
    loaded: any,
    total: any
) {
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file,
        progress,
        loaded,
        total,
    });
}

class GenerationTracker {
    pipeline: any
    stride_length_s: any
    chunks: any
    time_precision: any
    processed_chunks: any
    callbackFunctionCounter: any

    constructor(pipeline: any, stride_length_s: any) {
        this.pipeline = pipeline
        this.stride_length_s = stride_length_s
        this.chunks = []
        this.time_precision =
            pipeline?.processor.feature_extractor.config.chunk_length /
                pipeline.model.config.max_source_positions
        this.processed_chunks = []
        this.callbackFunctionCounter = 0
    }
    sendFinalResult() {
        self.postMessage({ type: MessageTypes.INFERENCE_DONE });
    }

    callbackFunction(beams: any) {
        this.callbackFunctionCounter += 1;
        if (this.callbackFunctionCounter % 10 !== 0) {
            return;
        }

        const bestBeam = beams[0];
        let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
            skip_special_tokens: true,
        });

        const result = {
            text,
            start: this.getLastChunkTimestamp(),
            end: undefined,
        }

        createPartialResultMessage(result);
    }

    chunkCallback(data: any) {
        this.chunks.push(data);
        const [_text, { chunks }] = this.pipeline.tokenizer._decode_asr(
            this.chunks,
            {
                time_precision: this.time_precision,
                return_timestamps: true,
                force_full_sequence: false,
            }
        )

        this.processed_chunks = chunks.map((chunk: any, index: any) => {
            return this.processChunk(chunk, index)
        })

        createResultMessage(
            this.processed_chunks,
            false,
            this.getLastChunkTimestamp()
        )
    }

    getLastChunkTimestamp() {
        if (this.processed_chunks.length === 0) {
            return 0;
        }
    }

    processChunk(chunk: any, index: any) {
        const { text, timestamp } = chunk;
        const [start, end] = timestamp;

        return {
            index,
            text: `${text.trim()}`,
            start: Math.round(start),
            end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
        }
    }
}

function createResultMessage(
    results: any,
    isDone: any,
    completedUntilTimestamp: any
) {
    self.postMessage({
        type: MessageTypes.RESULT,
        results,
        isDone,
        completedUntilTimestamp,
    });
}

function createPartialResultMessage(result: any) {
    self.postMessage({
        type: MessageTypes.RESULT_PARTIAL,
        result,
    });
}

