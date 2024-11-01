
# Video Sharing Platform

## Important

**lol Vercel’s request body limit is around 4 MB for serverless functions.**  
Unless I change the deployment server, the video upload limit will remain at **4MB**.

## Currently Under Development

A platform where users can upload and showcase their videos, allowing others to discover and engage with their content. Share your creativity and connect with a community that appreciates your unique perspective on video entertainment.

- **Accepted Formats**: `mp4`, `mov`, `avi`, `mkv`, `wmv`, `flv`
- **File Size Limit**: 100MB

---

### Environment Variables

#### Backend (`server/.env`):
```plaintext
NODEMAIL_APP_PASSWORD=
MONGODB_URL=
FRONTEND_URL=
TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`frontend/.env`):
```plaintext
REACT_APP_BACKEND_URL=
```

---

### URLs

- **Frontend URL**: [https://vido-sphere-frontend.vercel.app](https://vido-sphere-frontend.vercel.app)
- **Backend URL**: [https://vido-sphere-api.vercel.app](https://vido-sphere-api.vercel.app)

---

This repository is under active development. Stay tuned for updates!