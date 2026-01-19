# 🚀 Production Deployment Guide - Kitchen Voyager OS

## Pre-Deployment Checklist

### ✅ Environment Variables
Ensure all required environment variables are set:

```env
# Required
MONGODB_URI=mongodb+srv://your_connection_string
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secure_random_secret_key

# Recommended (for AI features)
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### ✅ Build Verification
```powershell
npm run build
npm start
```

Test the production build locally before deploying.

## Security Considerations

### 1. Environment Variables
- ✅ Never commit `.env.local` to version control
- ✅ Use secure, randomly generated secrets for `NEXTAUTH_SECRET`
- ✅ Rotate API keys periodically
- ✅ Use environment-specific configurations

### 2. Database Security
- ✅ MongoDB connection uses TLS/SSL
- ✅ Database user has minimal required permissions
- ✅ Regular database backups configured
- ✅ IP whitelist configured in MongoDB Atlas

### 3. Authentication
- ✅ NextAuth.js handles session management securely
- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ Admin credentials should be changed from defaults
- ✅ Consider enabling 2FA for admin accounts

## Deployment Platforms

### Vercel (Recommended)
```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables can be set in Vercel dashboard under Settings > Environment Variables.

### Netlify
```powershell
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker
```dockerfile
# Dockerfile example
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

## Performance Optimization

### 1. Image Optimization
- ✅ Uses Next.js Image component for automatic optimization
- ✅ Lazy loading implemented for off-screen components
- ✅ GSAP animations are optimized with `will-change`

### 2. Code Splitting
- ✅ Automatic code splitting via Next.js
- ✅ Dynamic imports for heavy components (modals, editor)
- ✅ Tree shaking enabled in production builds

### 3. Caching Strategy
```javascript
// Recommended cache headers
{
  "Cache-Control": "public, max-age=31536000, immutable" // Static assets
  "Cache-Control": "s-maxage=60, stale-while-revalidate" // API routes
}
```

## Monitoring & Error Tracking

### Recommended Services
1. **Sentry** - Error tracking and performance monitoring
2. **Vercel Analytics** - Web vitals and user analytics
3. **MongoDB Atlas Monitoring** - Database performance

### Implementation Example
```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  });
}
```

## Database Considerations

### Indexes
Ensure these indexes exist for optimal performance:

```javascript
// Projects collection
db.projects.createIndex({ owner: 1, createdAt: -1 })
db.projects.createIndex({ status: 1 })

// Kitchens collection
db.kitchens.createIndex({ projectId: 1 })
db.kitchens.createIndex({ userId: 1 })

// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
```

### Connection Pooling
The application uses mongoose with connection pooling configured in `src/lib/dbConnect.ts`:
- Connection timeout: 5000ms
- Socket timeout: 5000ms
- Server selection timeout: 5000ms

## API Rate Limiting

Consider implementing rate limiting for production:

```typescript
// Example with next-rate-limit
import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function middleware(request: Request) {
  try {
    await limiter.check(10, 'CACHE_TOKEN'); // 10 requests per minute
  } catch {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

## Backup Strategy

### Database Backups
1. **Automated backups** via MongoDB Atlas (enabled by default)
2. **Retention period**: 7 days (configure based on needs)
3. **Point-in-time recovery**: Available on M10+ clusters

### Application Backups
1. Source code: Version controlled in Git
2. Environment variables: Document separately (encrypted)
3. User uploads (if any): Store in S3 or similar with versioning

## Health Checks

Create a health check endpoint:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
```

## Post-Deployment Verification

### 1. Smoke Tests
- [ ] Homepage loads correctly
- [ ] Login/Authentication works
- [ ] Dashboard displays projects
- [ ] Kitchen editor opens and functions
- [ ] AI generation works (or shows mock data)
- [ ] Theme switching works
- [ ] Mobile responsiveness verified

### 2. Performance Metrics
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Cumulative Layout Shift (CLS) < 0.1

### 3. Security Scan
- [ ] Run `npm audit` and fix critical vulnerabilities
- [ ] Check for exposed secrets
- [ ] Verify HTTPS is enforced
- [ ] Test authentication flows

## Scaling Considerations

### Horizontal Scaling
- Next.js supports horizontal scaling out of the box
- MongoDB Atlas auto-scales based on load
- Consider CDN for static assets (Vercel provides this)

### Database Scaling
- M0 (Free): Development only
- M10: Small production apps (~100 users)
- M30: Medium apps (~1000 users)
- M50+: Large scale applications

## Rollback Plan

If deployment fails:

1. **Vercel/Netlify**: Use built-in rollback feature
2. **Docker**: Keep previous image tagged and ready
3. **Database**: Use point-in-time recovery if schema changed
4. **Git**: Revert commit and redeploy

## Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Check error logs and fix issues
- [ ] Monthly: Review and update dependencies
- [ ] Quarterly: Security audit and penetration testing
- [ ] Annually: Performance optimization review

### Update Strategy
```powershell
# Check for outdated packages
npm outdated

# Update non-breaking changes
npm update

# Update major versions (test thoroughly)
npm install <package>@latest
```

## Contact & Emergency

- **Production Issues**: Check error logs first
- **Database Issues**: MongoDB Atlas support portal
- **Security Incidents**: Immediately rotate credentials and investigate

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-19  
**Maintainer**: Voyager OS Team
