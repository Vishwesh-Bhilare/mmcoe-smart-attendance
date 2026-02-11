// lib/validators.ts

export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
}

export function isValidLatitude(lat: number): boolean {
  return typeof lat === "number" && lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
  return typeof lng === "number" && lng >= -180 && lng <= 180;
}

export function isValidRadius(radius: number): boolean {
  return typeof radius === "number" && radius > 0 && radius <= 500;
}

export function isNonEmptyString(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSessionCreateInput(body: any): {
  valid: boolean;
  message?: string;
} {
  const { courseId, lat, lng } = body;

  if (!isValidUUID(courseId)) {
    return { valid: false, message: "Invalid course ID" };
  }

  if (!isValidLatitude(lat)) {
    return { valid: false, message: "Invalid latitude" };
  }

  if (!isValidLongitude(lng)) {
    return { valid: false, message: "Invalid longitude" };
  }

  return { valid: true };
}

export function validateAttendanceInput(body: any): {
  valid: boolean;
  message?: string;
} {
  const { qrToken, latitude, longitude } = body;

  if (!isNonEmptyString(qrToken)) {
    return { valid: false, message: "Invalid QR token" };
  }

  if (!isValidLatitude(latitude)) {
    return { valid: false, message: "Invalid latitude" };
  }

  if (!isValidLongitude(longitude)) {
    return { valid: false, message: "Invalid longitude" };
  }

  return { valid: true };
}