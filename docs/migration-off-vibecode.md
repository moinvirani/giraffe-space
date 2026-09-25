# Giraffe Space — off Vibecode (2026-09-25)

Branch: `migrate/off-vibecode` (not merged to `main` yet).

## Where things live now
| Piece | Where |
|---|---|
| App builds | Expo project `@mvirani/giraffe-space` (`9177a12b-…`), Apple team 3C2XMCM3L2 |
| Public build config | EAS env vars, `production` environment: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_REVENUECAT_APPLE_KEY` |
| Server code | Supabase project `gpltetbdcvryosqcyrgz` (Singapore): Edge Functions `gigi-chat`, `delete-user` |
| Server secrets | Supabase function secrets: `OPENAI_API_KEY` (Personal org), `REVENUECAT_SECRET_KEY` |
| Store | App Store Connect app 6758386322 (bundle `com.vibecode.giraffespace.3zxdgq`, unchanged) |

## What changed
- **Gigi** → `gigi-chat` Edge Function. The OpenAI key and system prompt are server-side;
  free users get 10 messages per UTC day, counted in `public.gigi_usage`; premium is read
  from RevenueCat by Supabase user id. Before: key compiled into the app, "limit" counted
  messages in the current chat on the device.
- **RevenueCat identify**: the app now calls `Purchases.logIn(<supabase user id>)` on
  sign-in/sign-up and at launch. Before, purchases were `ANONYMOUS`.
- **Profile sync** writes `user_profiles` directly as the signed-in user. The Hono backend
  (never deployed; its `/users` + `/analytics` endpoints were unauthenticated) is deleted.
- **delete-user** source is now in the repo and also deletes the user's `user_profiles` row.
- Vibecode SDK + its RN/expo-asset patches removed; plain metro config.
- Link scheme `vibecode://` → `giraffespace://` (both allowed in Supabase Auth redirect URLs).
- Version 1.1.1 (17). 1.1.0 (14) is the live App Store version. Build 15 was rejected by
  App Store Connect (90725: iOS 18.5 SDK; iOS 26 SDK now required), so production builds use
  EAS image `latest` (Xcode 26). Build 16 then failed to compile: Xcode 26.4 rejects the
  fmt library RN 0.79 vendors. `plugins/withFmtCxx17.js` compiles only the fmt pod as C++17
  (remove it on Expo SDK 56+). Build 17 compiled with both fixes.

## Still to do (owner)
1. **Run the migration** in Supabase SQL editor (Giraffe project):
   `supabase/migrations/20260925120000_gigi_usage_and_profile_rls.sql`
   — copy it with: `pbcopy < ~/"Moin Startups/giraffe-space/supabase/migrations/20260925120000_gigi_usage_and_profile_rls.sql"`
   Until this runs, Gigi answers with the offline fallback for free users (the usage
   counter table doesn't exist yet) and `user_profiles` stays world-writable.
2. **Test build 17 on TestFlight**: sign up, Gigi reply, "N left" counter goes down,
   11th message shows the upgrade prompt, sandbox purchase → unlimited, password reset
   email opens the app, delete account.
3. **Merge** `migrate/off-vibecode` into `main` once it passes.
4. After cancelling Vibecode: rotate the Supabase **service role** key (Vibecode's app env held
   it as an `EXPO_PUBLIC_SUPABASE_SERVICE…` variable; the code never read it, so it was never
   compiled into the app, but Vibecode had it), and revoke the old Gigi OpenAI key if it was yours.
5. Check which key `REVENUECAT_SECRET_KEY` holds: RevenueCat → Giraffe Space → API keys
   listed no secret keys. A key from another RevenueCat project makes everyone "free".
   Function logs show `RevenueCat lookup failed: <status>` if the key is rejected.

## Useful commands
```bash
supabase functions deploy gigi-chat --project-ref gpltetbdcvryosqcyrgz --no-verify-jwt --use-api
npx eas-cli@latest build -p ios --profile production
npx eas-cli@latest submit -p ios --latest
```
