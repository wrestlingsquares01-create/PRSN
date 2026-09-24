// =========================================
// SUPABASE
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
// PRSN SETTINGS
// =========================================

const ALLOWED_USERS = [
    "PRASHANT",
    "SHYAM",
    "RAVI",
    "NUKS"
];

const CHAT_CODE = "BACHYO";

const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;


// =========================================
// VARIABLES
// =========================================

let currentUser = null;

let chatName = null;

let chatChannel = null;

let galleryChannel = null;


// =========================================
// ELEMENTS
// =========================================

// NAME

const nameScreen =
    document.getElementById("nameScreen");

const dashboard =
    document.getElementById("dashboard");

const nameInput =
    document.getElementById("nameInput");

const enterBtn =
    document.getElementById("enterBtn");

const nameError =
    document.getElementById("nameError");

const currentUserElement =
    document.getElementById("currentUser");

const welcomeUser =
    document.getElementById("welcomeUser");


// MUSIC

const bgMusic =
    document.getElementById("bgMusic");

const chatMusic =
    document.getElementById("chatMusic");

const musicBtn =
    document.getElementById("musicBtn");


// CHAT BUTTON

const chatBtn =
    document.getElementById("chatBtn");


// CHAT CODE MODAL

const chatModal =
    document.getElementById("chatModal");

const closeChat =
    document.getElementById("closeChat");

const chatCodeInput =
    document.getElementById("chatCode");

const unlockChat =
    document.getElementById("unlockChat");

const chatError =
    document.getElementById("chatError");


// CHAT NAME MODAL

const chatNameModal =
    document.getElementById("chatNameModal");

const chatNameInput =
    document.getElementById("chatNameInput");

const enterCommunity =
    document.getElementById("enterCommunity");

const chatNameError =
    document.getElementById("chatNameError");


// CHAT SCREEN

const chatScreen =
    document.getElementById("chatScreen");

const backFromChat =
    document.getElementById("backFromChat");

const messagesBox =
    document.getElementById("messages");

const messageInput =
    document.getElementById("messageInput");

const sendMessageBtn =
    document.getElementById("sendMessage");

const photoInput =
    document.getElementById("photoInput");


// =========================================
// AMAZING WALL ELEMENTS
// =========================================

const galleryBtn =
    document.getElementById("galleryBtn");

const galleryScreen =
    document.getElementById("galleryScreen");

const backFromGallery =
    document.getElementById("backFromGallery");

const galleryInput =
    document.getElementById("galleryInput");

const galleryGrid =
    document.getElementById("galleryGrid");


// =========================================
// ENTER PRSN
// =========================================

async function enterPRSN() {

    const typedName =
        nameInput.value
            .trim()
            .toUpperCase();


    if (!typedName) {

        nameError.textContent =
            "Please enter your name.";

        return;
    }


    if (!ALLOWED_USERS.includes(typedName)) {

        nameError.textContent =
            "This name is not allowed.";

        return;
    }


    currentUser = typedName;


    currentUserElement.textContent =
        currentUser;

    welcomeUser.textContent =
        currentUser;


    nameScreen.classList.remove(
        "active"
    );

    dashboard.classList.add(
        "active"
    );


    // Start background music

    bgMusic.currentTime = 0;

    bgMusic.play().catch(() => {

        console.log(
            "Browser blocked autoplay."
        );

    });


    await updateLastSeen();
}


enterBtn.addEventListener(
    "click",
    enterPRSN
);


nameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            enterPRSN();

        }

    }
);


// =========================================
// MUSIC BUTTON
// =========================================

musicBtn.addEventListener(
    "click",
    () => {

        if (!bgMusic.paused) {

            bgMusic.pause();

            musicBtn.textContent =
                "♪";

        } else {

            bgMusic.play();

            musicBtn.textContent =
                "♫";

        }

    }
);


// =========================================
// OPEN CHAT
// =========================================

chatBtn.addEventListener(
    "click",
    () => {

        chatModal.classList.remove(
            "hidden"
        );

        chatCodeInput.value = "";

        chatError.textContent = "";


        setTimeout(() => {

            chatCodeInput.focus();

        }, 100);

    }
);


// =========================================
// CLOSE CHAT CODE MODAL
// =========================================

closeChat.addEventListener(
    "click",
    () => {

        chatModal.classList.add(
            "hidden"
        );

    }
);


// =========================================
// CORRECT CHAT CODE
// =========================================

