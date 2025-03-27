
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
          alert("Please enter a search term.");
          return;
        }

        const queryWords = query.split(/\s+/);

        const matchFound = events.some(event => {
          const title = event.title.toLowerCase();
          const description = event.description.toLowerCase();
          return queryWords.some(word =>
            title.includes(word) || description.includes(word)
          );
        });

        if (matchFound) {
          window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
        } else {
          alert("No matching event found.");
          window.location.href = "index.html";
        }
      });
    }  
});


fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
});

fetch('welcome.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('welcome').innerHTML = data;
});


let events = [
    {
      title: "AI Club Meetup",
      description: "Join the AI enthusiasts for a fun and insightful session.",
      date: "2025-04-15",
      link: "event-detail.html"
    },
    {
      title: "Tech Talk with Alumni",
      description: "Learn from successful graduates about the tech industry.",
      date: "2025-04-18",
      link: "event-detail.html"
    },
    {
      title: "Hackathon Prep Workshop",
      description: "Get ready for the upcoming hackathon with coding tips and team-building exercises.",
      date: "2025-04-20",
      link: "event-detail.html"
    },
    {
      title: "Data Analytics Bootcamp",
      description: "Deep dive into data analysis tools and techniques with industry professionals.",
      date: "2025-04-22",
      link: "event-detail.html"
    },
    {
      title: "Machine Learning Demo Day",
      description: "Watch live demonstrations of ML projects built by fellow students.",
      date: "2025-04-25",
      link: "event-detail.html"
    },
    {
      title: "Career Fair 2025",
      description: "Meet recruiters, submit your resume, and explore tech internships and jobs.",
      date: "2025-05-01",
      link: "event-detail.html"
    },
    {
      title: "Cloud Computing Crash Course",
      description: "Discover the basics of cloud platforms and hands-on deployment strategies.",
      date: "2025-05-05",
      link: "event-detail.html"
    },
    {
      title: "Women in Tech Panel",
      description: "An empowering discussion with female leaders in the technology space.",
      date: "2025-05-10",
      link: "event-detail.html"
    },
    {
      title: "Cybersecurity Awareness Seminar",
      description: "Learn how to protect your digital identity and explore careers in cybersecurity.",
      date: "2025-05-12",
      link: "event-detail.html"
    },
    {
      title: "Intro to Git and GitHub",
      description: "Master version control and collaborate effectively on coding projects.",
      date: "2025-05-15",
      link: "event-detail.html"
    }
];
  

function renderEvents(containerId, eventList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    eventList.forEach(event => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        const card = `
        <div class="card shadow-sm">
            <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">${event.description}</p>
            <p class="card-text"><strong>Date:</strong> ${event.date}</p>
            <a href="${event.link}" class="btn btn-outline-info">View Details</a>
            </div>
        </div>
        `;
        col.innerHTML = card;
        container.appendChild(col);
    });
}
  
if (document.getElementById("eventCards")) {
    renderEvents("eventCards", events);
}
if (document.getElementById("searchResults")) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query')?.toLowerCase() || "";
    const queryWords = query.split(/\s+/);

    const filtered = events.filter(event => {
        const title = event.title.toLowerCase();
        const description = event.description.toLowerCase();
        return queryWords.some(word => title.includes(word) || description.includes(word));
    });

    renderEvents("searchResults", filtered);
}
function renderAnnouncementsFromEvents() {
    const container = document.getElementById("announcementList");
    if (!container) return;

    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedEvents.forEach(event => {
        const item = document.createElement("li");
        item.className = "list-group-item";
        item.innerHTML = `<strong>${event.date}:</strong> ${event.title}`;
        container.appendChild(item);
    });
}
  
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("announcementList")) {
      renderAnnouncementsFromEvents();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("eventForm");
    const confirmation = document.getElementById("confirmationMessage");
  
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const title = document.getElementById("eventTitle").value.trim();
        const description = document.getElementById("eventDescription").value.trim();
        const date = document.getElementById("eventDate").value;
        const link = document.getElementById("eventLink").value.trim() || "event-detail.html";
  
        const newEvent = { title, description, date, link };
        events.push(newEvent); 
  
        confirmation.classList.remove("d-none"); 
        form.reset(); 
  
        if (document.getElementById("eventCards")) {
          renderEvents("eventCards", events);
        }
      });
    }
});
  
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;
  
    const calendarEvents = events.map(event => ({
      title: event.title,
      start: event.date,
      url: event.link
    }));
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: "auto",
      headerToolbar: {
        start: 'title',
        center: '',
        end: 'today prev,next'
      },
      events: calendarEvents,
      eventClick: function(info) {
        if (!info.event.url) {
          info.jsEvent.preventDefault();
        }
      }
    });
  
    calendar.render();
});
  