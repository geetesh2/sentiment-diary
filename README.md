
# 📝 Sentiment Diary

An AI-powered diary application built with **Angular 17**, **Firebase**, and the **MeaningCloud Sentiment Analysis API**. Users can securely log their daily thoughts, analyze their emotional tone using NLP, and visualize their mood trends over time.

## 🌟 Features

- 🔐 **User Authentication**  
  Sign up and sign in securely using Firebase Authentication.

- 🧠 **AI Sentiment Analysis**  
  Analyze diary entries using MeaningCloud API to detect emotions like positivity, negativity, or neutrality.

- 📓 **Diary Entry Management**  
  Create, edit, view, and delete diary entries from a clean and intuitive UI.

- 📊 **Mood Trend Visualization** 
  View mood patterns and emotional trends over time through interactive charts.

- 💾 **Cloud Storage**  
  Diary entries are saved securely in Firebase Firestore.

## 🛠️ Tech Stack

- **Frontend**: Angular 17, TypeScript, HTML, CSS
- **Backend**: Firebase (Authentication, Firestore)
- **API**: Gemini Api
- **Version Control**: Git & GitHub


## Folder Substructure

```
src/
│
├── app/
│   ├── components/         # Reusable components (e.g., DiaryEntry)
│   ├── services/           # Angular services (e.g., Auth, Sentiment)
│   ├── models/             # TypeScript interfaces and types
│   ├── app.module.ts       # Root module
│   └── app.component.ts    # Root component
│
├── environments/           # Environment config files
└── assets/                 # Static assets

```

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/geetesh2/sentiment-diary.git
cd sentiment-diary
npm install
```


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



## 🧪 Future Improvements

- 📅 Mood timeline with calendar-based visualization  
- 📈 Weekly and monthly emotion summaries  
- 🎨 Dark mode toggle  
- 🔍 Search & filter diary entries by sentiment or keywords  

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a [Pull Request](https://github.com/geetesh2/sentiment-diary/pulls).

## 📄 License

This project is licensed under the [MIT License](LICENSE).

