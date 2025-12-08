class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll(
            '.section h2, .philosophy-card, .benefit-card, .stat, .cta-section, .quote, #contact'
        );
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        this.elements.forEach(el => {
            el.classList.add('will-fade-in');
            observer.observe(el);
        });
    }
}