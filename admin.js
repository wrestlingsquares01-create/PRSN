// =========================================
// PRSN ADMIN
// =========================================

const SUPABASE_URL =
    "https://xvvtzhqyihwgjdzdqkvx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Gp8pbf7ciC-QHUhMg6lyzA_WT6UaKoB";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================
// ADMIN CREDENTIAL
// =========================================

// IMPORTANT:
// Ye temporary frontend gate hai.
// Real Supabase Auth hum next security step mein add karenge.

const ADMIN_USERNAME = "PRSN_ADMIN";
const ADMIN_PASSWORD = "BACHYO_ADMIN";


// =========================================
// ELEMENTS
// =========================================

const loginScreen =
    document.getElementById("loginScreen");

const adminPanel =
    document.getElementById("adminPanel");

const adminUsername =
    document.getElementById("adminUsername");

const adminPassword =
    document.getElementById("adminPassword");

const loginBtn =
    document.getElementById("loginBtn");

const loginError =
    document.getElementById("loginError");

const logoutBtn =
    document.getElementById("logoutBtn");

const refreshBtn =
    document.getElementById("refreshBtn");


// =========================================
// LOGIN
// =========================================

function login() {

    const username =
        adminUsername.value
            .trim();

    const password =
        adminPassword.value;

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


// =========================================
// SHOW DASHBOARD
// =========================================

function showDashboard() {

    loginScreen.classList.add(
        "hidden"
    );

    adminPanel.classList.remove(
        "hidden"
    );

    loadDashboard();
}


// =========================================
// LOGOUT
// =========================================

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

    }
);


// =========================================
// LOGIN EVENTS
// =========================================

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


// =========================================
// DASHBOARD
// =========================================

async function loadDashboard() {

    await Promise.all([
        loadMembers(),
        loadMessages(),
        loadGallery()
    ]);

}


// =========================================
// MEMBERS
// =========================================

async function loadMembers() {

    const {
        data,
        error
    } = await supabaseClient
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


    document.getElementById(
        "memberCount"
    ).textContent =
        data.length;


    const box =
        document.getElementById(
            "membersList"
        );


    if (!data.length) {

        box.innerHTML =
            `<div class="empty">
                No members found.
            </div>`;

        return;
    }


    box.innerHTML =
        data.map(member => {

            const lastSeen =
                member.last_seen_at
                    ? formatDate(
                        member.last_seen_at
                    )
                    : "Never";


            return `
                <div class="member">

                    <div class="member-name">
                        ${escapeHTML(member.name)}
                    </div>

                    <div class="member-status">

                        <span class="online-dot"></span>

                        Last seen:
                        ${lastSeen}

                    </div>

                </div>
            `;

        }).join("");

}


// =========================================
// MESSAGES
// =========================================

async function loadMessages() {

    const {
        data,
        error
    } = await supabaseClient
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

        box.innerHTML =
            `<div class="empty">
                No messages yet.
            </div>`;

        return;
    }


    box.innerHTML =
        data.map(message => {

            let body =
                message.message || "";


            if (
                message.message_type ===
                "image"
            ) {
                body = "📷 Photo";
            }


            if (
                message.message_type ===
                "voice"
            ) {
                body = "🎙️ Voice message";
            }


            return `
                <div class="admin-message">

                    <div class="admin-message-top">

                        <span class="sender">
                            ${escapeHTML(
                                message.sender_name
                            )}
                        </span>

                        <span class="message-date">
                            ${formatDate(
                                message.created_at
                            )}
                        </span>

                    </div>

                    <div class="admin-message-body">
                        ${escapeHTML(body)}
                    </div>

                </div>
            `;

        }).join("");

}


// =========================================
// GALLERY
// =========================================

async function loadGallery() {

    const {
        data,
        error
    } = await supabaseClient
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

        box.innerHTML =
            `<div class="empty">
                No gallery photos yet.
            </div>`;

        return;
    }


    box.innerHTML = "";


    for (const photo of data) {

        let imageURL = null;


        const {
            data: signed,
            error: signedError
        } = await supabaseClient
            .storage
            .from("prsn-gallery")
            .createSignedUrl(
                photo.image_path,
                3600
            );


        if (
            !signedError &&
            signed
        ) {
            imageURL =
                signed.signedUrl;
        }


        box.innerHTML += `
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
                            <div class="empty">
                                Image unavailable
                            </div>
                        `
                }

                <div class="gallery-info">

                    ${escapeHTML(
                        photo.uploader_name
                    )}

                    ·

                    ${formatDate(
                        photo.created_at
                    )}

                </div>

            </div>
        `;
    }

}


// =========================================
// REFRESH
// =========================================

refreshBtn.addEventListener(
    "click",
    loadDashboard
);


// =========================================
// HELPERS
// =========================================

function formatDate(date) {

    if (!date) return "Never";

    return new Date(date)
        .toLocaleString(
            [],
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
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


// =========================================
// AUTO LOGIN CHECK
// =========================================

if (
    sessionStorage.getItem(
        "prsn_admin"
    ) === "true"
) {

    showDashboard();

}
