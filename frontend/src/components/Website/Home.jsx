import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Hero from "@components/Categories/Hero";
import "@styles/Home.css";

const parseDateSafe = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const useCountUp = (target, duration = 600) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0;
    if (typeof window === "undefined") {
      setValue(safeTarget);
      return;
    }

    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.round(progress * safeTarget);
      setValue(currentValue);
      if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return value;
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [activeSection, setActiveSection] = useState("notices");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeSensitivity, setTimeSensitivity] = useState(7);

  const noticesSectionRef = useRef(null);
  const eventsSectionRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/events/all`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notices/all`)
      .then((res) => setNotices(res.data))
      .catch((err) => console.error("Error fetching notices:", err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const filterByCategory = (items) => {
    if (selectedCategories.includes("all")) {
      return items;
    }

    return items.filter((item) => {
      const itemCategoryId =
        item.categoryId ??
        item.category_id ??
        item.category?.id ??
        item.category?.categoryId ??
        null;

      const itemCategoryName =
        item.categoryName ??
        item.category_name ??
        item.category?.title ??
        item.category?.name ??
        (typeof item.category === "string" ? item.category : null);

      return selectedCategories.some(
        (category) =>
          (itemCategoryId &&
            itemCategoryId.toString() === category.toString()) ||
          (itemCategoryName &&
            itemCategoryName.toString().toLowerCase() ===
              category.toLowerCase())
      );
    });
  };

  const filteredNotices = useMemo(
    () => filterByCategory(notices),
    [notices, selectedCategories]
  );
  const filteredEvents = useMemo(
    () => filterByCategory(events),
    [events, selectedCategories]
  );

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return filteredEvents.filter((event) => {
      const eventDate = parseDateSafe(event.date);
      return eventDate && eventDate.getTime() >= now;
    });
  }, [filteredEvents]);

  const upcomingDeadlinesCount = useMemo(() => {
    const now = Date.now();
    const windowEnd = now + timeSensitivity* 7 * 24 * 60 * 60 * 1000;
    return [...filteredNotices, ...filteredEvents].reduce((total, item) => {
      const date = parseDateSafe(item.date);
      if (!date) return total;
      const time = date.getTime();
      return time >= now && time <= windowEnd ? total + 1 : total;
    }, 0);
  }, [filteredEvents, filteredNotices, timeSensitivity]);

  const findCategoryLabel = (item) => {
    const id =
      item.categoryId ??
      item.category_id ??
      item.category?.id ??
      item.category?.categoryId ??
      null;

    const matchById = id
      ? categories.find((category) => category.id?.toString() === id.toString())
      : undefined;

    if (matchById?.name) return matchById.name;

    return (
      item.categoryName ??
      item.category_name ??
      item.category?.title ??
      item.category?.name ??
      (typeof item.category === "string" ? item.category : "")
    );
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value && value !== 0) return "";
    const raw = typeof value === "string" ? value.trim() : value;
    if (!raw) return "";
    if (typeof raw !== "string") return `${raw}`;

    if (/am|pm/i.test(raw)) {
      return raw.replace(/\s+/g, " ").toUpperCase();
    }

    const timeLike = raw.match(/^\d{1,2}:\d{2}(?::\d{2})?$/);
    if (timeLike) {
      const parsed = new Date(`1970-01-01T${raw}`);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      }
    }

    return raw;
  };

  const resolveEventLocation = (event) => {
    const location =
      event?.place ??
      event?.location ??
      event?.venue ??
      event?.locationName ??
      event?.eventLocation ??
      event?.location_text ??
      event?.locationDetails ??
      event?.location_detail ??
      "";

    if (!location && location !== 0) return "";
    return typeof location === "string" ? location.trim() : `${location}`;
  };

  const handleSectionShortcut = (section) => {
    setActiveSection(section);
    const targetRef =
      section === "notices" ? noticesSectionRef : eventsSectionRef;
    setIsSidebarOpen(false);
    targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategoryToggle = (value) => {
    setSelectedCategories((previous) => {
      if (value === "all") {
        return ["all"];
      }

      if (previous.includes(value)) {
        const updated = previous.filter((category) => category !== value);
        return updated.length > 0 ? updated : ["all"];
      }

      if (previous.includes("all")) {
        return [value];
      }

      return [...previous, value];
    });
    setIsSidebarOpen(false);
  };

  const categoryOptions = useMemo(() => {
    const deduped = new Set();
    return categories.reduce((options, category) => {
      const value =
        category.id?.toString() ?? category.name ?? category.title ?? "";
      if (!value || deduped.has(value)) return options;
      deduped.add(value);
      options.push({ value, label: category.name ?? category.title ?? value });
      return options;
    }, []);
  }, [categories]);

  const activeNoticesCount = filteredNotices.length;
  const upcomingEventsCount = upcomingEvents.length || filteredEvents.length;

  const nextHighlight = useMemo(() => {
    const now = Date.now();
    const items = [...filteredEvents, ...filteredNotices]
      .map((item) => {
        const parsed = parseDateSafe(item.date);
        return parsed ? { parsed, source: item } : null;
      })
      .filter(Boolean)
      .filter(({ parsed }) => parsed.getTime() >= now)
      .sort((a, b) => a.parsed.getTime() - b.parsed.getTime());

    if (!items.length) return null;
    const { source, parsed } = items[0];
    return {
      title:
        source.title ?? source.name ?? source.heading ?? "Upcoming highlight",
      date: parsed,
    };
  }, [filteredEvents, filteredNotices]);

  const highlightText = useMemo(() => {
    if (!nextHighlight) return "No time-sensitive updates just yet.";
    const dateLabel = formatDate(nextHighlight.date);
    return dateLabel
      ? `${dateLabel} - ${nextHighlight.title}`
      : nextHighlight.title;
  }, [nextHighlight]);

  const trimmedHighlight = useMemo(
    () =>
      highlightText.length <= 90
        ? highlightText
        : `${highlightText.slice(0, 87)}...`,
    [highlightText]
  );

  const noticesAnimated = useCountUp(activeNoticesCount, 720);
  const eventsAnimated = useCountUp(upcomingEventsCount, 720);
  const deadlinesAnimated = useCountUp(upcomingDeadlinesCount, 720);

  const summaryCards = useMemo(
    () => [
      {
        id: "notices",
        icon: "\u{1F4E2}",
        label: "Active Notices",
        value: noticesAnimated,
        helper:
          activeNoticesCount === 1
            ? "One notice matches your filters."
            : `${activeNoticesCount} notices in view.`,
      },
      {
        id: "events",
        icon: "\u{1F389}",
        label: "Upcoming Events",
        value: eventsAnimated,
        helper:
          upcomingEventsCount === 0
            ? "No events scheduled yet."
            : "Events happening soon.",
      },
      {
        id: "deadlines",
        icon: "\u23F0",
        label: "Upcoming Deadlines",
        value: deadlinesAnimated,
        helper: trimmedHighlight,
      },
    ],
    [
      activeNoticesCount,
      deadlinesAnimated,
      eventsAnimated,
      trimmedHighlight,
      noticesAnimated,
      upcomingEventsCount,
    ],
  );

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  return (
    <div className="home">
      <main className="home__main">
        <Hero />

        <section
          className="home__dashboard"
          aria-label="Notices and events dashboard"
        >
          <div className="dashboard__shell">
            <aside
              className={`dashboard__sidebar ${isSidebarOpen ? "is-open" : ""}`}
            >
              <button
                type="button"
                className="dashboard__toggle"
                aria-expanded={isSidebarOpen}
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? "Hide filters" : "Show filters"}
              </button>

              <div className="dashboard__sidebar-body">
                <div className="dashboard__sidebar-header">
                  <h2 className="dashboard__title">Dashboard</h2>
                  <p className="dashboard__subtitle">
                    Quick filters for campus buzz
                  </p>
                </div>

                <div
                  className="dashboard__tabs"
                  role="tablist"
                  aria-label="Content shortcuts"
                >
                  <button
                    type="button"
                    className={`dashboard__tab ${
                      activeSection === "notices" ? "is-active" : ""
                    }`}
                    onClick={() => handleSectionShortcut("notices")}
                  >
                    Notices
                  </button>
                  <button
                    type="button"
                    className={`dashboard__tab ${
                      activeSection === "events" ? "is-active" : ""
                    }`}
                    onClick={() => handleSectionShortcut("events")}
                  >
                    Events
                  </button>
                </div>

                <div className="dashboard__filter">
                  <span className="dashboard__filter-label">Categories</span>
                  <div
                    className="dashboard__checkbox-group"
                    role="group"
                    aria-label="Filter notices and events by category"
                  >
                    <label
                      className={`dashboard__checkbox ${
                        selectedCategories.includes("all") ? "is-active" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        aria-label="All categories"
                        checked={selectedCategories.includes("all")}
                        onChange={() => handleCategoryToggle("all")}
                      />
                      <span className="dashboard__checkbox-label">
                        All categories
                      </span>
                    </label>
                    {categoryOptions.map((category) => {
                      const isChecked = selectedCategories.includes(
                        category.value
                      );

                      return (
                        <label
                          key={category.value}
                          className={`dashboard__checkbox ${
                            isChecked ? "is-active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            aria-label={category.label}
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(category.value)}
                          />
                          <span className="dashboard__checkbox-label">
                            {category.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="dashboard__filter-hint">
                    Select one or more categories to refine results.
                  </p>
                </div>

                <div className="dashboard__sensitivity">
                  <label
                    htmlFor="sensitivity-range"
                    className="dashboard__filter-label"
                  >
                    Time Sensitivity (Weeks)
                  </label>
                  <input
                    type="range"
                    id="sensitivity-range"
                    min="1"
                    max="25"
                    step="1"
                    value={timeSensitivity}
                    onChange={(event) =>
                      setTimeSensitivity(Number(event.target.value))
                    }
                    className="dashboard__slider"
                  />
                  <span className="dashboard__filter-hint">
                    Showing deadlines within {timeSensitivity} {timeSensitivity > 1 ? ("weeks") : ("week")}
                  </span>
                </div>
              </div>
            </aside>

            <div className="dashboard__content">
              {/* Summary Cards */}
              <div
                className="summary-bar"
                role="region"
                aria-label="Dashboard summary"
              >
                {summaryCards.map((card, index) => (
                  <article
                    key={card.id}
                    className="summary-card"
                    style={{ "--summary-index": index }}
                  >
                    <span className="summary-card__icon" aria-hidden="true">
                      {card.icon}
                    </span>
                    <div className="summary-card__content">
                      <span className="summary-card__label">{card.label}</span>
                      <span
                        className="summary-card__value"
                        aria-live="polite"
                      >
                        {Number.isFinite(card.value)
                          ? card.value.toLocaleString()
                          : card.value}
                      </span>
                      <span className="summary-card__hint">{card.helper}</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Notices */}
              <div
                ref={noticesSectionRef}
                id="notices-section"
                className="content-panel"
              >
                <div className="content-panel__header">
                  <h3>Notices</h3>
                  <span className="content-panel__count">
                    {filteredNotices.length}{" "}
                    {filteredNotices.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="content-panel__description">
                  Stay current with official updates and announcements.
                </p>

                {filteredNotices.length > 0 ? (
                  <div className="card-grid">
                    {filteredNotices.map((notice, index) => (
                      <article
                        key={notice.id ?? notice._id ?? `notice-${index}`}
                        className="content-card"
                        style={{ "--card-index": index }}
                      >
                        <header className="content-card__meta">
                          {findCategoryLabel(notice) && (
                            <span className="content-card__badge">
                              {findCategoryLabel(notice)}
                            </span>
                          )}
                          {formatDate(notice.date) && (
                            <time
                              className="content-card__date"
                              dateTime={notice.date}
                            >
                              {formatDate(notice.date)}
                            </time>
                          )}
                        </header>
                        <h4 className="content-card__title">{notice.title}</h4>
                        <p className="content-card__description">
                          {notice.description}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="content-empty">
                    No notices available right now.
                  </p>
                )}
              </div>

              {/* Events */}
              <div
                ref={eventsSectionRef}
                id="events-section"
                className="content-panel"
              >
                <div className="content-panel__header">
                  <h3>Events</h3>
                  <span className="content-panel__count">
                    {filteredEvents.length}{" "}
                    {filteredEvents.length === 1 ? "event" : "events"}
                  </span>
                </div>
                <p className="content-panel__description">
                  Explore what's happening across campus and beyond.
                </p>

                {filteredEvents.length > 0 ? (
                  <div className="card-grid">
                    {filteredEvents.map((event, index) => {
                      const categoryLabel = findCategoryLabel(event);
                      const eventDateLabel = formatDate(event.date);
                      const eventTimeLabel = formatTime(
                        event?.time ??
                          event?.eventTime ??
                          event?.event_time ??
                          event?.startTime ??
                          event?.start_time
                      );
                      const eventLocationLabel = resolveEventLocation(event);
                      const hasDetails =
                        eventDateLabel || eventTimeLabel || eventLocationLabel;

                      return (
                        <article
                          key={event.id ?? event._id ?? `event-${index}`}
                          className="content-card content-card--event"
                          style={{ "--card-index": index }}
                        >
                          {categoryLabel && (
                            <header className="content-card__meta">
                              <span className="content-card__badge">
                                {categoryLabel}
                              </span>
                            </header>
                          )}
                          <h4 className="content-card__title">
                            {event.title}
                          </h4>
                          {hasDetails && (
                            <ul className="event-details" aria-label="Event details">
                              {eventDateLabel && (
                                <li className="event-details__item event-details__item--date">
                                  {eventDateLabel}
                                </li>
                              )}
                              {eventTimeLabel && (
                                <li className="event-details__item event-details__item--time">
                                  {eventTimeLabel}
                                </li>
                              )}
                              {eventLocationLabel && (
                                <li className="event-details__item event-details__item--location">
                                  {eventLocationLabel}
                                </li>
                              )}
                            </ul>
                          )}
                          <p className="content-card__description">
                            {event.description ??
                              "More details will be shared soon."}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="content-empty">No events scheduled yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