function correctCode() {

    const code =
        chatCodeInput.value
            .trim()
            .toUpperCase();


    if (code !== CHAT_CODE) {

        chatError.textContent =
            "Wrong codeword.";

        return;
    }


    chatModal.classList.add(
        "hidden"
    );


    // Change music

    bgMusic.pause();

    bgMusic.currentTime = 0;

    chatMusic.currentTime = 0;

    chatMusic.play().catch(() => {

        console.log(
            "Browser blocked chat music autoplay."
        );

    });


    // Ask chat name

    chatNameModal.classList.remove(
        "hidden"
    );

    chatNameInput.value = "";

    chatNameError.textContent = "";


    setTimeout(() => {

        chatNameInput.focus();

    }, 100);
}


unlockChat.addEventListener(
    "click",
    correctCode
);


chatCodeInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            correctCode();

        }

    }
);


// =========================================
// ENTER CHAT WITH NAME
// =========================================

function enterChatWithName() {

    const entered =
        chatNameInput.value
            .trim();


    if (!entered) {

        chatNameError.textContent =
            "Naam toh bata de bhai 😭";

        return;
    }


    chatName = entered;


    chatNameModal.classList.add(
        "hidden"
    );


    dashboard.classList.remove(
        "active"
    );


    chatScreen.classList.remove(
        "hidden"
    );


    loadMessages();

    startRealtimeChat();


    setTimeout(() => {

        messageInput.focus();

    }, 200);
}


enterCommunity.addEventListener(
    "click",
    enterChatWithName
);


chatNameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            enterChatWithName();

        }

    }
);


// =========================================
// BACK FROM CHAT
// =========================================

backFromChat.addEventListener(
    "click",
    () => {

        chatScreen.classList.add(
            "hidden"
        );


        dashboard.classList.add(
            "active"
        );


        // Change music back

        chatMusic.pause();

        chatMusic.currentTime = 0;

        bgMusic.currentTime = 0;

        bgMusic.play().catch(() => {});

    }
);


// =========================================
// LOAD OLD MESSAGES
// =========================================

async function loadMessages() {

    messagesBox.innerHTML = "";


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
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Message loading error:",
            error
        );

        return;
    }


    for (const message of data) {

        await displayMessage(
            message
        );

    }


    scrollMessagesToBottom();
}


// =========================================
// DISPLAY MESSAGE
// =========================================

async function displayMessage(message) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "message " +
        (
            message.sender_name === chatName
                ? "mine"
                : ""
        );


    const time =
        new Date(
            message.created_at
        ).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const nameHTML =
        escapeHTML(
            message.sender_name
        );


    let contentHTML = "";


    // =====================================
    // IMAGE MESSAGE
    // =====================================

    if (
        message.message_type === "image" &&
        message.file_path
    ) {

        const {
            data,
            error
        } =
            await supabaseClient

                .storage

                .from("chat-images")

                .createSignedUrl(
                    message.file_path,
                    3600
                );


        if (!error && data) {

            contentHTML = `

                <img
                    src="${data.signedUrl}"
                    class="message-image"
                    alt="Shared photo"
                    loading="lazy"
                    onclick="window.open(
                        this.src,
                        '_blank'
                    )"
                >

            `;

        } else {

            contentHTML = `

                <div class="message-text">
                    📷 Photo unavailable
                </div>

            `;

        }

    }


    // =====================================
    // TEXT MESSAGE
    // =====================================

    else {

        contentHTML = `

            <div class="message-text">

                ${escapeHTML(
                    message.message || ""
                )}

            </div>

        `;

    }


    div.innerHTML = `

        <div class="message-name">
            ${nameHTML}
        </div>

        ${contentHTML}

        <div class="message-time">
            ${time}
        </div>

    `;


    messagesBox.appendChild(
        div
    );


    scrollMessagesToBottom();
}


// =========================================
// SEND TEXT MESSAGE
// =========================================

async function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) return;

    if (!chatName) return;


    sendMessageBtn.disabled =
        true;


    const {
        error
    } =
        await supabaseClient

            .from("messages")

            .insert({

                sender_name:
                    chatName,

                message:
                    text,

                message_type:
                    "text",

                file_path:
                    null

            });


    sendMessageBtn.disabled =
        false;


    if (error) {

        console.error(
            "Message send error:",
            error
        );

        alert(
            "Message send nahi hua."
        );

        return;
    }


    messageInput.value = "";

    messageInput.focus();
}


sendMessageBtn.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// =========================================
// CHAT PHOTO INPUT
// =========================================

photoInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) return;


        // Image check

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Sirf image select kar."
            );

            photoInput.value = "";

            return;
        }


        // Size check

        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {

            alert(
                "Photo 5MB se chhoti honi chahiye."
            );

            photoInput.value = "";

            return;
        }


        if (!chatName) {

            alert(
                "Pehle chat mein enter karo."
            );

            photoInput.value = "";

            return;
        }


        try {

            await sendPhoto(file);

        } catch (error) {

            console.error(
                "Photo error:",
                error
            );

            alert(
                "Photo send nahi hui."
            );

        }


        photoInput.value = "";

    }
);


