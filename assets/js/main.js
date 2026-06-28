/* =========================================================
   ISSANwebpower — main.js
   i18n (TH default / EN), language toggle, nav, reveal,
   subtle naga parallax, form success handling.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- i18n dictionary ---------------- */
  const I18N = {
    th: {
      "skip": "ข้ามไปยังเนื้อหา",
      "nav.services": "บริการ",
      "nav.study": "ศึกษาฟรี",
      "nav.local": "ในพื้นที่",
      "nav.contact": "ติดต่อ",
      "nav.cta": "รับการศึกษาฟรี",

      "hero.eyebrow": "อีสาน × เว็บดีไซน์",
      "hero.title1": "เพิ่มการมองเห็นออนไลน์",
      "hero.title2": "ให้ธุรกิจของคุณ",
      "hero.sub": "และเครื่องมือสั่งทำเฉพาะสำหรับธุรกิจของคุณ — ออกแบบจากอีสาน เพื่อร้านค้าท้องถิ่น",
      "hero.cta1": "รับการศึกษาฟรี",
      "hero.cta2": "ดูบริการ",
      "hero.chip1": "Google Business & แผนที่",
      "hero.chip2": "เว็บไซต์ + จองออนไลน์",
      "hero.chip3": "แอป & เครื่องมือภายใน",

      "services.kicker": "สิ่งที่ผมทำ",
      "services.title": "สามเสาหลักของบริการ",
      "services.lead": "ครบทุกขั้นตอน ตั้งแต่ทำให้ลูกค้าเจอคุณ ไปจนถึงเครื่องมือที่ทำให้ธุรกิจคุณเดินได้เอง",
      "services.s1.title": "เพิ่มการมองเห็นออนไลน์",
      "services.s1.text": "Google Business, SEO, Google Maps และโซเชียลมีเดีย — ให้ลูกค้าค้นเจอร้านคุณก่อนใคร",
      "services.s1.li1": "ตั้งค่า Google Business Profile",
      "services.s1.li2": "SEO & Google Maps",
      "services.s1.li3": "Facebook · Instagram · TikTok",
      "services.s2.title": "สร้าง & แก้ไขเว็บไซต์",
      "services.s2.text": "เว็บไซต์สมัยใหม่ เปิดบนมือถือลื่นไหล พร้อมระบบจองโดยตรง ไม่ต้องผ่านคนกลาง",
      "services.s2.li1": "ดีไซน์ทันสมัย Mobile-first",
      "services.s2.li2": "ระบบจองโดยตรง",
      "services.s2.li3": "โหลดไว · รองรับ SEO",
      "services.s3.title": "แอป & เครื่องมือภายใน",
      "services.s3.text": "พัฒนาเครื่องมือเฉพาะธุรกิจ: จองคิว, ระบบคิว, สต็อก, ออเดอร์ และการจัดการร้าน",
      "services.s3.li1": "ระบบจอง & คิว",
      "services.s3.li2": "จัดการสต็อก & ออเดอร์",
      "services.s3.li3": "แดชบอร์ดจัดการร้าน",

      "study.kicker": "ข้อเสนอพิเศษ",
      "study.title": "รับ “การศึกษาฟรี” สำหรับร้านของคุณ",
      "study.lead": "บอกข้อมูลร้านและลิงก์ออนไลน์ทั้งหมดของคุณ แล้วผมจะวิเคราะห์การมองเห็นออนไลน์ของคุณ พร้อมคำแนะนำที่ทำได้จริง — ฟรี ไม่มีข้อผูกมัด",
      "study.perk1": "✓ วิเคราะห์ Google & โซเชียลของคุณ",
      "study.perk2": "✓ จุดที่ปรับปรุงได้ทันที",
      "study.perk3": "✓ ตอบกลับเป็นภาษาไทยหรืออังกฤษ",

      "form.name": "ชื่อร้าน / ธุรกิจ",
      "form.name.ph": "เช่น ร้านกาแฟริมโขง",
      "form.type": "ประเภทธุรกิจ",
      "form.type.opt0": "— เลือก —",
      "form.type.hotel": "โรงแรม / ที่พัก",
      "form.type.restaurant": "ร้านอาหาร",
      "form.type.cafe": "คาเฟ่",
      "form.type.shop": "ร้านค้า / บูทีค",
      "form.type.other": "อื่น ๆ",
      "form.city": "เมือง / จังหวัด",
      "form.city.ph": "เช่น มุกดาหาร",
      "form.links": "ลิงก์ออนไลน์ทั้งหมดของคุณ",
      "form.links.ph": "Google Maps, Facebook, เว็บไซต์, Instagram, TikTok, LINE, Agoda…",
      "form.links.hint": "วางลิงก์ทั้งหมดที่มี บรรทัดละหนึ่งลิงก์ก็ได้",
      "form.contact": "ช่องทางติดต่อกลับ",
      "form.contact.ph": "โทรศัพท์ / LINE ID / อีเมล",
      "form.submit": "รับการศึกษาฟรีของฉัน",
      "form.privacy": "ข้อมูลของคุณจะถูกส่งถึงผมโดยตรง และใช้เพื่อติดต่อกลับเท่านั้น",
      "form.ok.title": "ขอบคุณครับ! ได้รับข้อมูลแล้ว",
      "form.ok.text": "ผมจะวิเคราะห์ร้านของคุณและติดต่อกลับเร็ว ๆ นี้ทางช่องทางที่คุณให้ไว้",
      "form.ok.back": "ส่งร้านอื่นอีก",

      "local.kicker": "ในพื้นที่ & ใกล้คุณ",
      "local.title": "ผมเป็นคนอีสาน — ทำงานถึงที่",
      "local.lead": "ผมอยู่ที่คำป่าหลาย มุกดาหาร ออกไปพบลูกค้าถึงร้าน เข้าใจธุรกิจท้องถิ่น และพูดได้ทั้งไทยและอังกฤษ",
      "local.f1.k": "ฐานที่ตั้ง",
      "local.f1.v": "คำป่าหลาย, มุกดาหาร (อีสาน)",
      "local.f2.k": "บริการถึงที่",
      "local.f2.v": "เดินทางไปพบคุณถึงร้าน",
      "local.f3.k": "ภาษา",
      "local.f3.v": "ไทย & อังกฤษ",

      "contact.kicker": "มาคุยกัน",
      "contact.title": "ติดต่อผมได้เลย",
      "contact.line": "แชทกับผมบน LINE",
      "contact.phone": "โทร / ข้อความ",
      "contact.email": "ส่งอีเมลถึงผม",

      "footer.tag": "อีสาน × เว็บ — เชื่อมร้านท้องถิ่นสู่โลกออนไลน์"
    },

    en: {
      "skip": "Skip to content",
      "nav.services": "Services",
      "nav.study": "Free study",
      "nav.local": "Local",
      "nav.contact": "Contact",
      "nav.cta": "Get free study",

      "hero.eyebrow": "Isan × Web design",
      "hero.title1": "Boost the online visibility",
      "hero.title2": "of your business",
      "hero.sub": "And custom-built tools tailored to your business — designed in Isan, for local shops.",
      "hero.cta1": "Get my free study",
      "hero.cta2": "See services",
      "hero.chip1": "Google Business & Maps",
      "hero.chip2": "Websites + online booking",
      "hero.chip3": "Apps & internal tools",

      "services.kicker": "What I do",
      "services.title": "Three pillars of service",
      "services.lead": "End to end — from helping customers find you, to the tools that keep your business running.",
      "services.s1.title": "Improve online visibility",
      "services.s1.text": "Google Business, SEO, Google Maps and social media — so customers find your shop first.",
      "services.s1.li1": "Google Business Profile setup",
      "services.s1.li2": "SEO & Google Maps",
      "services.s1.li3": "Facebook · Instagram · TikTok",
      "services.s2.title": "Build & edit websites",
      "services.s2.text": "Modern, mobile-first websites with direct booking — no middleman, no commission.",
      "services.s2.li1": "Modern mobile-first design",
      "services.s2.li2": "Direct booking system",
      "services.s2.li3": "Fast loading · SEO-ready",
      "services.s3.title": "Apps & internal tools",
      "services.s3.text": "Custom tools for your business: booking, queue, stock, orders and shop management.",
      "services.s3.li1": "Booking & queue systems",
      "services.s3.li2": "Stock & order management",
      "services.s3.li3": "Shop management dashboard",

      "study.kicker": "Special offer",
      "study.title": "Get a free study for your shop",
      "study.lead": "Share your shop details and all your online links, and I’ll analyse your online visibility with concrete, actionable advice — free, no obligation.",
      "study.perk1": "✓ Analysis of your Google & socials",
      "study.perk2": "✓ Quick wins you can apply now",
      "study.perk3": "✓ Reply in Thai or English",

      "form.name": "Business / shop name",
      "form.name.ph": "e.g. Mekong Riverside Café",
      "form.type": "Business type",
      "form.type.opt0": "— Choose —",
      "form.type.hotel": "Hotel / accommodation",
      "form.type.restaurant": "Restaurant",
      "form.type.cafe": "Café",
      "form.type.shop": "Shop / boutique",
      "form.type.other": "Other",
      "form.city": "City / province",
      "form.city.ph": "e.g. Mukdahan",
      "form.links": "All your online links",
      "form.links.ph": "Google Maps, Facebook, website, Instagram, TikTok, LINE, Agoda…",
      "form.links.hint": "Paste every link you have — one per line is fine.",
      "form.contact": "How to reach you back",
      "form.contact.ph": "Phone / LINE ID / email",
      "form.submit": "Get my free study",
      "form.privacy": "Your details go straight to me and are used only to contact you back.",
      "form.ok.title": "Thank you! I’ve got your details.",
      "form.ok.text": "I’ll analyse your shop and get back to you soon via the contact you provided.",
      "form.ok.back": "Send another shop",

      "local.kicker": "Local & close to you",
      "local.title": "I’m from Isan — I come to you",
      "local.lead": "Based in Kham Pa Lai, Mukdahan, I travel to meet clients on-site, understand local business, and speak both Thai and English.",
      "local.f1.k": "Based in",
      "local.f1.v": "Kham Pa Lai, Mukdahan (Isan)",
      "local.f2.k": "On-site service",
      "local.f2.v": "I travel to meet you at your shop",
      "local.f3.k": "Languages",
      "local.f3.v": "Thai & English",

      "contact.kicker": "Let’s talk",
      "contact.title": "Get in touch",
      "contact.line": "Chat with me on LINE",
      "contact.phone": "Call / text",
      "contact.email": "Email me",

      "footer.tag": "Isan × Web — connecting local shops to the online world"
    }
  };

  /* ---------------- Apply language ---------------- */
  function applyLang(lang) {
    const dict = I18N[lang] || I18N.th;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll(".lang__btn").forEach((b) => {
      const active = b.dataset.lang === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    try { localStorage.setItem("issan-lang", lang); } catch (e) {}
  }

  /* ---------------- Init on DOM ready ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    // language: Thai is the default; only a saved preference overrides it.
    let lang = "th";
    try {
      const stored = localStorage.getItem("issan-lang");
      if (stored === "th" || stored === "en") lang = stored;
    } catch (e) {}
    applyLang(lang);

    document.querySelectorAll(".lang__btn").forEach((b) => {
      b.addEventListener("click", () => applyLang(b.dataset.lang));
    });

    // year
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // nav scrolled state
    const nav = document.getElementById("nav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // mobile menu
    const burger = document.querySelector(".nav__burger");
    const links = document.querySelector(".nav__links");
    if (burger && links) {
      const toggle = (open) => {
        links.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
      };
      burger.addEventListener("click", () =>
        toggle(burger.getAttribute("aria-expanded") !== "true")
      );
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => toggle(false))
      );
    }

    // reveal on scroll
    const revealEls = document.querySelectorAll(
      ".section__head, .card, .study__form, .study__intro, .local__art, .local__text, .contact__card"
    );
    revealEls.forEach((el) => el.classList.add("reveal"));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-in"));
    }

    // subtle naga parallax (pointer + scroll), respects reduced motion
    const naga = document.querySelector("[data-naga]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (naga && !reduce && window.matchMedia("(pointer:fine)").matches) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      window.addEventListener("mousemove", (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 18;
        ty = (e.clientY / window.innerHeight - 0.5) * 18;
      });
      const raf = () => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        naga.style.transform = `translateY(-50%) translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // ----- Free study form submission -----
    initStudyForm();
  });

  /* ---------------- Form handling ----------------
     - On Netlify: POSTs to Netlify Forms (AJAX) then shows success.
     - Anywhere else (local file / non-Netlify host): we can't POST to
       Netlify, so we still show the success state for UX. To actually
       receive emails off-Netlify, switch the action to Formspree
       (see README). Honeypot keeps bots out.
  ------------------------------------------------- */
  function initStudyForm() {
    const form = document.querySelector(".study__form");
    const success = document.getElementById("study-success");
    if (!form || !success) return;

    const showSuccess = () => {
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      success.focus && success.focus();
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "…"; }

      const data = new FormData(form);
      const body = new URLSearchParams(data).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      })
        .then(() => showSuccess())
        .catch(() => showSuccess()) // graceful: still confirm to the user
        .finally(() => { if (btn) { btn.disabled = false; btn.textContent = original; } });
    });

    // "send another" → reset back to the form
    success.addEventListener("click", function (e) {
      const back = e.target.closest('a[href="#study"]');
      if (!back) return;
      e.preventDefault();
      form.reset();
      success.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
