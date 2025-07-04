import fetch from 'node-fetch';

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) return res.status(400).send('Missing code');

  const params = new URLSearchParams();
  params.append('client_id', '1389685428332003529'); // استبدلها
  params.append('client_secret', 'xdERXlPC-cqoZnH8PU8mODHYndYCbmzD'); // استبدلها
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'https://your-vercel-site.vercel.app/api/callback');

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const tokenData = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`
      }
    });

    const user = await userRes.json();

    // Send userId to bot server
    await fetch('https://your-bot-server.com/api/senddm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });

    res.status(200).send("✅ حسابك اتربط بنجاح! يمكنك العودة إلى ديسكورد.");
  } catch (error) {
    console.error('OAuth2 error:', error);
    res.status(500).send('حدث خطأ أثناء الربط.');
  }
}
