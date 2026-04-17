# SunSeating - Run Instructions

The project is split into two folders: `server` (Backend) and `client` (Frontend). Follow these steps to run the application locally.

## 1. Start the Backend Server

Open your terminal and navigate to the `server` directory:

```bash
cd "c:\Users\surya\OneDrive\Documents\app for sunseating\server"
node index.js
```

**Expected Output:**
You should see:
- `Database synced`
- `Server running on port 5000`
- `Default Admin Created: admin@sunseating.com / admin123` (on the first run)

Leave this terminal running.

## 2. Start the Frontend Application

Open a second (new) terminal and navigate to the `client` directory:

```bash
cd "c:\Users\surya\OneDrive\Documents\app for sunseating\client"
npm run dev
```

**Expected Output:**
You should see the Vite server start, typically at `http://localhost:5173/`. 
Ctrl+Click or open `http://localhost:5173/` in your browser.

## 3. Test the Application

1. Open your browser to the local URL provided by Vite.
2. **Login as Admin:**
   - Email: `admin@sunseating.com`
   - Password: `admin123`
3. **Explore Dashboard:**
   - Navigate to the **Inventory** panel to add a product or adjust stock.
   - Navigate to the **Attendance** panel to view the reports and export to CSV.
4. **Test Employee Flow:**
   - Log out from the sidebar.
   - You can create an employee using a backend tool like Postman to the `/api/auth/register` endpoint (passing admin token), or temporally remove the `adminMiddleware` from the register route in `server/routes/authRoutes.js` if you'd like to sign up freely. By default, I made it an Admin-only action as requested.
   - *(Optional Shortcut)* To easily access the employee system to test without Postman, edit `client/src/pages/Auth/Login.jsx` temporarily, log in as admin, and navigate directly to `/app`. Or create a small signup button yourself!

## Important Notes
- **Deployment:** The Node.js app can be directly deployed to Render.com, Heroku, or an AWS EC2 instance. The React app is ready to ship to Vercel via standard GitHub integration. Just update API base URLs from `http://localhost:5000` to your real endpoint!
- **Database:** It is using a robust SQLite database located at `server/sunseating.sqlite`. For production, simply change the dialect in `server/config/database.js` to `postgres` and provide your connection URL.
