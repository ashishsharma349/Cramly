function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
  const maxAge = days * 24 * 60 * 60;
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

function isValidUUID(uuid) {
  return typeof uuid === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

export function getOrCreateGuestId() {
  const COOKIE_NAME = 'cramly_guest_id';
  const STORAGE_KEY = 'cramly_guest_id';

  let localId = null;
  try {
    localId = localStorage.getItem(STORAGE_KEY);
    if (localId && !isValidUUID(localId)) localId = null;
  } catch (e) {
    // localStorage disabled or restricted
  }

  let cookieId = getCookie(COOKIE_NAME);
  if (cookieId && !isValidUUID(cookieId)) cookieId = null;

  let guestId = null;

  if (localId && cookieId) {
    guestId = localId;
  } else if (localId && !cookieId) {
    guestId = localId;
    setCookie(COOKIE_NAME, guestId, 365);
  } else if (!localId && cookieId) {
    guestId = cookieId;
    try {
      localStorage.setItem(STORAGE_KEY, guestId);
    } catch (e) {}
  } else {
    guestId = crypto.randomUUID();
    try {
      localStorage.setItem(STORAGE_KEY, guestId);
    } catch (e) {}
    setCookie(COOKIE_NAME, guestId, 365);
  }

  return guestId;
}
