import { upload } from "./upload.js"
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

import "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDEYgso3Hk05QSqi97cnP6BjB5IPDg_wG4",
	authDomain: "frontend-upload-image-562d3.firebaseapp.com",
	projectId: "frontend-upload-image-562d3",
	storageBucket: "frontend-upload-image-562d3.appspot.com",
	messagingSenderId: "772314789983",
	appId: "1:772314789983:web:e35b38631e4e73909e03ea",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
console.log(storage)

upload("#file", {
	multi: true,
	accept: [".png", ".jpg", ".jpeg", ".gif"],
	onUpload(files) {
		files.forEach((file) => {
			const ref = storage.ref(`images/${file.name}`)
			const task = ref.put(file)

			task.on(
				"state_changed",
				(snapshot) => {
					const percentage =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log(percentage)
				},
				(error) => {
					console.log(error)
				},
				() => {
					console.log("Complete")
				}
			)
		})
	},
})
