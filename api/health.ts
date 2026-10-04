export default {
  fetch() {
    return Response.json({
      status: 'ok',
      service: 'swarm-intel-api',
      mode: process.env.DATA_MODE || 'demo',
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      timestamp: new Date().toISOString()
    });
  }
};
