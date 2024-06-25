
// importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js');

importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyC-9OLaUHnD8lo39K8VN0vvlqvo2_69gfI",
  authDomain: "homebrokerdtvm.firebaseapp.com",
  projectId: "homebrokerdtvm",
  storageBucket: "homebrokerdtvm.appspot.com",
  messagingSenderId: "623742963048",
  appId: "1:623742963048:web:247d2f9d3648d33f685add",
  measurementId: "G-61J2XSH97C",
  vapidKey: "BBDmlBu0yklCnx650ET3VCx2PRqj-dfdwrYDmpgjh3nbZR_tx4DIQRiz3EkHEwtLCDtm4a2k6rT48iUWNSQzvjM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


