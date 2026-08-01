import { useRef, useState } from "react";
import useToast from "../../hooks/useToast";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — matches the backend's multer limit

const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Please choose a JPG, JPEG, PNG, or WEBP image.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "That image is larger than 8MB. Please choose a smaller photo.";
  }
  return null;
};

// "idle"   -> choice buttons + drag & drop zone
// "camera" -> live camera preview, ready to capture
// "preview" -> chosen/captured image, ready to analyze or change
const PrescriptionUploader = ({ onAnalyze, isAnalyzing }) => {
  const [step, setStep] = useState("idle");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = useToast();

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const setSelectedFile = (candidateFile) => {
    const error = validateFile(candidateFile);
    if (error) {
      showToast(error, "error");
      return;
    }
    stopCamera();
    setFile(candidateFile);
    setPreviewUrl(URL.createObjectURL(candidateFile));
    setStep("preview");
  };

  const handleFileInputChange = (event) => {
    const selected = event.target.files?.[0];
    if (selected) setSelectedFile(selected);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) setSelectedFile(dropped);
  };

  const startCamera = async () => {
    setCameraError(null);
    setStep("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("We couldn't access your camera. You can still upload a photo from your device instead.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1024;
    canvas.height = video.videoHeight || 1024;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          showToast("Couldn't capture that photo. Please try again.", "error");
          return;
        }
        setSelectedFile(new File([blob], `prescription-capture-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setCameraError(null);
    setStep("idle");
  };

  return (
    <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-900">Upload prescription</h2>
      <p className="mt-1 text-sm text-slate-600">Take a clear photo or upload an image of your doctor's prescription.</p>

      {step === "idle" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition ${
            isDragOver ? "border-red-400 bg-red-50" : "border-red-200 bg-red-50/40"
          }`}
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-2xl" aria-hidden="true">📄</div>
          <p className="mt-3 text-sm font-medium text-slate-700">Drag & drop a prescription image here</p>
          <p className="mt-1 text-xs text-slate-500">or choose an option below · JPG, JPEG, PNG, WEBP · up to 8MB</p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-800"
            >
              <span aria-hidden="true">📷</span> Take Photo
            </button>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 shadow-sm transition hover:bg-red-50">
              <span aria-hidden="true">📁</span> Upload Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </label>
          </div>
        </div>
      )}

      {step === "camera" && (
        <div className="mt-5 space-y-4">
          {cameraError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">{cameraError}</div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-slate-900">
              <video ref={videoRef} playsInline muted className="aspect-[4/3] w-full object-cover" />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-3">
            <button type="button" onClick={() => { stopCamera(); setCameraError(null); setStep("idle"); }} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50">Back</button>
            {!cameraError && (
              <button type="button" onClick={capturePhoto} className="flex-1 rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-800">Capture</button>
            )}
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="mt-5 space-y-4">
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border-4 border-red-100 bg-slate-50">
            {previewUrl && <img src={previewUrl} alt="Selected prescription preview" className="w-full object-contain" />}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRemove}
              disabled={isAnalyzing}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Remove / Change Image
            </button>
            <button
              type="button"
              onClick={() => onAnalyze(file)}
              disabled={isAnalyzing}
              className="flex-1 rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-800 disabled:opacity-60"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Prescription"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PrescriptionUploader;
