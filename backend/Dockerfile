FROM oven/bun:1 as base

WORKDIR /usr/src/app

# Copy dependencies first
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

# IMPORTANT: run file directly, NOT bun run
CMD ["bun", "src/server.ts"]