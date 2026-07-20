"use client";

import { useEffect } from "react";
import LandingHeader from "@/components/features/landing/header";
import LandingHero from "@/components/features/landing/hero";
import LandingFeatures from "@/components/features/landing/features";
import LandingTestimonials from "@/components/features/landing/testimonials";
import LandingPricing from "@/components/features/landing/pricing";
import LandingFooter from "@/components/features/landing/footer";
import "./landing.css";

export default function Home() {
  useEffect(() => {
    // Scroll reveal observer
    const reveals = document.querySelectorAll(".reveal");

    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    reveals.forEach((el) => revealObserver.observe(el));

    // Magnetic button effects
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const btn = mouseEvent.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;
      const strength = 8; // gentle magnetic pull
      btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    };

    const handleMouseLeave = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transform = "translate(0px, 0px)";
    };

    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      revealObserver.disconnect();
      magneticBtns.forEach((btn) => {
        btn.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body-md antialiased text-slate-800 dark:text-slate-200">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  );
}
