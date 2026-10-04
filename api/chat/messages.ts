const demoMessages = [
  { id: 'm1', sender: 'SYSTEM', role: 'system', text: 'SWARM INTEL demo channel online. Synthetic data is enabled.', timestamp: new Date().toISOString() },
  { id: 'm2', sender: 'Nexus_Core', role: 'operator', text: 'Demo channel ready. Production channels require authenticated operators.', timestamp: new Date().toISOString(), avatarColor: 'bg-indigo-600' }
];

export default {
  async fetch(request: Request) {
    if (request.method === 'GET') return Response.json(demoMessages);
    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (typeof body.text !== 'string' || !body.text.trim()) return Response.json({ error: 'Text is required' }, { status: 400 });
      const message = { id: 'm_' + Date.now(), sender: body.sender || 'Anonymous', role: body.role || 'user', text: body.text.trim(), timestamp: new Date().toISOString(), avatarColor: 'bg-emerald-600' };
      return Response.json({ success: true, message, demoReply: { id: 'm_demo_' + Date.now(), sender: 'Sentry_Zero', role: 'operator', text: 'Demo response: validate source freshness and human approval before acting on this signal.', timestamp: new Date().toISOString(), avatarColor: 'bg-teal-600' } });
    }
    return new Response('Method Not Allowed', { status: 405 });
  }
};
