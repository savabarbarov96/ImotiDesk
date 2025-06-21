# Deployment Guide

## Environment Variables Setup

### For VPS Deployment:

1. **Create environment file on your VPS:**
   ```bash
   # Create .env.production file
   nano .env.production
   ```

2. **Add the following variables:**
   ```env
   VITE_SUPABASE_URL=https://frfplhezrpppfzfungwk.supabase.co
   VITE_SUPABASE_ANON_KEY=your_production_anon_key_here
   ```

3. **Build the application:**
   ```bash
   npm run build
   # or
   yarn build
   # or
   bun build
   ```

4. **Set environment variables in your deployment script:**
   ```bash
   export VITE_SUPABASE_URL=https://frfplhezrpppfzfungwk.supabase.co
   export VITE_SUPABASE_ANON_KEY=your_production_anon_key_here
   npm run build
   ```

### Security Notes:

- Never commit `.env.local` or `.env.production` files
- Rotate your Supabase keys regularly
- Use different keys for development and production
- Ensure your VPS environment variables are properly secured

### Supabase Project Configuration:

Your current project ID: `frfplhezrpppfzfungwk`

Make sure to:
1. Update your Supabase project settings
2. Configure proper RLS policies
3. Set up proper authentication rules
4. Configure CORS settings for your production domain

### VPS Deployment Steps:

1. **Clone your repository on the VPS:**
   ```bash
   git clone your-repo-url
   cd ImotiDesk/ImotiDesk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set environment variables:**
   ```bash
   export VITE_SUPABASE_URL=https://frfplhezrpppfzfungwk.supabase.co
   export VITE_SUPABASE_ANON_KEY=your_production_key
   ```

4. **Build the application:**
   ```bash
   npm run build
   ```

5. **Serve the built files using a web server (nginx, apache, etc.)**

### Environment Variable Security:

For production deployment, consider using:
- Docker secrets
- Kubernetes secrets
- Cloud provider secret management services
- Server environment variables (not files)

This ensures your sensitive data is properly protected in production. 