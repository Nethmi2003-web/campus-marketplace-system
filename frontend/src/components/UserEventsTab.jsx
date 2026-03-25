import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Calendar, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { EventCard } from "./EventCard";

export function UserEventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/api/events");
        setEvents(data.data);
      } catch (error) {
        console.error("Error fetching all events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ["All", "Technology", "Sports", "Arts", "Social", "Academic"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 backdrop-blur-xl p-8 rounded-[2.5rem] border shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Campus Events</h1>
            <p className="text-muted-foreground font-medium">Discover university activities</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or description..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-background border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-6 py-3.5 bg-card border rounded-2xl font-bold flex items-center gap-2 hover:bg-accent transition-all text-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap border-2",
              activeCategory === cat 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                : "bg-card text-muted-foreground border-transparent hover:border-muted hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-card/50 rounded-[2rem] animate-pulse border-2 border-dashed border-muted" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event.name}
              description={event.description}
              date={new Date(event.date).toLocaleDateString()}
              time={event.time}
              location={event.venue}
              category={event.category}
              imageUrl={event.imageUrl}
              status="open"
            />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-card/50 rounded-[3rem] border-2 border-dashed border-muted">
           <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center text-primary">
              <Sparkles size={40} className="opacity-20" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-primary">No events found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
           </div>
        </div>
      )}
    </div>
  );
}
