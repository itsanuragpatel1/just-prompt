# Just Prompt  
**AI Image Editor & Generator — Powered by Prompts & Presets**

Just Prompt is an **AI-powered image editing and image generation platform** where users can create stunning visuals using **natural language prompts** or **one-click trending presets**.  
Upload a photo, choose a style, or write a prompt — **AI does the rest**.

---

## ✨  Features

###  🧠  Prompt-Based Editing  
Edit or generate images using **simple natural language prompts**.  
No complex tools — just describe what you want.

---

### 🎭 Trending Presets  
Choose from **multiple trending AI presets**.  
Click a preset, upload your image, and instantly get a transformed result.

---

### 🧑 Fix Face (Smart Face Recovery)  
While editing images, facial details may sometimes get distorted.  
**Fix Face restores your original facial identity** by intelligently correcting and reapplying your real face onto the edited image, ensuring **natural and realistic results**.

---

### 🔍 Upscale (HD Quality Boost)  
Enhance image resolution and clarity using AI.  
Perfect for high-quality downloads and professional use.

---

### ⚡ Auto (AI-Suggested Edits)  
Let AI automatically decide the best edits for your image.  
One click — no prompt required.

---

### 🔁 Re-run Images  
Re-generate images using the **same prompt** to get different variations.

---

### 🕒 Version History  
Every edit is saved automatically.  
Switch between previous versions anytime within a project.

---

### 💾 Project System  
All edits are organized into **projects**.  
Each project maintains images, edit history, and versions in one place.

---

##  Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- Context API

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Multer (Image Uploads)

### AI & Services
- Cloudinary (Image Storage)
- Google GenAI
- Photocraft AI (Fix Face)
- Claid AI (Upscale)
- Nodemailer (OTP Email Verification)


###  Authentication & Security

- **Google OAuth 2.0 Login** for fast and secure sign-in  
- **Email OTP Verification System** for account validation  
- JWT-based authentication stored in **HTTP-only cookies**  
- Protected routes for all image and project operations

---

##  How It Works

1. Sign up using **Google OAuth** or **Email + OTP**
2. Select a **preset** or write a **prompt**
3. Upload an image (optional)
4. Click **Generate / Edit**
5. AI processes the image
6. Download, re-run, or refine the result

---

##  Project Structure

```text

just-prompt/
├─ client/                 # React frontend (Vite) 
│   ├─ public/             # Static assets (logo, index.html, etc.)
│   ├─ src/                # React source files
│   │   ├─ components/     # Reusable UI components
│   │   ├─ context/        # Authentication context & protected route
│   │   ├─ pages/          # Top-level page components (Login, Profile, Gallery, etc.)
│   │   ├─ utils/          # Utility modules (e.g. API helpers)
│   │   └─ App.jsx, main.jsx, etc.
│   ├─ package.json        # Project metadata and scripts
│   ├─ vite.config.js      # Vite config (build tool)
│   └─ ... other config files (.gitignore, etc.)
│
└─ server/                 # Node.js/Express backend
    ├─ src/
    │   ├─ config/        # Configuration (DB connection, dotenv)
    │   │   ├─ db.js      # MongoDB connection (Mongoose)
    │   │   └─ loadEnv.js # Loads .env file
    │   ├─ controllers/   # Route handlers
    │   │   ├─ authController.js   # Signup, login, OTP, Google auth
    │   │   ├─ userController.js   # Profile, projects, images
    │   │   ├─ imageController.js  # Generate, edit, fix-face, upscale
    │   │   ├─ presetController.js # Add/get presets
    │   │   └─ projectController.js# Get project details
    │   ├─ middlewares/   # Express middleware
    │   │   ├─ authMiddleware.js   # JWT verification
    │   │   └─ multerMiddleware.js # File upload (images only)
    │   ├─ models/        # Mongoose data models
    │   │   ├─ userModel.js    # User schema (includes plan, credits, etc.)
    │   │   ├─ projectModel.js # Project schema (type, editHistory, lastImage)
    │   │   ├─ imageModel.js   # Image schema (URL, prompt, type, etc.)
    │   │   ├─ presetModel.js  # Preset schema (prompt & example image)
    │   │   └─ otpModel.js     # OTP schema (email, hashed OTP, expiry)
    │   ├─ routes/        # API routes
    │   │   ├─ authRoutes.js    # /api/auth/* endpoints
    │   │   ├─ userRoutes.js    # /api/user/* endpoints
    │   │   ├─ imageRoutes.js   # /api/image/* endpoints
    │   │   ├─ presetRoutes.js  # /api/preset/* endpoints
    │   │   └─ projectRoutes.js # /api/project/* endpoints
    │   ├─ utils/         # Helper utilities
    │   │   ├─ cloudinary.js    # Uploads image buffer to Cloudinary
    │   │   ├─ sendEmail.js     # Email sender (OTP email template)
    │   │   └─ templates/      # Email templates (e.g., OTP)
    │   ├─ app.js         # Express app setup (middleware & routes)
    │   └─ index.js       # Entry point (connects DB and starts server)
    ├─ package.json      # Server dependencies and scripts
    └─ ... other config files (.gitignore, etc.)
    
```

## Data Models

Just Prompt uses 5 core MongoDB models:

- **User Model** – User profile, auth data, credits, OAuth info
- **Project Model** – Groups images into edit/generate sessions
- **Image Model** – Stores image URLs, prompts, versions, history
- **Preset Model** – Saves reusable prompts and preview image
- **OTP Model** – Handles secure email OTP verification

##  Vision

Just Prompt is built to make **AI image creation simple, fast, and accessible**.  
No learning curve.
No complicated tools.  
Just **Prompt → Upload → Create** 🚀

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (Local or MongoDB Atlas)
- **Cloudinary account** (for image uploads & storage)
- **Google OAuth credentials** (for Google login)
- **Vercel account** (for deployment)

---

### Setup

#### 1. Clone the repository

```
git clone https://github.com/itsanuragpatel1/just-prompt.git
cd just-prompt
```


#### 2. Configure environment variables

Create `.env` files in both `client` and `server` folders.  
Sample for `server/.env`:

```
MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/
CLOUDINARY_URL=cloudinary://API_KEY:SECRET@cloud_name
FLYMY_API_KEY=your_flymy_key
PHOTOCRAFT_API_KEY=your_photocraft_key
CLAID_API_KEY=your_claid_key
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
PORT=3000
```

#### 3. Install dependencies

```bash
cd server
npm install

cd client
npm install
```

#### 4. Run the development servers

**Backend:**

```bash
npm run dev
```

**Frontend:**

```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173)  
The backend will run on [http://localhost:3000](http://localhost:3000) (or your configured port)


## Deployment

Both client and server are configured for deployment on Vercel.  
See `vercel.json` in each folder for build and routing settings.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Author

Anurag Patel – [GitHub](https://github.com/itsanuragpatel1) | [LinkedIn](https://www.linkedin.com/in/itsanuragpatel)
