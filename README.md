# 🎯 AI-Powered Quiz Application with Gemini Integration

<div align="center">

![AI Quiz](https://img.shields.io/badge/AI-Powered%20Quiz-blue?style=for-the-badge&logo=google&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Integration-orange?style=for-the-badge&logo=google&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

**A revolutionary quiz application powered by Google's Gemini AI - Generate unlimited questions on any topic!**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🤖 Gemini Setup](#gemini-ai-integration)

</div>

---

## ✨ Features

### 🤖 **AI-Powered Question Generation**
- **Gemini AI Integration** - Generate unlimited questions using Google's advanced AI
- **Dynamic Content** - Fresh questions every time, no more repetitive quizzes
- **Custom Topics** - Create quizzes on ANY subject you want to learn
- **Difficulty Levels** - Choose from easy, medium, or hard difficulty
- **Smart Prompts** - Add custom instructions for specialized question types

### 🎨 **Modern UI/UX Design**
- **Glassmorphism Design** - Beautiful translucent interface with backdrop blur effects
- **Dark/Light Mode** - Toggle between themes with persistent user preference
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Engaging hover effects and transitions

### 📊 **Advanced Analytics Dashboard**
- **Performance Tracking** - Monitor your progress over time
- **Visual Charts** - Interactive score progression and performance distribution
- **Topic Analysis** - Identify strengths and weaknesses by subject
- **Detailed History** - Review past attempts with timestamps and timing

### 🧠 **Smart Quiz Features**
- **Two Quiz Modes** - Standard Aadhaar quiz and Custom topic generator
- **Progress Indicator** - Real-time completion tracking
- **Instant Feedback** - Visual indicators for correct/incorrect answers
- **Result Analysis** - Comprehensive scoring with improvement suggestions
- **Question Navigation** - Move back and forth between questions

### 💾 **Data Persistence**
- **Local Storage** - All progress saved locally in your browser
- **Detailed Analytics** - Question-by-question performance tracking
- **Export Ready** - Data structured for easy analysis

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key (free from Google AI Studio)
- No additional installations required!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Xenonesis/adhar-quiz-web.git
   cd adhar-quiz-web
   ```

2. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key (it's free!)
   - Copy the generated key

3. **Configure the Application**
   - Open `js/config.js`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
   - Save the file

4. **Open in browser**
   ```bash
   # Simply open index.html in your preferred browser
   # Or use a local server for best experience
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

5. **Start creating quizzes!**
   - Use the standard Aadhaar quiz with AI-generated questions
   - Try the Custom Quiz Generator for any topic
   - View your analytics in the dashboard

---

## 📱 Screenshots

<div align="center">

### 🌅 Light Mode
![Light Mode Quiz](https://via.placeholder.com/800x400/667eea/ffffff?text=Light+Mode+Quiz+Interface)

### 🌙 Dark Mode
![Dark Mode Quiz](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Dark+Mode+Quiz+Interface)

### 📊 Analytics Dashboard
![Dashboard](https://via.placeholder.com/800x400/4CAF50/ffffff?text=Analytics+Dashboard)

</div>

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Google Gemini AI** | Question Generation | Latest API |
| **HTML5** | Structure & Semantics | Latest |
| **CSS3** | Styling & Animations | Latest |
| **JavaScript** | Interactivity & Logic | ES6+ |
| **Chart.js** | Data Visualization | 3.x |
| **LocalStorage** | Data Persistence | Browser API |
| **Fetch API** | AI Integration | Native |

---

## 🤖 Gemini AI Integration

### How It Works
The application uses Google's Gemini AI to generate fresh, relevant questions on demand:

1. **API Integration** - Connects to Gemini Pro model via REST API
2. **Smart Prompting** - Uses carefully crafted prompts for consistent question format
3. **Content Validation** - Ensures all generated questions meet quality standards
4. **Error Handling** - Graceful fallbacks and user-friendly error messages

### Supported Topics
Generate quizzes on virtually any topic:

- 🏛️ **Aadhaar & UIDAI** - Default specialized content
- 💻 **Programming** - JavaScript, Python, Java, etc.
- 🔬 **Science** - Physics, Chemistry, Biology
- 📚 **History** - World history, specific periods
- 🌍 **Geography** - Countries, capitals, landmarks
- 🎨 **Arts** - Literature, music, visual arts
- 📊 **Business** - Management, finance, marketing
- 🏥 **Medicine** - Anatomy, procedures, terminology
- And literally **ANY** topic you can think of!

### Custom Quiz Features
- **Topic Specification** - Enter any subject or field
- **Difficulty Control** - Easy, medium, or hard questions
- **Question Count** - 5 to 25 questions per quiz
- **Custom Instructions** - Add specific requirements or focus areas
- **Instant Generation** - Questions created in seconds

---

## 🎯 Key Highlights

### 🏆 **Performance Metrics**
- **Real-time Progress** tracking with visual indicators
- **Comprehensive Analytics** with score trends and improvements
- **Topic-wise Analysis** to identify learning gaps
- **Time Management** tracking for exam preparation

### 🎨 **User Experience**
- **Intuitive Navigation** with breadcrumb progress
- **Accessibility Features** with proper contrast and focus states
- **Mobile-First Design** ensuring great experience on all devices
- **Offline Capability** with local data storage

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### 💡 Ideas for Contribution
- Enhance AI prompt engineering for better questions
- Add support for different question types (true/false, fill-in-the-blank)
- Implement question caching for offline use
- Add multi-language support
- Create study materials section
- Implement user accounts and cloud sync
- Add collaborative quiz creation features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

**Aditya Kumar Tiwari**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Xenonesis)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](#)

*Passionate about creating educational technology solutions*

</div>

---

## 🙏 Acknowledgments

- **Google** for providing the powerful Gemini AI API
- **UIDAI** for providing comprehensive exam guidelines
- **Chart.js** community for excellent documentation
- **MDN Web Docs** for web standards reference
- **GitHub** for hosting and collaboration tools
- **Google AI Studio** for making AI accessible to developers

---

<div align="center">

### ⭐ Star this repository if you love AI-powered learning!

**Made with ❤️ and 🤖 AI for learners everywhere**

---

## 🔧 API Configuration

For detailed setup instructions, see [SETUP.md](SETUP.md)

**Important:** Keep your API key secure and never commit it to version control!

</div>