// =========================================
// SEND CHAT PHOTO
// =========================================

async function sendPhoto(file) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const safeName =
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const filePath =
        "chat/" +
        safeName;


    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from("chat-images")

            .upload(
                filePath,
                file,
                {

                    cacheControl:
                        "3600",

                    contentType:
                        file.type,

                    upsert:
                        false

                }
            );


    if (uploadError) {

        console.error(
            "Upload error:",
            uploadError
        );

        throw uploadError;
    }


    const {
        error: dbError
    } =
        await supabaseClient

            .from("messages")

            .insert({

                sender_name:
                    chatName,

                message:
                    "📷 Photo",

                message_type:
                    "image",

                file_path:
                    filePath

            });


    if (dbError) {

        console.error(
            "Photo database error:",
            dbError
        );

        throw dbError;
    }
}


// =========================================
// REALTIME CHAT
// =========================================

function startRealtimeChat() {

    if (chatChannel) return;


    chatChannel =
        supabaseClient

            .channel(
                "prsn-chat"
            )

            .on(

                "postgres_changes",

                {

                    event: "INSERT",

                    schema: "public",

                    table: "messages"

                },

                async payload => {

                    console.log(
                        "🔥 REALTIME:",
                        payload.new
                    );


                    await displayMessage(
                        payload.new
                    );

                }

            )

            .subscribe(

                status => {

                    console.log(
                        "PRSN realtime:",
                        status
                    );

                }

            );
}


// =========================================
// AMAZING WALL
// =========================================


// OPEN AMAZING WALL

galleryBtn.addEventListener(
    "click",
    async () => {

        dashboard.classList.remove(
            "active"
        );

        galleryScreen.classList.remove(
            "hidden"
        );


        await loadGallery();

        startRealtimeGallery();

    }
);


// BACK FROM AMAZING WALL

backFromGallery.addEventListener(
    "click",
    () => {

        galleryScreen.classList.add(
            "hidden"
        );

        dashboard.classList.add(
            "active"
        );

    }
);


// =========================================
// LOAD GALLERY
// =========================================

async function loadGallery() {

    galleryGrid.innerHTML = `

        <div class="gallery-loading">
            Loading amazing photos...
        </div>

    `;


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
            );


    if (error) {

        console.error(
            "Gallery loading error:",
            error
        );


        galleryGrid.innerHTML = `

            <div class="gallery-loading">

                ❌ Gallery load nahi hui.

                <br>

                <small>
                    Check Supabase table/policies.
                </small>

            </div>

        `;

        return;
    }


    galleryGrid.innerHTML = "";


    if (!data || data.length === 0) {

        galleryGrid.innerHTML = `

            <div class="gallery-loading">

                📸

                <br><br>

                Abhi wall empty hai.

                <br>

                Pehli amazing photo tu daal! 🔥

            </div>

        `;

        return;
    }


    for (const photo of data) {

        await displayGalleryPhoto(
            photo
        );

    }

}


// =========================================
// DISPLAY GALLERY PHOTO
// =========================================

