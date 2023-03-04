import man from "../Resources/man.jpeg"
import running from "../Resources/running.jpeg"

let ProfileData = [{
    userid: 1,
    profilepic: man,
    name: "Jon. Faveru",
    joined: "24/10/2023",
    location: "Bukit Batok",
    attended: 15,
    bio: "I am a runner and I love to run",
    groupsjoined: [{
        groupid: 2,
        image: running,
        title: "Running Group",
        location: "Our Tampines Hub",
        tags: ["running", "fun", "group"],
        attendees: 15,
        creator: "Fab. Faveru",
        groupdesc: "running group"
    }
    ],

    groupsowned: [{
        groupid: 1,
        image: running,
        title: "IPPT Training ",
        location: "Our Tampines Hub",
        tags: ["running", "swimming", "cycling", "fun", "group"],
        attendees: 15,
        creator: "Jon. Faveru",
        groupdesc:
            "We focus on training for yearly IPPT test and Lorem ipsum  (need to have certain character limit",

    }
    ],
    eventsattending: [{
        eventid: 5,
        eventimage: running,
        eventtitle: "Running Session",
        eventlocation: "Our Tampines Hub",
        eventdate: "24/10/2023",
        eventtags: ["Beginner", "Running", "Fun"],
        eventattendees: 20,
        eventcreator: "Fab. Faveru",
        eventdescription: "We will do 6x400m around the track",
    }, {
        eventid: 6,
        eventimage: running,
        eventtitle: "Running Session",
        eventlocation: "Our Tampines Hub",
        eventdate: "25/10/2023",
        eventtags: ["Beginner", "Running", "Fun"],
        eventattendees: 20,
        eventcreator: "Fab. Faveru",
        eventdescription: "We will do 6x400m around the track",
    },{
        eventid: 7,
        eventimage: running,
        eventtitle: "Running Session",
        eventlocation: "Our Tampines Hub",
        eventdate: "25/10/2023",
        eventtags: ["Beginner", "Running", "Fun"],
        eventattendees: 20,
        eventcreator: "Fab. Faveru",
        eventdescription: "We will do 6x400m around the track",
        },
        {
            eventid: 8,
            eventimage: running,
            eventtitle: "Running Session",
            eventlocation: "Our Tampines Hub",
            eventdate: "25/10/2023",
            eventtags: ["Beginner", "Running", "Fun"],
            eventattendees: 20,
            eventcreator: "Fab. Faveru",
            eventdescription: "We will do 6x400m around the track",
        },],
    eventsowned: [{
        eventid: 1,
        eventimage: running,
        eventtitle: "2.4km training",
        eventlocation: "Our Tampines Hub",
        eventdate: "24/10/2023",
        eventtags: ["Beginner", "Running"],
        eventattendees: 20,
        eventcreator: "Jon. Faveru",
        eventdescription: "We will do 6x400m around the track",
    }, {
        eventid: 2,
        eventimage: running,
        eventtitle: "2.4km training",
        eventlocation: "Our Tampines Hub",
        eventdate: "24/10/2023",
        eventtags: ["Beginner", "Running"],
        eventattendees: 20,
        eventcreator: "Jon. Faveru",
        eventdescription: "We will do 6x400m around the track",
    },{
        eventid: 3,
        eventimage: running,
        eventtitle: "2.4km training",
        eventlocation: "Our Tampines Hub",
        eventdate: "24/10/2023",
        eventtags: ["Beginner", "Running"],
        eventattendees: 20,
        eventcreator: "Jon. Faveru",
        eventdescription: "We will do 6x400m around the track",
        },
        {
            eventid: 4,
            eventimage: running,
            eventtitle: "2.4km training",
            eventlocation: "Our Tampines Hub",
            eventdate: "24/10/2023",
            eventtags: ["Beginner", "Running"],
            eventattendees: 20,
            eventcreator: "Jon. Faveru",
            eventdescription: "We will do 6x400m around the track",
        },]
}

];
export default ProfileData;
