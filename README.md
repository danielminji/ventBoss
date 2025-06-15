# 💼 Boss Vent – Anonymous Voice-to-Feedback App

**Boss Vent** is a web application that allows employees to safely and anonymously vent about their managers. It converts emotional voice venting into constructive feedback and sends it to the manager's email—without revealing the identity of the employee.

---

## 🧠 Problem Statement

Employees often feel uncomfortable giving direct feedback to their managers. Fear of judgment, retaliation, or awkwardness leads to silence. This app solves that by enabling:
- Anonymous expression through voice,
- Real-time transcription,
- Professional feedback transformation,
- Private and secure email delivery.

---

## 🚀 Features

### 🎤 Voice-to-Text Venting
- Uses the **Web Speech API** to transcribe live speech.
- Dynamic **Boss Avatar** reacts with emotion during the vent.

### 📝 Feedback Generation
- Emotional transcripts are **converted to constructive feedback**.
- Uses custom NLP logic in `feedbackUtils.ts`.

### 📧 Anonymous Email Delivery
- Sends feedback via **EmailJS** (client-side).
- No user data is stored or logged.

### 🧑‍💻 Guided User Flow
- Upload boss photo, enter email, start venting.
- Feedback sent anonymously.
- Session is cleared for privacy.

---

## 🛠️ Tech Stack

| Category           | Stack / Library                     |
|--------------------|-------------------------------------|
| **Frontend**       | React (TypeScript) + Vite           |
| **Styling**        | Tailwind CSS, shadcn/ui             |
| **UI Primitives**  | Radix UI via shadcn/ui              |
| **Forms**          | React Hook Form, Zod                |
| **Routing**        | React Router DOM                    |
| **State/Data**     | React State, TanStack React Query   |
| **Email**          | EmailJS (no backend needed)         |
| **Speech API**     | Browser Web Speech API              |
| **Icons/Utils**    | Lucide React, date-fns, Sonner      |
| **Testing**        | Vitest, @testing-library/react      |
| **Linting**        | ESLint, PostCSS                     |

---

## 🧪 Project Structure

```bash
src/
├── components/
│   ├── AvatarUpload.tsx         # Avatar upload logic
│   ├── BossAvatar.tsx           # Animated boss avatar
│   └── ui/                      # UI primitives from shadcn
├── lib/
│   ├── feedbackUtils.ts         # Feedback transformation logic
│   └── feedbackUtils.test.ts    # Unit tests
├── pages/
│   └── Index.tsx                # Main app logic
public/
└── favicon.ico                  # Angry employee icon
🧩 User Flow
👤 User enters boss's email and uploads a photo.

🎙️ Clicks "Start Venting" – voice is transcribed live.

🤖 Boss avatar reacts while user talks.

📬 Transcript is converted into professional feedback.

✉️ Email is sent anonymously to the boss.

🔁 Session resets.

🧑‍🎓 Example User Story
“As an employee, I want to vent about my boss without fear of reprisal. I upload my boss’s photo, enter their email, and start talking. The avatar reacts in real time. After I finish, my words are turned into a constructive email sent anonymously to my boss.”

🔐 Privacy & Security
All data is handled client-side.

No recordings or emails are stored.

Only the feedback report is sent anonymously via EmailJS.

🧠 Future Enhancements
✅ Sentiment analysis for smarter feedback tone.

📝 Allow users to review/edit feedback before sending.

📊 HR dashboard for enterprise version.

🧾 Support multiple recipients.

📦 Installation
bash
Copy
Edit

mode 1:
git clone https://github.com/yourusername/boss-vent.git
cd boss-vent
npm install
npm run dev

mode 2:
download zip file
extract file
open folder in code editor
run npm install
run npm run dec
🧾 License
MIT © 2025 danielminji

🙏 Acknowledgements
shadcn/ui

EmailJS

Web Speech API
