FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Copy dependencies first to leverage Docker cache
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose port (Elysia usually listens on 3000)
EXPOSE 3000/tcp

# Start the application
CMD ["bun", "run", "src/server.ts"]
