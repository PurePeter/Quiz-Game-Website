# Quiz_website_nhom1

Công nghệ dự kiến
Server: Node.js + Socket.IO (WebSocket).
Client: Next.js (React) + Socket.IO-client.
Lưu trữ câu hỏi: File JSON hoặc mảng cứng trong code server.
Công cụ quản lý Git: GitHub/GitLab.
Giao diện: Next.js với Tailwind CSS (hoặc CSS module) để tạo giao diện đẹp, đơn giản.

Thông tin thành viên nhóm 4 người gồm : Phúc , Khoa , Phát , Hoà

## Giới thiệu

Chúng em sử dụng Node.js và Socket.IO cho phần server để đảm bảo tốc độ phản hồi nhanh, đồng thời xây dựng giao diện hiện đại với Next.js và Tailwind CSS. Dữ liệu câu hỏi được lưu trữ linh hoạt bằng file JSON hoặc trực tiếp trong code, giúp dễ dàng mở rộng và cập nhật nội dung.

Dự án này không chỉ là nơi để luyện tập kỹ năng lập trình mà còn là cơ hội để các thành viên học hỏi, phối hợp và phát triển các kỹ năng làm việc nhóm trong môi trường thực tế.

Node.js là một môi trường chạy JavaScript phía máy chủ (server-side). Thay vì chạy JavaScript chỉ trong trình duyệt (như trước đây), Node.js cho phép bạn viết ứng dụng backend bằng JavaScript và chạy trực tiếp trên máy tính của bạn hoặc trên server.

# 🎯 QuizMaster - React Quiz Application

A modern, interactive quiz application built with React featuring user authentication, responsive design, and beautiful UI.

## 🚀 Features

## Giới thiệu

Chúng em sử dụng Node.js và Socket.IO cho phần server để đảm bảo tốc độ phản hồi nhanh, đồng thời xây dựng giao diện hiện đại với Next.js và Tailwind CSS. Dữ liệu câu hỏi được lưu trữ linh hoạt bằng file JSON hoặc trực tiếp trong code, giúp dễ dàng mở rộng và cập nhật nội dung.

### 🎨 UI/UX Features

-   **📱 Fully Responsive** - Mobile-first design approach
-   **🎨 Modern Design** - Gradient backgrounds and smooth animations
-   **🧭 Navigation Header** - Sticky header with user menu
-   **💾 Persistent State** - LocalStorage for user sessions
-   **🔄 Modal System** - Login/Register/Profile modals
-   **⚡ Loading States** - Smooth transitions and feedback

Node.js là một môi trường chạy JavaScript phía máy chủ (server-side). Thay vì chạy JavaScript chỉ trong trình duyệt (như trước đây), Node.js cho phép bạn viết ứng dụng backend bằng JavaScript và chạy trực tiếp trên máy tính của bạn hoặc trên server.

# 🎯 QuizMaster - React Quiz Application

A modern, interactive quiz application built with React featuring user authentication, responsive design, and beautiful UI.

## 🚀 Features

### ✨ Core Features

-   **🎮 Interactive Quiz System** - Multiple-choice questions with scoring
-   **🔐 User Authentication** - Login/Register with persistent sessions
-   **👤 User Profiles** - Avatar generation and profile management
-   **📊 Score Tracking** - Real-time scoring and quiz statistics
-   **⏱️ Countdown Timer** - Pre-quiz countdown for better UX
-   **🏆 End Game Summary** - Detailed results and restart options

### 🎨 UI/UX Features

-   **📱 Fully Responsive** - Mobile-first design approach
-   **🎨 Modern Design** - Gradient backgrounds and smooth animations
-   **🧭 Navigation Header** - Sticky header with user menu
-   **💾 Persistent State** - LocalStorage for user sessions
-   **🔄 Modal System** - Login/Register/Profile modals
-   **⚡ Loading States** - Smooth transitions and feedback

## 🏗️ Project Structure

```
Quiz/
├── public/
│   ├── logo_quiz.png          # Quiz logo
│   └── index.html
├── src/
│   ├── Components/
│   │   ├── Header/            # 🆕 Authentication Header
│   │   │   ├── Header.js      # Main header component
│   │   │   ├── Header.css     # Header styling
│   │   │   ├── UserContext.js # Global user state
│   │   │   └── AuthService.js # Authentication service
│   │   ├── Quiz/              # Quiz component
│   │   ├── Lobby/             # Start screen
│   │   ├── CountDown/         # Pre-quiz countdown
│   │   ├── EndGame/           # Results screen
│   │   └── Chart/             # Score visualization
│   ├── App.js                 # Main application
│   ├── App.css               # Global styles
│   └── index.js              # React entry point
└── README.md                 # This file
```

## 🔧 Header Component System

The new Header component provides a complete authentication system:

### Authentication Features

-   **Login Modal** - Username/password authentication
-   **Register Modal** - Full registration with validation
-   **User Profile** - Avatar, name, email management
-   **Session Management** - Persistent login state
-   **Logout** - Clean session termination

### Usage Example

```jsx
<Header
    isAuthenticated={isAuthenticated}
    user={user}
    onLogin={handleLogin}
    onLogout={handleLogout}
    onShowProfile={handleShowProfile}
    currentPage="quiz"
/>
```

### User Object Structure

```javascript
{
    id: number,
    name: string,
    email: string,
    avatar: string,
    createdAt: string,
    stats: {
        totalQuizzes: number,
        bestScore: number,
        averageScore: number
    }
}
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 🛠️ Installation & Setup

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd Quiz

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

## 📋 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 🧪 Testing the Application

### Manual Testing Checklist

-   ✅ **Header Authentication**

    -   Click "Đăng nhập" → Test login modal
    -   Click "Đăng ký" → Test registration modal
    -   Test form validation (empty fields, invalid email)
    -   Test modal switching (Login ↔ Register)
    -   Test user profile dropdown after login

-   ✅ **Quiz Flow**

    -   Start quiz from lobby
    -   Answer questions and check scoring
    -   Complete quiz and view results
    -   Test restart functionality

-   ✅ **Responsive Design**
    -   Test on mobile devices (< 480px)
    -   Test on tablets (481px - 768px)
    -   Test hamburger menu on mobile
    -   Test modal responsiveness

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload `build` folder to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🎨 Customization

### Theming

You can customize the header colors by modifying CSS variables in `Header.css`:

```css
:root {
    --header-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --primary-color: #667eea;
    --accent-color: #fbbf24;
}
```

### Adding New Questions

Edit the `mockQuestions` array in `App.js`:

```javascript
const mockQuestions = [
    {
        questionText: 'Your question here?',
        imageUrl: 'https://example.com/image.jpg',
        answerOptions: [
            { answerText: 'Option 1', isCorrect: false },
            { answerText: 'Correct Answer', isCorrect: true },
            // ... more options
        ],
    },
];
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you have any questions or need help with setup, please create an issue in the repository.

---

**Happy Coding! 🚀**
