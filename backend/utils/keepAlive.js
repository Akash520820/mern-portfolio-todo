// Render's free tier spins a web service down after ~15 minutes of no
// incoming HTTP traffic. Pinging our own /api/health route every 5 minutes
// from inside the running process keeps the instance "warm" without
// depending on an external cron job (GitHub Actions schedules can be
// delayed or silently disabled after periods of repo inactivity).
//
// RENDER_EXTERNAL_URL is injected automatically by Render for every web
// service (e.g. "https://your-app.onrender.com") - no need to set it
// yourself. It only exists once deployed, so this is skipped locally.

const PING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const startKeepAlive = () => {
    const selfUrl = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;

    if (!selfUrl) {
        console.log('Keep-alive skipped: no RENDER_EXTERNAL_URL / SELF_URL set (probably running locally).');
        return;
    }

    const healthUrl = `${selfUrl.replace(/\/$/, '')}/api/health`;

    setInterval(async () => {
        try {
            const res = await fetch(healthUrl);
            console.log(`Keep-alive ping -> ${res.status} (${new Date().toISOString()})`);
        } catch (err) {
            console.log('Keep-alive ping failed:', err.message);
        }
    }, PING_INTERVAL_MS);

    console.log(`Keep-alive started: pinging ${healthUrl} every 5 minutes.`);
};

module.exports = startKeepAlive;