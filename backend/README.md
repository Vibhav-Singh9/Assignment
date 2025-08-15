Task Forge Backend

Express + MongoDB (Mongoose) + JWT + Multer + Swagger.

Setup

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

Swagger docs at `/api-docs`.

Testing

```bash
npm test
npm run test:coverage
```

Docker

```bash
docker-compose up --build
```

Storage
- Set `STORAGE_TYPE=local` or `s3`.
- Local uploads are served under `/uploads`.


