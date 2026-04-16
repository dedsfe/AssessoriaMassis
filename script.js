document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);

    // ========================
    // PRELOADER SEQUENCE
    // ========================
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            const preloader = document.getElementById("preloader");
            if (preloader) preloader.remove();
            document.body.classList.add("loaded");
            // Force scroll to top before refreshing ScrollTrigger
            window.scrollTo(0, 0);
            setTimeout(() => {
                ScrollTrigger.refresh();
                heroTl.play();
            }, 50);
        }
    });

    // Counter animation (0 → 100)
    const counterEl = document.querySelector(".preloader-counter");
    const counterObj = { val: 0 };

    // Phase 1: Reveal monogram letters from below
    preloaderTl
        .to(".preloader-letter", {
            y: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out"
        }, 0.3)

        // Phase 2: Pop the golden dot
        .to(".preloader-dot", {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(3)"
        }, 0.9)

        // Phase 3: Fade in the tagline from below
        .to(".preloader-tagline span", {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        }, 1.0)

        // Phase 4: Show progress bar and counter
        .to([".preloader-bar-wrapper", ".preloader-counter"], {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        }, 1.3)

        // Phase 5: Animate the progress bar fill + counter
        .to(".preloader-bar", {
            width: "100%",
            duration: 2,
            ease: "power2.inOut"
        }, 1.5)
        .to(counterObj, {
            val: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                counterEl.textContent = Math.round(counterObj.val);
            }
        }, 1.5)

        // Phase 6: Hold for a beat, then fade out center content
        .to(".preloader-content", {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.in"
        }, "+=0.3")
        .to(".preloader-tagline", {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, "<")

        // Phase 7: Curtains open — the grand reveal
        .to(".preloader-curtain--left", {
            xPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "+=0.1")
        .to(".preloader-curtain--right", {
            xPercent: 100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "<"); // Same time as left curtain


    // ========================
    // HERO ENTRANCE (fires in preloader onComplete)
    // ========================
    // The background starts slightly zoomed in
    gsap.set(".parallax-bg", { scale: 1.15 });

    const heroTl = gsap.timeline({ paused: true });

    heroTl
    .to(".parallax-bg", {
        scale: 1,
        duration: 2.8,
        ease: "power3.out"
    })
    .to(".hero-subtitle", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=2")
    .to(".word", {
        y: "0%",
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=1.5")
    .to(".header", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=1")
    .to(".scroll-indicator", {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");


    // ========================
    // INTERACTIVE PARALLAX ON MOUSE MOVE
    // ========================
    const hero = document.getElementById("hero");
    const bg = document.querySelector(".parallax-bg");
    const title = document.querySelector(".hero-content");

    hero.addEventListener("mousemove", (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(bg, {
            x: -xPos,
            y: -yPos,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.to(title, {
            x: xPos * 1.5,
            y: yPos * 1.5,
            duration: 1.5,
            ease: "power2.out"
        });
    });

    hero.addEventListener("mouseleave", () => {
        gsap.to([bg, title], {
            x: 0,
            y: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    });


    // ========================
    // MANIFESTO HORIZONTAL SCROLL
    // ========================
    const manifestoWrapper = document.querySelector(".manifesto-wrapper");

    const getScrollAmount = () => -(manifestoWrapper.scrollWidth - window.innerWidth);

    const tween = gsap.to(manifestoWrapper, {
        x: getScrollAmount,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: ".manifesto",
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
    });

    // ========================
    // ARSENAL GRID ANIMATION
    // ========================
    gsap.to(".reveal-item", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".arsenal",
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    // Subtle parallax for Arsenal Card backgrounds on scroll
    const cards = document.querySelectorAll(".arsenal-card");
    cards.forEach(card => {
        const cardBg = card.querySelector(".card-bg");
        
        gsap.to(cardBg, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });


    // ========================
    // INTERSTICIAL ANIMATION
    // ========================
    gsap.from(".intersticial-quote", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".intersticial",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".intersticial-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".intersticial",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });


    // ========================
    // ECOS PORTFOLIO ANIMATION
    // ========================
    const projects = document.querySelectorAll(".ecos-reveal");

    projects.forEach((project, i) => {
        // Staggered entrance per project
        gsap.to(project, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: project,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Parallax on the image inside each project
        const img = project.querySelector(".ecos-project-img img");
        if (img) {
            gsap.to(img, {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                    trigger: project,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    });


    // ========================
    // LIGHTBOX
    // ========================
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxCategory = document.getElementById("lightbox-category");
    const lightboxClose = document.getElementById("lightbox-close");

    // Open lightbox on project click
    projects.forEach(project => {
        project.addEventListener("click", () => {
            const img = project.querySelector(".ecos-project-img img");
            const name = project.querySelector(".ecos-project-name");
            const category = project.querySelector(".ecos-project-category");

            if (img) lightboxImg.src = img.src;
            if (name) lightboxTitle.textContent = name.textContent;
            if (category) lightboxCategory.textContent = category.textContent;

            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // Close lightbox — restore scroll state properly
    function closeLightbox() {
        lightbox.classList.remove("active");
        // Remove the inline style so CSS class .loaded handles overflow correctly
        document.body.style.removeProperty("overflow");
    }

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });


    // ========================
    // SOBRE ROBERTA ANIMATIONS
    // ========================
    gsap.from(".sobre-text > *", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".sobre",
            start: "top 65%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".stat-item", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".sobre-stats",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".sobre-photo-frame", {
        opacity: 0,
        x: 40,
        clipPath: "inset(0 100% 0 0)",
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".sobre",
            start: "top 65%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".sobre-photo-tag", {
        opacity: 0,
        y: 20,
        scale: 0.8,
        duration: 0.8,
        delay: 0.8,
        ease: "back.out(1.5)",
        scrollTrigger: {
            trigger: ".sobre",
            start: "top 65%",
            toggleActions: "play none none none"
        }
    });

    // ========================
    // INSTAGRAM ANIMATIONS
    // ========================
    gsap.from(".insta-header > *", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".insta-section",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".insta-card", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".insta-grid",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // ========================
    // CONTACT ANIMATIONS
    // ========================
    gsap.from(".contact-title", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".contact",
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".contact-description, .contact-detail", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".contact",
            start: "top 60%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".contact-right", {
        opacity: 0,
        x: 40,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".contact",
            start: "top 65%",
            toggleActions: "play none none none"
        }
    });


    // ========================
    // FOOTER ANIMATIONS
    // ========================
    gsap.from(".footer-top > *", {
        opacity: 0,
        y: 25,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".footer-watermark", {
        opacity: 0,
        x: 60,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });


    // ========================
    // FORM SUBMIT HANDLER
    // ========================
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("form-submit");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Animate button to success state
            const submitText = submitBtn.querySelector(".submit-text");
            const submitArrow = submitBtn.querySelector(".submit-arrow");

            gsap.to(submitBtn, {
                scale: 0.97,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    submitText.textContent = "Mensagem Enviada";
                    submitArrow.textContent = "✓";
                    submitBtn.style.borderColor = "rgba(212,175,55,0.8)";
                    submitBtn.style.color = "var(--color-accent)";
                    submitBtn.disabled = true;

                    // Reset after 4s
                    setTimeout(() => {
                        submitText.textContent = "Iniciar o Diálogo";
                        submitArrow.textContent = "→";
                        submitBtn.style.borderColor = "";
                        submitBtn.style.color = "";
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 4000);
                }
            });
        });
    }

});
