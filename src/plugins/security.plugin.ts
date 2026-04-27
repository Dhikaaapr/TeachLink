import { Elysia } from 'elysia'

export const securityHeaders = new Elysia()
  .onBeforeHandle(({ set }) => {
    Object.assign(set.headers, {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Strict-Transport-Security':
        'max-age=63072000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'"
    })
  })