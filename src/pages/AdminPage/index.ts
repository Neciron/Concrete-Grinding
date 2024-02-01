import { firebaseConfig } from '@/scripts/dbConfig';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Route } from '@/scripts/Route';
import { RouteName } from '@/scripts/Route';
import { setTranslations } from '@/scripts/setTranslations';
import { utils } from '@/scripts/utils'

const createFormSubmitHandler = (): void => {
  const form = document.getElementById('sign-in-form') as HTMLFormElement;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('submit');
  })
}

const init = async (): Promise<void> => {
  initializeApp(firebaseConfig);
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    utils.navigate(RouteName.AdminReviews, true);
  } else {
    await setTranslations(Route[RouteName.Admin]);
    createFormSubmitHandler();
    utils.setAppSpinner(false);
  }
}

init().catch((error) => {
  console.error(error);
});


// Initialize Firebase
// ;



// {
//   "app_action_sign_in": "Увійти",
//   "app_admin_panel_sign_in": "Вхід в панель адміністратора",
//   "app_email_address": "Email адреса",
//   "app_enter_email": "Введіть email",
//   "app_enter_password": "Введіть пароль",
//   "app_meta_title_sign_in": "Вхід в панель адміністратора",
//   "app_password": "Пароль"
// }

// getTranslations();

// Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);
// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);

// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }



// const starCountRef = ref(db, 'posts/' + postId + '/starCount');
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   updateStarCount(postElement, data);
// });

// Read data once with get()

// const dbRef = ref(getDatabase());
// get(child(dbRef, `users/${userId}`)).then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });

// Read data once with an observer
// import { getDatabase, ref, onValue } from "firebase/database";
// import { getAuth } from "firebase/auth";

// const db = getDatabase();
// const auth = getAuth();

// const userId = auth.currentUser.uid;
// return onValue(ref(db, '/users/' + userId), (snapshot) => {
//   const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//   // ...
// }, {
//   onlyOnce: true
// });

//Update specific fields
// import { getDatabase, ref, child, push, update } from "firebase/database";

// function writeNewPost(uid, username, picture, title, body) {
//   const db = getDatabase();

//   // A post entry.
//   const postData = {
//     author: username,
//     uid: uid,
//     body: body,
//     title: title,
//     starCount: 0,
//     authorPic: picture
//   };

//   // Get a key for a new Post.
//   const newPostKey = push(child(ref(db), 'posts')).key;

//   // Write the new post's data simultaneously in the posts list and the user's post list.
//   const updates = {};
//   updates['/posts/' + newPostKey] = postData;
//   updates['/user-posts/' + uid + '/' + newPostKey] = postData;

//   return update(ref(db), updates);
// }


// Add a Completion Callback
// import { getDatabase, ref, set } from "firebase/database";

// const db = getDatabase();
// set(ref(db, 'users/' + userId), {
//   username: name,
//   email: email,
//   profile_picture : imageUrl
// })
// .then(() => {
//   // Data saved successfully!
// })
// .catch((error) => {
//   // The write failed...
// });

// Delete data
// The simplest way to delete data is to call remove() on a reference to the location of that data.

// You can also delete by specifying null as the value for another write operation such as set() or update(). You can use this technique with update() to delete multiple children in a single API call.


// Save data as transactions
// import { getDatabase, ref, runTransaction } from "firebase/database";

// function toggleStar(uid) {
//   const db = getDatabase();
//   const postRef = ref(db, '/posts/foo-bar-123');

//   runTransaction(postRef, (post) => {
//     if (post) {
//       if (post.stars && post.stars[uid]) {
//         post.starCount--;
//         post.stars[uid] = null;
//       } else {
//         post.starCount++;
//         if (!post.stars) {
//           post.stars = {};
//         }
//         post.stars[uid] = true;
//       }
//     }
//     return post;
//   });
// }

// Atomic server-side increments
// In the above use case we're writing two values to the database: the ID of the user who stars/unstars the post, and the incremented star count. If we already know that user is starring the post, we can use an atomic increment operation instead of a transaction.
// function addStar(uid, key) {
//   import { getDatabase, increment, ref, update } from "firebase/database";
//   const dbRef = ref(getDatabase());

//   const updates = {};
//   updates[`posts/${key}/stars/${uid}`] = true;
//   updates[`posts/${key}/starCount`] = increment(1);
//   updates[`user-posts/${key}/stars/${uid}`] = true;
//   updates[`user-posts/${key}/starCount`] = increment(1);
//   update(dbRef, updates);
// }