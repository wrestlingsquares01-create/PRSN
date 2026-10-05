// ============================================================
// PRSN ADMIN
// ============================================================


// -------------------- SUPABASE --------------------

const SUPABASE_URL =
    "https://xvvtzhqyihwgjdzdqkvx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Gp8pbf7ciC-QHUhMg6lyzA_WT6UaKoB";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ============================================================
// ADMIN LOGIN
// NOTE: Frontend credentials can be inspected.
// Supabase Auth should eventually replace this.
// ============================================================

const ADMIN_USERNAME =
    "PRSN_ADMIN";

const ADMIN_PASSWORD =
    "BACHYO_ADMIN";


// -------------------- ELEMENTS --------------------

const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const adminPanel =
    document.getElementById(
        "adminPanel"
    );

const adminUsername =
    document.getElementById(
        "adminUsername"
    );

const adminPassword =
    document.getElementById(
        "adminPassword"
    );

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const loginError =
    document.getElementById(
        "loginError"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );


// ============================================================
// LOGIN
// ============================================================

function login() {

    const username =
        adminUsername.value.trim();

    const password =
        adminPassword.value;

    loginError.textContent = "";

    if (
        username !== ADMIN_USERNAME ||
        password !== ADMIN_PASSWORD
    ) {

        loginError.textContent =
            "Invalid admin credentials.";

        return;
    }

    sessionStorage.setItem(
        "prsn_admin",
        "true"
    );

    showDashboard();
}


// ============================================================
// SHOW DASHBOARD
// ============================================================

function showDashboard() {

    loginScreen.classList.add(
        "hidden"
    );

    adminPanel.classList.remove(
        "hidden"
    );

    loadDashboard();
}


// ============================================================
// LOGOUT
// ============================================================

logoutBtn.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem(
            "prsn_admin"
        );

        adminPanel.classList.add(
            "hidden"
        );

        loginScreen.classList.remove(
            "hidden"
        );

        adminUsername.value = "";
        adminPassword.value = "";
        loginError.textContent = "";

    }
);


// ============================================================
// LOGIN EVENTS
// ============================================================

loginBtn.addEventListener(
    "click",
    login
);


adminPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            login();
        }

    }
);


adminUsername.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            adminPassword.focus();
        }

    }
);


// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {

    refreshBtn.disabled = true;

    try {

        await Promise.all([
            loadMembers(),
            loadMessages(),
            loadGallery()
        ]);

    } finally {

        refreshBtn.disabled = false;

    }
}


// ============================================================
// MEMBERS
// ============================================================

async function loadMembers() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("members")
            .select("*")
            .order(
                "name",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "Members error:",
            error
        );

        return;
    }

    const memberCount =
        document.getElementById(
            "memberCount"
        );

    const box =
        document.getElementById(
            "membersList"
        );

    memberCount.textContent =
        data.length;

    if (!data.length) {

        box.innerHTML = `
            <div class="empty">
                No members found.
            </div>
        `;

        return;
    }

    box.innerHTML =
        data
            .map(member => {

                const lastSeen =
                    member.last_seen_at
                        ? formatDate(
                            member.last_seen_at
                        )
                        : "Never";

                const recentlyOnline =
                    member.last_seen_at
                        ? (
                            Date.now() -
                            new Date(
                                member.last_seen_at
                            ).getTime()
                        ) <
                        120000
                        : false;

                return `

                    <div class="member">

                        <div class="member-name">
                            ${escapeHTML(
                                member.name
                            )}
                        </div>

                        <div class="member-status">

                            <span
                                class="online-dot ${
                                    recentlyOnline
                                        ? "is-online"
                                        : ""
                                }"
                            ></span>

                            ${
                                recentlyOnline
                                    ? "Active now"
                                    : `Last seen: ${lastSeen}`
                            }

                        </div>

                    </div>
                `;

            })
            .join("");
}


// ============================================================
// MESSAGES
// ============================================================

async function loadMessages() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("messages")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(100);

    if (error) {

        console.error(
            "Messages error:",
            error
        );

        return;
    }

    document.getElementById(
        "messageCount"
    ).textContent =
        data.length;


    const voiceCount =
        data.filter(
            message =>
                message.message_type ===
                "voice"
        ).length;


    const photoCount =
        data.filter(
            message =>
                message.message_type ===
                "image"
        ).length;


    document.getElementById(
        "voiceCount"
    ).textContent =
        voiceCount;


    document.getElementById(
        "photoCount"
    ).textContent =
        photoCount;


    const box =
        document.getElementById(
            "messagesList"
        );


    if (!data.length) {

        box.innerHTML = `
            <div class="empty">
                No messages yet.
            </div>
        `;

        return;
    }


    box.innerHTML =
        data
            .map(message => {

                let body =
                    message.message || "";

                let typeIcon = "✦";


                if (
                    message.message_type ===
                    "image"
                ) {

                    body = "Photo";
                    typeIcon = "◫";
                }


                if (
                    message.message_type ===
                    "voice"
                ) {

                    body =
                        "Voice message";

                    typeIcon = "◉";
                }


                return `

                    <div class="admin-message">

                        <div
                            class="admin-message-top"
                        >

                            <span class="sender">

                                <span
                                    class="message-type-icon"
                                >
                                    ${typeIcon}
                                </span>

                                ${escapeHTML(
                                    message.sender_name
                                )}

                            </span>

                            <span
                                class="message-date"
                            >
                                ${formatDate(
                                    message.created_at
                                )}
                            </span>

                        </div>

                        <div
                            class="admin-message-body"
                        >
                            ${escapeHTML(body)}
                        </div>

                    </div>
                `;

            })
            .join("");
}


