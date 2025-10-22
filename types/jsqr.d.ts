declare global {
  interface Window {
    jsQR: (
      data: Uint8ClampedArray,
      width: number,
      height: number,
      options?: {
        inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst"
      }
    ) => {
      data: string
      location: {
        topLeftCorner: { x: number; y: number }
        topRightCorner: { x: number; y: number }
        bottomLeftCorner: { x: number; y: number }
        bottomRightCorner: { x: number; y: number }
      }
    } | null
  }
}

export {}
