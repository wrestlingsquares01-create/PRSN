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

const MAX_VOICE_SIZE =
    10 * 1024 * 1024;


// =========================================
// VARIABLES
// =========================================

let currentUser = null;

let chatName = null;

let chatChannel = null;

let galleryChannel = null;


// VOICE VARIABLES

let mediaRecorder = null;

let voiceChunks = [];

let voiceStream = null;

let voiceRecording = false;

let voiceStartTime = null;

let voiceTimerInterval = null;


// =========================================
// ELEMENTS
// =========================================

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


const bgMusic =
    document.getElementById("bgMusic");

const chatMusic =
    document.getElementById("chatMusic");

const musicBtn =
    document.getElementById("musicBtn");


// CHAT

const chatBtn =
    document.getElementById("chatBtn");

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


const chatNameModal =
    document.getElementById("chatNameModal");

const chatNameInput =
    document.getElementById("chatNameInput");

const enterCommunity =
    document.getElementById("enterCommunity");

const chatNameError =
    document.getElementById("chatNameError");


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


// VOICE

const voiceRecordBtn =
    document.getElementById("voiceRecordBtn");

const voiceStatus =
    document.getElementById("voiceStatus");

const voiceStatusText =
    document.getElementById("voiceStatusText");

const voiceTimer =
    document.getElementById("voiceTimer");


// GALLERY

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
// MUSIC
// =========================================

