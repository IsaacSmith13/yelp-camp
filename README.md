
#YelpCamp
---

YelpCamp is a full-stack (M.E.N.), RESTful web application project created alongside the Udemy course - [The Web Developer Bootcamp by Colt Steele](https://www.udemy.com/the-web-developer-bootcamp/).

##Live Demo
---
You can preview a live demo of this app here: <https://yelpcamp-isaac.herokuapp.com/>.
![alt text](https://i.imgur.com/MvgCSc0.jpg "Landing Page")

Feel free to clone the repository and use locally, however the site relies on several environment variables to access the database and use API's, so it can not be run as-is.

##Features
---
* Search for campgrounds using title, description, or author username
* User authorization/authentication using Passport.js
* Sign up for an account and optionally upload an avatar
* Create a new campground
* Edit an existing campground
* Review a campground and see the average rating of campgrounds
* View user profiles including posted campgrounds and reviews they've created
* Admin permissions that allow the editing/deletion of other users' campgrounds and reviews

##Built With
---
* RESTful routing using express and mongoose
* Cloudinary for image upload and storage
* Passport, passport-local, and passport-local-mongoose for authentication and authorization
* Google maps API and node-geocoder to display the physical location of a campground on a map
* Moment to record the creation time/date of campgrounds and reviews
* EJS to template and display pages
* Database hosted with MongoDB Atlas
* Bootstrap used to implement responsive design
* Nodemailer to email users forgotten passwords
* Connect-flash for better error display to users
* Heroku to deploy the website remotely

####Stack
---
MongoDB, Express, Node.js

#### [MIT](./LICENSE)