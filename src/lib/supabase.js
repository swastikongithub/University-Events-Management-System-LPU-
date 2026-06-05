import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseUrl !== 'your-supabase-url-here' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-supabase-anon-key-here';

if (!isConfigured) {
  console.info(
    '📋 ClassFinder running in Demo Mode — Supabase not configured.\n' +
    'To connect a real database, update your .env file with:\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

// Only create a real client if configured; otherwise create a dummy
// The hooks will check isDemoMode() and skip all Supabase calls
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient();

/**
 * Creates a no-op Supabase client that won't make network requests.
 * This prevents crashes when Supabase credentials are not set.
 */
function createDummyClient() {
  const noOp = () => ({});
  const chainable = () =>
    new Proxy(
      {},
      {
        get() {
          return chainable;
        },
        apply() {
          return Promise.resolve({ data: null, error: null });
        },
      }
    );

  return {
    from: () => chainable(),
    channel: () => ({
      on: function () { return this; },
      subscribe: function () { return this; },
    }),
    removeChannel: noOp,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: noOp } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode — configure Supabase to use auth' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode — configure Supabase to use auth' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}