async function displayGalleryPhoto(photo) {

    if (!photo || !photo.image_path) {
        return;
    }


    // Avoid duplicate cards

    const existing =
        document.querySelector(
            `[data-gallery-id="${photo.id}"]`
        );


    if (existing) {
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient

            .storage

            .from("prsn-gallery")

            .createSignedUrl(
                photo.image_path,
                3600
            );


    if (error || !data) {

        console.error(
            "Gallery image URL error:",
            error
        );

        return;
    }


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "gallery-photo-card";


    card.dataset.galleryId =
        photo.id;


    const uploader =
        escapeHTML(
            photo.uploader_name ||
            "UNKNOWN"
        );


    const date =
        new Date(
            photo.created_at
        ).toLocaleDateString(
            [],
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    card.innerHTML = `

        <div class="gallery-image-wrap">

            <img
                src="${data.signedUrl}"
                class="gallery-image"
                alt="PRSN Amazing Wall photo"
                loading="lazy"
            >

        </div>


        <div class="gallery-info">

            <div class="gallery-uploader">
                ${uploader}
            </div>

            <div class="gallery-date">
                ${date}
            </div>

        </div>

    `;


    // Open larger image

    const image =
        card.querySelector(
            ".gallery-image"
        );


    image.addEventListener(
        "click",
        () => {

            window.open(
                data.signedUrl,
                "_blank"
            );

        }
    );


    galleryGrid.appendChild(
        card
    );

}


// =========================================
// UPLOAD AMAZING WALL PHOTO
// =========================================

galleryInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) return;


        // Check image

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Sirf image upload kar sakte ho."
            );

            galleryInput.value = "";

            return;
        }


        // Check size

        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {

            alert(
                "Photo 5MB se chhoti honi chahiye."
            );

            galleryInput.value = "";

            return;
        }


        if (!currentUser) {

            alert(
                "Pehle PRSN mein enter karo."
            );

            galleryInput.value = "";

            return;
        }


        try {

            // Disable button visually

            const uploadButton =
                document.querySelector(
                    ".gallery-upload-btn"
                );


            if (uploadButton) {

                uploadButton.textContent =
                    "⏳ UPLOADING...";

                uploadButton.style.pointerEvents =
                    "none";

            }


            await uploadGalleryPhoto(
                file
            );


            alert(
                "🔥 Photo Amazing Wall par upload ho gayi!"
            );


            await loadGallery();


        } catch (error) {

            console.error(
                "Gallery upload error:",
                error
            );


            alert(
                "Photo upload nahi hui. Supabase policies check karo."
            );


        } finally {

            const uploadButton =
                document.querySelector(
                    ".gallery-upload-btn"
                );


            if (uploadButton) {

                uploadButton.textContent =
                    "📸 UPLOAD PHOTO";

                uploadButton.style.pointerEvents =
                    "auto";

            }


            galleryInput.value = "";

        }

    }
);


// =========================================
// UPLOAD GALLERY PHOTO TO STORAGE
// =========================================

async function uploadGalleryPhoto(file) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const safeName =
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const filePath =
        "wall/" +
        safeName;


    // =====================================
    // STORAGE UPLOAD
    // =====================================

    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from("prsn-gallery")

            .upload(
                filePath,
                file,
                {

                    cacheControl:
                        "3600",

                    contentType:
                        file.type,

                    upsert:
                        false

                }
            );


    if (uploadError) {

        console.error(
            "Gallery storage upload error:",
            uploadError
        );

        throw uploadError;
    }


    // =====================================
    // DATABASE ENTRY
    // =====================================

    const {
        error: dbError
    } =
        await supabaseClient

            .from("gallery_photos")

            .insert({

                uploader_name:
                    currentUser,

                image_path:
                    filePath,

                caption:
                    null

            });


    if (dbError) {

        console.error(
            "Gallery database error:",
            dbError
        );


        // Try deleting uploaded file
        // if database insert failed

        await supabaseClient

            .storage

            .from("prsn-gallery")

            .remove([
                filePath
            ]);


        throw dbError;
    }

}


// =========================================
// REALTIME AMAZING WALL
// =========================================

function startRealtimeGallery() {

    if (galleryChannel) return;


    galleryChannel =
        supabaseClient

            .channel(
                "prsn-amazing-wall"
            )

            .on(

                "postgres_changes",

                {

                    event: "INSERT",

                    schema: "public",

                    table: "gallery_photos"

                },

                async payload => {

                    console.log(
                        "🔥 NEW AMAZING WALL PHOTO:",
                        payload.new
                    );


                    // Only update if gallery is open

                    if (
                        galleryScreen.classList.contains(
                            "hidden"
                        )
                    ) {

                        return;
                    }


                    await displayGalleryPhoto(
                        payload.new
                    );

                }

            )

            .subscribe(

                status => {

                    console.log(
                        "PRSN gallery realtime:",
                        status
                    );

                }

            );

}


// =========================================
// LAST SEEN
// =========================================

async function updateLastSeen() {

    if (!currentUser) return;


    const {
        error
    } =
        await supabaseClient

            .from("members")

            .update({

                last_seen_at:
                    new Date()
                        .toISOString()

            })

            .eq(
                "name",
                currentUser
            );


    if (error) {

        console.error(
            "Last seen error:",
            error
        );

    }

}


// Update activity periodically

setInterval(
    () => {

        if (currentUser) {

            updateLastSeen();

        }

    },
    60000
);


// =========================================
// HTML ESCAPE
// =========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;
}


// =========================================
// SCROLL CHAT
// =========================================

function scrollMessagesToBottom() {

    messagesBox.scrollTop =
        messagesBox.scrollHeight;

}


// =========================================
// SUPABASE TEST
// =========================================

async function testSupabase() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from("members")

            .select("*");


    if (error) {

        console.error(
            "❌ Supabase connection failed:",
            error
        );

        return;
    }


    console.log(
        "✅ PRSN SUPABASE CONNECTED!"
    );


    console.log(
        "Members:",
        data
    );

}


testSupabase();
