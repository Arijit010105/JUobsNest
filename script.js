/**
 * JobsNest — Interactive Client Script
 * Handles 3D WebGL mesh, IST clock, dynamic search/filter,
 * WhatsApp messaging, form submission, and card 3D tilt physics.
 */

(() => {
  "use strict";

  const WA_NUMBER = "917044774813";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. Live IST Clock (Bangalore Time)
     ========================================================================== */
  const clockEl = document.getElementById("clock");
  if (clockEl) {
    const updateClock = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(new Date());
        clockEl.textContent = timeStr;
      } catch (e) {
        // Fallback for environments lacking timeZone Intl support
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (3600000 * 5.5));
        const hh = String(ist.getHours()).padStart(2, '0');
        const mm = String(ist.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}`;
      }
    };
    updateClock();
    setInterval(updateClock, 15000);
  }

  /* ==========================================================================
     2. Toast Notifications
     ========================================================================== */
  const toastEl = document.getElementById("toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2000);
  };

  /* ==========================================================================
     3. Copy to Clipboard
     ========================================================================== */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      const fallbackCopy = () => {
        const tempInput = document.createElement("textarea");
        tempInput.value = textToCopy;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showToast(`Copied ${textToCopy}`);
        } catch (err) {
          showToast("Press Ctrl+C to copy");
        }
        document.body.removeChild(tempInput);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => showToast(`Copied ${textToCopy}`))
          .catch(() => fallbackCopy());
      } else {
        fallbackCopy();
      }
    });
  });

  /* ==========================================================================
     4. Role Search & Category Filtering
     ========================================================================== */
  const roles = [
    ["Inside Sales Executive", "Sales", "Bangalore · 1–3 yrs"],
    ["Customer Support Associate (Hindi/English)", "Customer", "Bangalore · Fresher–2 yrs"],
    ["React Developer", "IT", "Bangalore · 2–5 yrs"],
    ["Java Backend Engineer", "IT", "Bangalore · 3–6 yrs"],
    ["Accounts Executive (Tally, GST)", "Finance", "Bangalore · 1–4 yrs"],
    ["Staff Nurse", "Healthcare", "Bangalore · 1–3 yrs"],
    ["Front Office Executive", "Healthcare", "Bangalore · Fresher–2 yrs"],
    ["Graduate Trainee – Operations", "Fresher", "Bangalore · Fresher"],
    ["Field Sales Manager", "Sales", "Bangalore · 4–8 yrs"],
    ["QA Automation Engineer", "IT", "Bangalore · 2–5 yrs"]
  ];

  const resultsContainer = document.getElementById("results");
  const searchInput = document.getElementById("q");
  const searchForm = document.getElementById("searchForm");
  const chips = document.querySelectorAll(".chip");

  const buildWhatsAppLink = (roleName) => {
    const text = `Hi JobsNest, I'm interested in the ${roleName} role. Here are my details:`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const renderRoles = (filterText) => {
    if (!resultsContainer) return;
    const term = (filterText || "").trim().toLowerCase();
    
    const matched = (term
      ? roles.filter(([title, cat]) => (title + " " + cat).toLowerCase().includes(term))
      : roles
    ).slice(0, 3);

    if (matched.length === 0) {
      const sanitized = filterText.replace(/[<>&"']/g, "");
      const emptyWALink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi JobsNest, I'm looking for openings in ${filterText}. Please share suitable matches.`)}`;
      resultsContainer.innerHTML = `
        <div class="empty">
          No listed openings for “${sanitized}” right now.
          <a style="color:var(--emerald);font-weight:600;display:inline-block;margin-top:4px;" target="_blank" rel="noopener" href="${emptyWALink}">
            Send us your profile on WhatsApp →
          </a>
          and our team will alert you immediately as relevant roles open.
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matched.map(([title, , details]) => `
      <div class="role">
        <div class="role-main">
          <div class="role-t">${title}</div>
          <div class="role-m">${details}</div>
        </div>
        <a target="_blank" rel="noopener" href="${buildWhatsAppLink(title)}" aria-label="Apply for ${title} via WhatsApp">
          Apply →
        </a>
      </div>
    `).join("");
  };

  if (resultsContainer && searchInput) {
    // Initial render
    renderRoles("");

    // Live search input
    searchInput.addEventListener("input", () => {
      // Clear chip selection if typing custom search
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      renderRoles(searchInput.value);
    });

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        renderRoles(searchInput.value);
      });
    }

    // Category chips
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const isPressed = chip.getAttribute("aria-pressed") === "true";
        chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
        
        if (isPressed) {
          searchInput.value = "";
          renderRoles("");
        } else {
          chip.setAttribute("aria-pressed", "true");
          const query = chip.dataset.q || "";
          searchInput.value = query;
          renderRoles(query);
        }
      });
    });
  }

  /* ==========================================================================
     5. Contact Form Mode Switching & Submission
     ========================================================================== */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const msgLabel = document.getElementById("msgLabel");
  const msgInput = document.getElementById("f-msg");

  const setContactMode = (mode) => {
    const isEmployer = mode === "employer";
    const radioSeeker = document.getElementById("who-seeker");
    const radioEmployer = document.getElementById("who-employer");

    if (radioSeeker && radioEmployer) {
      radioSeeker.checked = !isEmployer;
      radioEmployer.checked = isEmployer;
    }

    if (msgLabel) {
      msgLabel.textContent = isEmployer ? "Roles you're hiring for" : "Role you're looking for";
    }

    if (msgInput) {
      msgInput.placeholder = isEmployer
        ? "e.g. 10 Customer Support Associates, Bangalore, joining in 3 weeks"
        : "e.g. Inside Sales, 2 years experience, Bangalore";
    }
  };

  if (contactForm) {
    contactForm.querySelectorAll('input[name="who"]').forEach((radio) => {
      radio.addEventListener("change", () => setContactMode(radio.value));
    });

    document.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => setContactMode(btn.dataset.mode));
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const getField = (id) => document.getElementById(id);
      const nameVal = getField("f-name") ? getField("f-name").value.trim() : "";
      const phoneVal = getField("f-phone") ? getField("f-phone").value.trim() : "";
      const emailVal = getField("f-email") ? getField("f-email").value.trim() : "";
      const msgVal = getField("f-msg") ? getField("f-msg").value.trim() : "";

      let isValid = true;

      // Validation
      const nameValid = nameVal.length >= 2;
      getField("f-name")?.parentElement.classList.toggle("err", !nameValid);
      if (!nameValid) isValid = false;

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      getField("f-email")?.parentElement.classList.toggle("err", !emailValid);
      if (!emailValid) isValid = false;

      const msgValid = msgVal.length >= 4;
      getField("f-msg")?.parentElement.classList.toggle("err", !msgValid);
      if (!msgValid) isValid = false;

      if (!isValid) {
        if (formNote) {
          formNote.className = "form-note bad";
          formNote.textContent = "Please fill in your name, a valid email, and your requirement.";
        }
        return;
      }

      const who = contactForm.who.value === "employer" ? "Hiring enquiry" : "Job enquiry";
      const subject = `${who} — ${nameVal}`;
      const emailBody = `Name: ${nameVal}\nPhone: ${phoneVal || "Not specified"}\nEmail: ${emailVal}\n\nRequirement / Message:\n${msgVal}\n\n---\nSent via JobsNest Website Form`;

      const mailtoLink = `mailto:jobsnestt.in@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      const link = document.createElement("a");
      link.href = mailtoLink;
      link.click();

      if (formNote) {
        formNote.className = "form-note ok";
        formNote.textContent = "Email composer opened! If it didn't open, write directly to jobsnestt.in@gmail.com or WhatsApp +91 70447 74813.";
      }
    });
  }

  /* ==========================================================================
     6. Card 3D Tilt & Dynamic Radial Lighting
     ========================================================================== */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);

        if (card.classList.contains("tilt")) {
          const rotX = (0.5 - y) * 3.5;
          const rotY = (x - 0.5) * 3.5;
          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }
      });

      card.addEventListener("pointerleave", () => {
        if (card.classList.contains("tilt")) {
          card.style.transform = "";
        }
      });
    });
  }

  /* ==========================================================================
     7. Three.js 3D Deforming Glass Mesh Backdrop
     ========================================================================== */
  const canvas = document.getElementById("mesh");
  if (!canvas || !window.THREE) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
  } catch (err) {
    console.warn("JobsNest: WebGL not supported or disabled.", err);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 7;

  const geometry = new THREE.IcosahedronGeometry(1.7, 5);
  const basePositions = geometry.attributes.position.array.slice();

  // Glass physical material with emerald glow
  const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9fe8cb,
    metalness: 0.15,
    roughness: 0.12,
    transparent: true,
    opacity: 0.48,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: 0x0F5E44,
    emissiveIntensity: 0.28
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x34D399,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });

  const mainMesh = new THREE.Mesh(geometry, physicalMaterial);
  const wireMesh = new THREE.Mesh(geometry, wireframeMaterial);
  const meshGroup = new THREE.Group();
  meshGroup.add(mainMesh);
  meshGroup.add(wireMesh);
  scene.add(meshGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
  scene.add(ambientLight);

  const keyLight = new THREE.PointLight(0x34D399, 2.4, 32);
  keyLight.position.set(4, 3, 5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xC9CBD6, 1.6, 32);
  fillLight.position.set(-5, -2, 4);
  scene.add(fillLight);

  // Resize handler
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (width > 980) {
      meshGroup.position.set(2.2, 0.6, 0);
      meshGroup.scale.setScalar(1.0);
    } else {
      meshGroup.position.set(0.6, 1.4, 0);
      meshGroup.scale.setScalar(0.72);
    }
  };
  handleResize();
  window.addEventListener("resize", handleResize);

  // Pointer interaction
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
  });

  // Render & deformation loop
  const positionAttr = geometry.attributes.position;
  const tempVec = new THREE.Vector3();

  const animate = (time) => {
    const t = time * 0.001;

    // Smooth pointer damping
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Harmonic wave deformation
    const pointerDist = Math.hypot(mouseX, mouseY);
    for (let i = 0; i < positionAttr.count; i++) {
      tempVec.set(basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]);
      const wave = Math.sin(tempVec.x * 1.6 + t * 0.9) *
                   Math.cos(tempVec.y * 1.4 + t * 0.7) *
                   Math.sin(tempVec.z * 1.2 + t * 0.5);
      tempVec.multiplyScalar(1 + wave * 0.16 + pointerDist * 0.06);
      positionAttr.setXYZ(i, tempVec.x, tempVec.y, tempVec.z);
    }
    positionAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // Group rotation & scroll parallax
    meshGroup.rotation.y = t * 0.12 + mouseX * 0.8;
    meshGroup.rotation.x = mouseY * 0.6 + Math.sin(t * 0.2) * 0.1;

    const basePosY = window.innerWidth > 980 ? 0.6 : 1.4;
    const targetPosY = basePosY - (window.scrollY || 0) * 0.002;
    meshGroup.position.y += (targetPosY - meshGroup.position.y) * 0.08;

    renderer.render(scene, camera);

    if (!reduceMotion) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
})();
