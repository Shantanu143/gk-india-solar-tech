import { useState } from "react";
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { GpsCaptureState, GpsLocation } from "@/features/surveys/types/survey";

interface LocationCaptureProps {
  value?: GpsLocation;
  onCapture: (location: GpsLocation) => void;
}

/** Wraps the browser Geolocation API — every state it can produce gets its own UI, not just success. */
export function LocationCapture({ value, onCapture }: LocationCaptureProps) {
  const [state, setState] = useState<GpsCaptureState>(value ? "captured" : "idle");

  function handleCapture() {
    if (!("geolocation" in navigator)) {
      setState("error");
      return;
    }
    setState("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState("captured");
        onCapture({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          capturedAt: new Date().toISOString(),
        });
      },
      (error) => {
        setState(error.code === error.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-navy">GPS Location</p>

      {value && state === "captured" ? (
        <div className="mt-2 flex items-start gap-2 text-sm text-foreground/80">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
          <div>
            <p>Latitude: {value.latitude.toFixed(6)}</p>
            <p>Longitude: {value.longitude.toFixed(6)}</p>
          </div>
        </div>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          {state === "denied"
            ? "Location permission was denied. Enable it in your browser settings to capture GPS."
            : state === "error"
              ? "Couldn't get your location. Check your device's location settings and try again."
              : "Capture the exact site coordinates for this survey."}
        </p>
      )}

      {(state === "denied" || state === "error") && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-error">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          {state === "denied" ? "Permission denied" : "Location error"}
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-3 gap-1.5"
        disabled={state === "requesting"}
        onClick={handleCapture}
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        {state === "requesting" ? "Requesting…" : value ? "Recapture Location" : "Capture Location"}
      </Button>
    </div>
  );
}
