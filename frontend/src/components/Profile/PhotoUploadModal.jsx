import { useEffect, useRef, useState } from "react";
import useToast from "../../hooks/useToast";
import useProfile from "../../hooks/useProfile";
import { API_URL } from "../../config/api";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Please choose a JPG, JPEG, PNG, or WEBP image.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "That image is larger than 5MB. Please choose a smaller file.";
  }
  return null;
};

// "choice" -> pick take photo / upload from device
// "camera" -> live camera preview, ready to capture
// "preview" -> chosen/captured image preview, ready to confirm
// "uploading" -> saving to the server
const PhotoUploadModal = ({ open, onClose }) => {
  const [step, setStep] = useState("choice");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = useToast();
  const { updateProfileImage } = useProfile();

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const resetState = () => {
    stopCamera();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
    setCameraError(null);
    setStep("choice");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (step === "uploading") return; // don't allow closing mid-upload
    resetState();
    onClose();
  };

  useEffect(() => {
    if (!open) resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    setCameraError(null);
    setStep("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
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

    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          showToast("Couldn't capture that photo. Please try again.", "error");
          return;
        }
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        const error = validateFile(file);
        if (error) {
          showToast(error, "error");
          return;
        }
        stopCamera();
        setPreviewFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        setStep("preview");
      },
      "image/jpeg",
      0.92
    );
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      showToast(error, "error");
      event.target.value = "";
      return;
    }

    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep("preview");
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
    setStep("choice");
  };

  const handleConfirm = async () => {
    if (!previewFile) return;
    setStep("uploading");
    try {
      const formData = new FormData();
      formData.append("photo", previewFile);

      const response = await fetch(`${API_URL}/users/me/photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Upload failed");

      updateProfileImage(data.profileImage);
      showToast("Profile picture updated!", "success");
      resetState();
      onClose();
    } catch (err) {
      console.error("Photo upload error:", err);
      showToast(err.message || "Something went wrong while uploading. Please try again.", "error");
      setStep("preview");
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Update profile picture"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-md rounded-t-3xl border border-red-100 bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {step === "choice" && "Update profile picture"}
            {step === "camera" && "Take a photo"}
            {step === "preview" && "Preview"}
            {step === "uploading" && "Saving..."}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={step === "uploading"}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {step === "choice" && (
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={startCamera}
              className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3.5 text-left font-semibold text-red-700 transition hover:bg-red-50"
            >
              <span className="text-xl" aria-hidden="true">📷</span> Take Photo
            </button>
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3.5 text-left font-semibold text-red-700 shadow-sm transition hover:bg-red-50">
              <span className="text-xl" aria-hidden="true">📁</span> Upload from Device
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
            <p className="pt-1 text-center text-xs text-slate-500">JPG, JPEG, PNG or WEBP · up to 5MB</p>
          </div>
        )}

        {step === "camera" && (
          <div className="mt-5 space-y-4">
            {cameraError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">{cameraError}</div>
            ) : (
              <div className="overflow-hidden rounded-xl bg-slate-900">
                <video ref={videoRef} playsInline muted className="aspect-square w-full object-cover" />
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <button type="button" onClick={handleRetake} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50">Back</button>
              {!cameraError && (
                <button type="button" onClick={capturePhoto} className="flex-1 rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-800">Capture</button>
              )}
            </div>
          </div>
        )}

        {(step === "preview" || step === "uploading") && (
          <div className="mt-5 space-y-4">
            <div className="mx-auto grid h-48 w-48 place-items-center overflow-hidden rounded-full border-4 border-red-100 bg-slate-50">
              {previewUrl && <img src={previewUrl} alt="Selected profile preview" className="h-full w-full object-cover" />}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetake}
                disabled={step === "uploading"}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Choose different photo
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={step === "uploading"}
                className="flex-1 rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-800 disabled:opacity-60"
              >
                {step === "uploading" ? "Saving..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadModal;
