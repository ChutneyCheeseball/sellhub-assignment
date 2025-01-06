// Generic response for any database errors encountered in handlers
export const databaseError = { ok: false, message: "Database error" };

// Generic 404 response for items not existing in database
export const notFoundError = { ok: false, message: "Not found" };
