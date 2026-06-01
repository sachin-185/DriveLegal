export function register() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('DriveLegal Offline PWA Service Worker Registered! Cache status: SYNCED.', reg.scope);
        })
        .catch((err) => {
          console.error('DriveLegal PWA Service Worker Registration Failed:', err);
        });
    });
  }
}
