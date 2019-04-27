const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review");

const seeds = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"


    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: "3.50",
        createdAt: ("2019-04-05T06:24:54.266Z"),
        lng: -119.5936038,
        lat: 37.74557009999999,
        author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
        location: "Yosemite Valley, CA 95389, USA"
    }
];

async function seedDB() {
    try {
        await Campground.deleteMany({});
        console.log('Campgrounds removed');
        await Review.deleteMany({});
        console.log('Reviews removed');

        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log('Campground created');
            let review = await Review.create({
                text: 'This place is great, but I wish there was internet',
                author: { "id": ("5ca5edb82c11c81e012a4b9b"), "username": "Isaac" },
                rating: 4
            });
            console.log('Review created');
            campground.reviews.push(review);
            campground.save();
            console.log('Review added to campground');
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = seedDB;
