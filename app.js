if('serviceWorker' in  navigator){
    const onsuccess = () => console.log('[Service Worker] Registered');
    const onerror = () => console.log('[Service Worker] Registration failed');

    navigator.serviceWorker
      .register('sw.js')
      .then(onsuccess)
      .catch(onerror);
}