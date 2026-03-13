const Timer = (() => {

  const TEST_MODE = new URLSearchParams(window.location.search).has('test');
  let intervalId  = null;

  function getTarget() {
    if (TEST_MODE) return new Date(Date.now() + 10 * 1000);
    const t = new Date(new Date().getFullYear(), 2, 14, 0, 0, 0);
    if (Date.now() >= t) t.setFullYear(t.getFullYear() + 1);
    return t;
  }

  const TARGET = getTarget();
  function pad(n) { return String(n).padStart(2, '0'); }

  function tick(onZero) {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      ['t-days','t-hours','t-mins','t-secs'].forEach(id => {
        document.getElementById(id).textContent = '00';
      });
      stop();
      onZero();
      return;
    }
    const s = Math.floor(diff / 1000);
    document.getElementById('t-days').textContent  = pad(Math.floor(s / 86400));
    document.getElementById('t-hours').textContent = pad(Math.floor((s % 86400) / 3600));
    document.getElementById('t-mins').textContent  = pad(Math.floor((s % 3600) / 60));
    document.getElementById('t-secs').textContent  = pad(s % 60);
  }

  function start(onZero) {
    tick(onZero);
    intervalId = setInterval(() => tick(onZero), 1000);
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  return { start, stop };
})();