// ============================================================
// GALLERY
// ============================================================

async function loadGallery() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("gallery_photos")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(100);

    if (error) {

        console.error(
            "Gallery error:",
            error
        );

        return;
    }

    const box =
        document.getElementById(
            "galleryList"
        );


    if (!data.length) {

        box.innerHTML = `
            <div class="empty">
                No gallery photos yet.
            </div>
        `;

        return;
    }


    box.innerHTML = "";


    const cards =
        await Promise.all(

            data.map(
                async photo => {

                    const {
                        data: signed,
                        error:
                            signedError
                    } =
                        await supabaseClient
                            .storage
                            .from(
                                "prsn-gallery"
                            )
                            .createSignedUrl(
                                photo.image_path,
                                3600
                            );


                    const imageURL =
                        (
                            !signedError &&
                            signed
                        )
                            ? signed.signedUrl
                            : null;


                    return `

                        <div class="gallery-item">

                            ${
                                imageURL
                                    ? `
                                        <img
                                            src="${imageURL}"
                                            alt="Gallery photo"
                                            loading="lazy"
                                        >
                                    `
                                    : `
                                        <div
                                            class="empty"
                                        >
                                            Image unavailable
                                        </div>
                                    `
                            }

                            <div
                                class="gallery-info"
                            >

                                <span>
                                    ${escapeHTML(
                                        photo.uploader_name
                                    )}
                                </span>

                                <span>
                                    ${formatDate(
                                        photo.created_at
                                    )}
                                </span>

                            </div>

                        </div>
                    `;

                }
            )
        );


    box.innerHTML =
        cards.join("");
}


// ============================================================
// REFRESH
// ============================================================

refreshBtn.addEventListener(
    "click",
    loadDashboard
);


// ============================================================
// HELPERS
// ============================================================

function formatDate(date) {

    if (!date) {
        return "Never";
    }

    return new Date(date)
        .toLocaleString(
            [],
            {
                day:
                    "2-digit",

                month:
                    "short",

                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );
}


function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value ?? "");

    return div.innerHTML;
}


// ============================================================
// AUTO LOGIN
// ============================================================

if (
    sessionStorage.getItem(
        "prsn_admin"
    ) === "true"
) {

    showDashboard();
}


// ============================================================
// PREMIUM ADMIN EFFECTS
// ============================================================

(function initAdminPremiumUI() {

    const glow =
        document.getElementById(
            "cursorGlow"
        );

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    // ---------------- CURSOR GLOW ----------------

    if (
        glow &&
        !reduceMotion
    ) {

        window.addEventListener(
            "pointermove",
            event => {

                glow.style.left =
                    `${event.clientX}px`;

                glow.style.top =
                    `${event.clientY}px`;

                glow.style.opacity =
                    "1";

            },
            {
                passive: true
            }
        );


        document
            .documentElement
            .addEventListener(
                "mouseleave",
                () => {

                    glow.style.opacity =
                        "0";

                }
            );
    }


    // ---------------- 3D CARDS ----------------

    document
        .querySelectorAll(
            "[data-tilt]"
        )
        .forEach(card => {

            card.addEventListener(
                "pointermove",
                event => {

                    if (
                        reduceMotion ||
                        event.pointerType !==
                            "mouse"
                    ) {
                        return;
                    }

                    const rect =
                        card
                            .getBoundingClientRect();

                    const rx =
                        -(
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height -
                            0.5
                        ) *
                        3;

                    const ry =
                        (
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width -
                            0.5
                        ) *
                        3;

                    card.style.transform =
                        `translateY(-5px) rotateX(${rx}deg) rotateY(${ry}deg)`;

                }
            );


            card.addEventListener(
                "pointerleave",
                () => {

                    card.style
                        .removeProperty(
                            "transform"
                        );

                }
            );

        });


    // ---------------- NUMBER ANIMATION ----------------

    [
        "memberCount",
        "messageCount",
        "photoCount",
        "voiceCount"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) return;


        const observer =
            new MutationObserver(
                () => {

                    if (
                        typeof element.animate !==
                        "function"
                    ) {
                        return;
                    }

                    element.animate(
                        [
                            {
                                opacity:
                                    0.25,

                                transform:
                                    "translateY(5px)"
                            },
                            {
                                opacity:
                                    1,

                                transform:
                                    "translateY(0)"
                            }
                        ],
                        {
                            duration:
                                320,

                            easing:
                                "cubic-bezier(.2,.8,.2,1)"
                        }
                    );

                }
            );


        observer.observe(
            element,
            {
                childList:
                    true,

                characterData:
                    true,

                subtree:
                    true
            }
        );

    });

})();
