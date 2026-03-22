# **App Name**: MONEXO

## Core Features:

- Secure User Registration: Allows new users to create an account with phone, password, and an optional invite code, leveraging Supabase Auth to prevent duplicate phone numbers.
- User Authentication (Login): Enables existing users to securely log in using their registered phone number and password via Supabase Auth, establishing a user session.
- Supabase Backend Integration: Manages all backend logic including user authentication, account creation, and storing user details like invite codes exclusively within Supabase tables.
- Input Validation & Error Handling: Provides real-time feedback and clear error messages for invalid input formats, mismatched passwords, and duplicate phone numbers during registration and login.
- Session Management & Redirection: Securely stores user sessions post-login and automatically redirects authenticated users to the dashboard.
- Password Recovery Interface: Presents a 'Forgot password' link to initiate the password recovery process.
- Privacy Agreement Consent: Integrates an 'Agree privacy' checkbox to ensure user consent to the application's privacy terms during login.

## Style Guidelines:

- Color scheme: Light mode to embody a 'White clean fintech UI'.
- Primary color: A vibrant, professional blue (#1A7BFF) for calls-to-action and key interactive elements, reflecting a dynamic fintech experience.
- Background color: An extremely subtle, desaturated bluish-white (#F5F8FC) to maintain a clean, airy aesthetic.
- Accent color: A soft violet (#9466F2) used for interactive links and secondary elements, complementing the primary blue to create a premium gradient feel in branding elements.
- Gradient branding: Logo and registration welcome banner will feature a sophisticated purple-blue gradient, seamlessly blending the primary and accent hues.
- Headlines and Body text: 'Inter' (sans-serif) for its modern, clean, and highly legible appearance suitable for a professional fintech application.
- Use clear, simple, and thematic icons (e.g., phone for input, lock for password) within input fields to enhance user experience.
- Mobile-first design with centered forms and card-style containers, adhering to rounded corners (20px radius) and soft shadows for a modern, approachable look.
- Incorporate smooth transitions and subtle feedback animations for user interactions and form submissions to elevate the 'premium fintech' feel.