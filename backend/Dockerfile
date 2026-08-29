# Backend — Express + Mongoose API
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (separate layer so `npm ci` is cached
# and only re-runs when package*.json actually change, not on every
# source edit)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Now copy the actual application code
COPY . .

# Render (and most platforms) inject their own PORT at runtime; this is
# just the default for local `docker run`/compose use.
ENV PORT=5000
EXPOSE 5000

# Basic container-level health check hitting the same route the
# GitHub Actions keep-alive workflow and Render's own health check use.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
