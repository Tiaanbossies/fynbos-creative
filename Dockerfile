# syntax=docker/dockerfile:1

# Static build served by Nginx (build brief §B.8) — not Vercel/Netlify.

# ---------- build ----------
FROM node:24-alpine AS build

WORKDIR /app

# Dependencies first: this layer is cached unless the lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* at BUILD time, so this must be set before `npm run
# build` — a runtime env var is too late and does nothing.
ARG VITE_FORMSPREE_ID
ENV VITE_FORMSPREE_ID=$VITE_FORMSPREE_ID

# Fail loudly rather than shipping a silently broken contact form. Without the
# ID the form still renders but every submission shows the WhatsApp/email
# fallback instead of sending — an image that looks fine and quietly loses
# enquiries is the worst outcome for a lead-generation site.
RUN test -n "$VITE_FORMSPREE_ID" || { \
      echo "ERROR: VITE_FORMSPREE_ID build arg is empty."; \
      echo "Build with: docker build --build-arg VITE_FORMSPREE_ID=xxxxxxxx ."; \
      exit 1; \
    }

RUN npm run build

# ---------- serve ----------
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
