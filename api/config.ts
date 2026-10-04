export default {
  fetch() {
    return Response.json({
      dataMode: process.env.DATA_MODE || 'demo',
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      productionReadiness: {
        sourceAdapters: false,
        persistentStore: false,
        auditTrail: false,
        humanApproval: true
      }
    });
  }
};
