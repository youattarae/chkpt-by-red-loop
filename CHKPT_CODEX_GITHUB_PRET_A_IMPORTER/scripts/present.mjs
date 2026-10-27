// Serve compiled assets without development reloads, on macOS and Windows.
// This setting does not enable private-demo access or change server permissions.
process.env.NODE_ENV = 'production';
await import('../server.ts');