musicBtn.addEventListener(
    "click",
    () => {

        if (!bgMusic.paused) {

            bgMusic.pause();

            musicBtn.textContent = "♪";

        } else {

            bgMusic.play();

            musicBtn.textContent = "♫";

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
// CLOSE CHAT MODAL
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
// CORRECT CODE
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


    bgMusic.pause();

    bgMusic.currentTime = 0;

    chatMusic.currentTime = 0;

    chatMusic.play().catch(() => {

        console.log(
            "Browser blocked chat music autoplay."
        );

    });


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
// ENTER CHAT
// =========================================

function enterChatWithName() {

    const entered =
        chatNameInput.value.trim();


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
    async () => {

        if (voiceRecording) {
            await cancelVoiceRecording();
        }


        chatScreen.classList.add(
            "hidden"
        );

        dashboard.classList.add(
            "active"
        );


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
    } = await supabaseClient

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

    // Prevent accidental duplicate realtime cards

    const existing =
        document.querySelector(
            `[data-message-id="${message.id}"]`
        );

    if (existing) {
        return;
    }


    const div =
        document.createElement("div");


    div.className =
        "message " +
        (
            message.sender_name === chatName
                ? "mine"
                : ""
        );


    div.dataset.messageId =
        message.id;


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


    // =========================================
    // IMAGE
    // =========================================

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


    // =========================================
    // VOICE
    // =========================================

    else if (
        message.message_type === "voice" &&
        message.file_path
    ) {

        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from("chat-voice")
                .createSignedUrl(
                    message.file_path,
                    3600
                );


        if (!error && data) {

            contentHTML = `

                <div class="voice-message">

                    <div class="voice-message-icon">
                        🎙️
                    </div>

                    <audio
                        class="voice-audio"
                        controls
                        preload="metadata"
                        src="${data.signedUrl}"
                    ></audio>

                </div>

            `;

        } else {

            contentHTML = `

                <div class="message-text">
                    🎙️ Voice unavailable
                </div>

            `;

        }

    }


    // =========================================
    // TEXT
    // =========================================

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
// SEND TEXT
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
// PHOTO SEND
// =========================================

photoInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) return;


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
// UPLOAD PHOTO
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
// VOICE RECORDING
// =========================================

voiceRecordBtn.addEventListener(
    "pointerdown",
    startVoiceRecording
);


voiceRecordBtn.addEventListener(
    "pointerup",
    stopVoiceRecording
);


voiceRecordBtn.addEventListener(
    "pointerleave",
    () => {

        if (voiceRecording) {
            stopVoiceRecording();
        }

    }
);


voiceRecordBtn.addEventListener(
    "pointercancel",
    () => {

        if (voiceRecording) {
            cancelVoiceRecording();
        }

    }
);


// Prevent double firing

voiceRecordBtn.addEventListener(
    "contextmenu",
    event => {
        event.preventDefault();
    }
);


// =========================================
// START RECORDING
// =========================================

async function startVoiceRecording(event) {

    event.preventDefault();


    if (voiceRecording) {
        return;
    }


    if (!chatName) {

        alert(
            "Pehle chat mein enter karo."
        );

        return;
    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Is browser mein microphone recording supported nahi hai."
        );

        return;
    }


    try {

        voiceStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        let mimeType =
            "audio/webm";


        if (
            MediaRecorder.isTypeSupported(
                "audio/webm;codecs=opus"
            )
        ) {

            mimeType =
                "audio/webm;codecs=opus";

        } else if (
            MediaRecorder.isTypeSupported(
                "audio/mp4"
            )
        ) {

            mimeType =
                "audio/mp4";

        }


        mediaRecorder =
            new MediaRecorder(
                voiceStream,
                {
                    mimeType
                }
            );


        voiceChunks = [];

        voiceRecording = true;

        voiceStartTime =
            Date.now();


        mediaRecorder.addEventListener(
            "dataavailable",
            event => {

                if (
                    event.data &&
                    event.data.size > 0
                ) {

                    voiceChunks.push(
                        event.data
                    );

                }

            }
        );


        mediaRecorder.addEventListener(
            "stop",
            async () => {

                const finalType =
                    mediaRecorder.mimeType ||
                    mimeType;


                const blob =
                    new Blob(
                        voiceChunks,
                        {
                            type:
                                finalType
                        }
                    );


                cleanupVoiceUI();


                if (
                    blob.size === 0
                ) {

                    return;
                }


                try {

                    await uploadVoice(
                        blob,
                        finalType
                    );

                } catch (error) {

                    console.error(
                        "Voice upload error:",
                        error
                    );

                    alert(
                        "Voice send nahi hui."
                    );

                }

            }
        );


        mediaRecorder.start();


        voiceStatus.classList.remove(
            "hidden"
        );


        voiceRecordBtn.classList.add(
            "recording"
        );


        voiceStatusText.textContent =
            "Recording...";


        updateVoiceTimer();


        voiceTimerInterval =
            setInterval(
                updateVoiceTimer,
                250
            );


    } catch (error) {

        console.error(
            "Microphone error:",
            error
        );


        alert(
            "Microphone permission allow karni padegi."
        );


        cleanupVoiceUI();
    }
}


// =========================================
// STOP RECORDING
// =========================================

async function stopVoiceRecording() {

    if (
        !voiceRecording ||
        !mediaRecorder
    ) {
        return;
    }


    voiceRecording = false;


    voiceStatusText.textContent =
        "Sending...";


    voiceRecordBtn.classList.remove(
        "recording"
    );


    if (
        mediaRecorder.state !==
        "inactive"
    ) {

        mediaRecorder.stop();

    }


    stopVoiceStream();
}


// =========================================
// CANCEL RECORDING
// =========================================

async function cancelVoiceRecording() {

    if (!voiceRecording) {
        return;
    }


    voiceRecording = false;


    if (
        mediaRecorder &&
        mediaRecorder.state !==
        "inactive"
    ) {

        mediaRecorder.ondataavailable =
            null;

        mediaRecorder.onstop =
            null;

        mediaRecorder.stop();

    }


    voiceChunks = [];


    stopVoiceStream();

    cleanupVoiceUI();
}


// =========================================
// UPLOAD VOICE
// =========================================

async function uploadVoice(
    blob,
    mimeType
) {

    if (!chatName) {
        return;
    }


    if (
        blob.size >
        MAX_VOICE_SIZE
    ) {

        alert(
            "Voice recording 10MB se chhoti honi chahiye."
        );

        return;
    }


    let extension =
        "webm";


    if (
        mimeType.includes(
            "mp4"
        )
    ) {

        extension =
            "m4a";

    } else if (
        mimeType.includes(
            "ogg"
        )
    ) {

        extension =
            "ogg";
    }


    const safeName =
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const filePath =
        "voice/" +
        safeName;


    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from("chat-voice")

            .upload(
                filePath,
                blob,
                {
                    cacheControl:
                        "3600",

                    contentType:
                        mimeType,

                    upsert:
                        false
                }
            );


    if (uploadError) {

        console.error(
            "Voice storage error:",
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
                    "🎙️ Voice message",

                message_type:
                    "voice",

                file_path:
                    filePath

            });


    if (dbError) {

        console.error(
            "Voice database error:",
            dbError
        );


        // Remove orphaned file

        await supabaseClient
            .storage
            .from("chat-voice")
            .remove([
                filePath
            ]);


        throw dbError;
    }
}


// =========================================
// VOICE TIMER
// =========================================

function updateVoiceTimer() {

    if (!voiceStartTime) {
        return;
    }


    const elapsed =
        Math.floor(
            (
                Date.now() -
                voiceStartTime
            ) / 1000
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    voiceTimer.textContent =
        minutes +
        ":" +
        String(seconds)
            .padStart(2, "0");
}


// =========================================
// VOICE UI CLEANUP
// =========================================

function cleanupVoiceUI() {

    clearInterval(
        voiceTimerInterval
    );


    voiceTimerInterval =
        null;


    voiceRecording =
        false;


    voiceStartTime =
        null;


    voiceStatus.classList.add(
        "hidden"
    );


    voiceRecordBtn.classList.remove(
        "recording"
    );


    voiceStatusText.textContent =
        "Recording...";


    voiceTimer.textContent =
        "0:00";
}


// =========================================
// STOP MICROPHONE
// =========================================

function stopVoiceStream() {

    if (!voiceStream) {
        return;
    }


    voiceStream
        .getTracks()
        .forEach(
            track => {
                track.stop();
            }
        );


    voiceStream =
        null;
}


// =========================================
// REALTIME CHAT
// =========================================

function startRealtimeChat() {

    if (chatChannel) {
        return;
    }


    chatChannel =
        supabaseClient

            .channel(
                "prsn-chat"
            )

            .on(

                "postgres_changes",

                {

                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "messages"

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
// LAST SEEN
// =========================================

async function updateLastSeen() {

    if (!currentUser) {
        return;
    }


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


// =========================================
// AMAZING WALL
// =========================================

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


// =========================================
// BACK FROM GALLERY
// =========================================

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
            Loading amazing moments...
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
                Gallery load nahi hui.
            </div>

        `;

        return;
    }


    galleryGrid.innerHTML = "";


    if (!data || data.length === 0) {

        galleryGrid.innerHTML = `

            <div class="gallery-loading">
                Abhi wall khaali hai 😭
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

async function displayGalleryPhoto(
    photo
) {

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


    if (
        error ||
        !data
    ) {

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


    const date =
        new Date(
            photo.created_at
        ).toLocaleDateString(
            [],
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );


    card.innerHTML = `

        <div class="gallery-image-wrap">

            <img
                class="gallery-image"
                src="${data.signedUrl}"
                alt="PRSN photo"
                loading="lazy"
            >

        </div>


        <div class="gallery-info">

            <div class="gallery-uploader">
                ${escapeHTML(
                    photo.uploader_name
                )}
            </div>

            <div class="gallery-date">
                ${date}
            </div>

        </div>

    `;


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
// GALLERY UPLOAD
// =========================================

galleryInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Sirf image upload kar."
            );

            galleryInput.value =
                "";

            return;
        }


        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {

            alert(
                "Photo 5MB se chhoti honi chahiye."
            );

            galleryInput.value =
                "";

            return;
        }


        if (!currentUser) {

            alert(
                "Pehle PRSN mein enter karo."
            );

            galleryInput.value =
                "";

            return;
        }


        const uploadButton =
            document.querySelector(
                ".gallery-upload-btn"
            );


        const oldText =
            uploadButton.textContent;


        uploadButton.textContent =
            "⏳ UPLOADING...";


        uploadButton.style.pointerEvents =
            "none";


        try {

            await uploadGalleryPhoto(
                file
            );


            alert(
                "🔥 Photo Amazing Wall pe aa gayi!"
            );


            await loadGallery();


        } catch (error) {

            console.error(
                "Gallery upload error:",
                error
            );


            alert(
                "Photo upload nahi hui."
            );

        }


        uploadButton.textContent =
            oldText;


        uploadButton.style.pointerEvents =
            "";


        galleryInput.value =
            "";
    }
);


// =========================================
// UPLOAD GALLERY PHOTO
// =========================================

async function uploadGalleryPhoto(
    file
) {

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

        throw uploadError;
    }


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
// REALTIME GALLERY
// =========================================

function startRealtimeGallery() {

    if (galleryChannel) {
        return;
    }


    galleryChannel =
        supabaseClient

            .channel(
                "prsn-amazing-wall"
            )

            .on(

                "postgres_changes",

                {

                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "gallery_photos"

                },

                async payload => {

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
// SCROLL
// =========================================

function scrollMessagesToBottom() {

    messagesBox.scrollTop =
        messagesBox.scrollHeight;
}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
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

            .select("name");


    if (error) {

        console.error(
            "Supabase test failed:",
            error
        );

        return false;
    }


    console.log(
        "🔥 Supabase connected:",
        data
    );


    return true;
}


// =========================================
// START TEST
// =========================================

testSupabase();
