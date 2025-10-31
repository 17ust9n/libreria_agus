import React, { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

function App() {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [output, setOutput] = useState();
  const [processing, setProcessing] = useState(false);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("00:00:10");

  const loadFFmpeg = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const uploadVideo = (e) => {
    const file = e.target.files?.item(0);
    if (file) setVideo(file);
  };

  const trimVideo = async () => {
    if (!video) return;

    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      alert("Los tiempos deben estar en formato hh:mm:ss");
      return;
    }

    setProcessing(true);
    setOutput(null);

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // Recortar el video usando tiempos hh:mm:ss
    await ffmpeg.exec([
      "-ss",
      startTime,
      "-i",
      "input.mp4",
      "-to",
      endTime,
      "-c",
      "copy",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    setOutput(url);
    setProcessing(false);
  };

  if (!ready)
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <h2>🎬 Editor de Video con React + FFmpeg</h2>
        <button onClick={loadFFmpeg}>Cargar FFmpeg</button>
      </div>
    );

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>🎬 Editor de Video con React + FFmpeg</h2>
      <input type="file" accept="video/mp4" onChange={uploadVideo} />

      {video && (
        <>
          <h3>Video original:</h3>
          <video controls width="480" src={URL.createObjectURL(video)}></video>
          <br />

          {/* Controles para definir recorte */}
          <div style={{ marginTop: "15px" }}>
            <label>
              Inicio (hh:mm:ss):{" "}
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00:00:00"
              />
            </label>
            &nbsp;&nbsp;
            <label>
              Fin (hh:mm:ss):{" "}
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00:00:10"
              />
            </label>
          </div>

          <br />
          <button onClick={trimVideo} disabled={processing}>
            {processing ? "Procesando..." : "Recortar video"}
          </button>
        </>
      )}

      {output && (
        <>
          <h3>Video recortado:</h3>
          <video controls width="480" src={output}></video>
          <br />
          <a href={output} download="video_recortado.mp4">
            Descargar video
          </a>
          <br /><br />
          <button
            onClick={() => {
              URL.revokeObjectURL(output);
              setOutput(null);
            }}
            style={{
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🗑️ Eliminar video recortado
          </button>
        </>
      )}
    </div>
  );
}

export default App;
