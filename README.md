# Elite Sports 2.0 | Multi-Sport Booking System

Elite Sports 2.0 is a premium, real-time sports facility booking application designed for athletes and sports enthusiasts in Ahmedabad. The platform allows users to explore facilities for **Box Cricket**, **Football**, and **Pickleball**, and book their preferred slots seamlessly.

![Elite Sports 2.0](https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=80)

## 🚀 Features

- **Multi-Sport Support**: Interactive sections for Box Cricket Arena, Football Turf, and Pickleball Courts.
- **Real-Time Slot Booking**: Integrated with **Firebase Firestore** to provide live availability updates.
- **Dynamic Pricing**: Automatic price calculation based on the selected sport and duration.
- **Flexible Duration**: Choose from preset hours or enter a custom duration.
- **Interactive UI**: 
    - Smooth scroll animations using Intersection Observer.
    - Responsive mobile-first design.
    - Sticky navigation for easy access.
    - Action gallery showcasing the facilities.
- **Player Reviews**: Integrated testimonial section for user feedback.
- **Contact & Location**: Integrated Google Maps for easy navigation to the venue.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Backend/Database**: Firebase Firestore (Real-time DB)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Fonts**: [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)
- **Animations**: Custom Scroll Reveal (Intersection Observer API)

## 📁 Project Structure

```text
boxcricket/
├── images/             # Local assets and facility photos
├── index.html          # Main structure and SEO-optimized metadata
├── style.css           # Premium styling with glassmorphism and modern UI
├── script.js           # Core logic: Firebase integration, Booking system, Animations
└── README.md           # Project documentation
```

## ⚙️ Configuration

To run this project locally with your own Firebase instance, update the `firebaseConfig` object in `script.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📖 Usage

1. **Explore**: Browse through the facilities and player reviews.
2. **Select Sport**: Choose between Box Cricket, Football, or Pickleball.
3. **Pick a Date**: Select your preferred date (only current and future dates allowed).
4. **Select Time**: Click on an available (green) slot.
5. **Set Duration**: Choose how long you want to play.
6. **Confirm**: Enter your details and click "Confirm Booking". Your slot will be instantly reserved in the database!

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvement, feel free to fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---

Developed with ❤️ for the sports community.
YOLO badge test
