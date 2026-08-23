import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Fade in from below — use inside useGSAP context */
export function fadeInUp(
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.from(target, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    ...vars,
  });
}

/** Stagger fade-in from below */
export function staggerFadeIn(
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.from(target, {
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    ...vars,
  });
}

/** Reveal text line by line with a clip */
export function revealText(
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.from(target, {
    yPercent: 110,
    duration: 1,
    ease: "power4.out",
    stagger: 0.12,
    ...vars,
  });
}

/** Scroll-triggered fade-in from below */
export function scrollFadeIn(
  target: gsap.TweenTarget,
  triggerEl: Element,
  vars?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.from(target, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    ...vars,
  });
}
