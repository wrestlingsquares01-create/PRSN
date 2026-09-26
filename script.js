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

const INITIAL_MESSAGES_LIMIT = 50;


// =========================================
// VARIABLES
// =========================================

let currentUser = null;
let chatName = null;

let chatChannel = null;
let galleryChannel = null;


// =========================================
// VOICE VARIABLES
// =========================================

let mediaRecorder = null;
let voiceChunks = [];
let voiceStream = null;

let voiceRecording = false;
let voiceStartTime = null;
let voiceTimerInterval = null;


// =========================================
// CHAT MUSIC / VOICE
// =========================================

let chatMusicWasPlaying = false;


function pauseChatMusicForVoice() {

    chatMusicWasPlaying =
        !chatMusic.paused;

    if (chatMusicWasPlaying) {
        chatMusic.pause();
    }
}


function resumeChatMusicAfterVoice() {

    if (chatMusicWasPlaying) {

        chatMusic
            .play()
            .catch(() => {});

        chatMusicWasPlaying = false;
    }
}


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


// =========================================
// MUSIC
// =========================================

const bgMusic =
    document.getElementById("bgMusic");

const chatMusic =
    document.getElementById("chatMusic");

const musicBtn =
    document.getElementById("musicBtn");


// =========================================
// CHAT
// =========================================

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


// =========================================
// CHAT SCREEN
// =========================================

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
// VOICE
// =========================================

const voiceRecordBtn =
    document.getElementById("voiceRecordBtn");

const voiceStatus =
    document.getElementById("voiceStatus");

const voiceStatusText =
    document.getElementById("voiceStatusText");

const voiceTimer =
    document.getElementById("voiceTimer");


// =========================================
// GALLERY
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


    currentUser =
        typedName;

    chatName =
        currentUser;


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

    bgMusic
        .play()
        .catch(() => {});


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

            bgMusic
                .play()
                .catch(() => {});

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

        chatCodeInput.value =
            "";

        chatError.textContent =
            "";

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
// CHECK CODEWORD
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


    // =====================================
    // CODE CORRECT
    // =====================================

    chatModal.classList.add(
        "hidden"
    );


    // =====================================
    // IMPORTANT:
    // NO NAME POPUP NOW
    // =====================================

    chatName =
        currentUser;


    // =====================================
    // MUSIC CHANGE
    // =====================================

    bgMusic.pause();

    bgMusic.currentTime =
        0;

    chatMusic.currentTime =
        0;

    chatMusic
        .play()
        .catch(() => {});


    // =====================================
    // OPEN CHAT DIRECTLY
    // =====================================

    dashboard.classList.remove(
        "active"
    );

    chatScreen.classList.remove(
        "hidden"
    );


    // Load latest messages
    loadMessages();

    startRealtimeChat();


    setTimeout(() => {

        messageInput.focus();

    }, 200);
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

        chatMusic.currentTime =
            0;

        chatMusicWasPlaying =
            false;


        bgMusic.currentTime =
            0;

        bgMusic
            .play()
            .catch(() => {});

    }
);


// =========================================
// LOAD LATEST MESSAGES
// =========================================

async function loadMessages() {

    messagesBox.innerHTML = "";


    /*
        IMPORTANT:

        Sirf latest 50 messages fetch.
        Isse old 100s/1000s messages
        load hone ka wait nahi karna padega.
    */

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

            .limit(
                INITIAL_MESSAGES_LIMIT
            );


    if (error) {

        console.error(
            "Message loading error:",
            error
        );

        messagesBox.innerHTML = `

            <div class="message-text">
                Messages load nahi hue.
            </div>

        `;

        return;
    }


    /*
        Database newest → oldest de raha hai.

        UI mein oldest → newest chahiye,
        isliye reverse.
    */

    data.reverse();


    /*
        Sab messages pehle prepare honge,
        phir ek saath screen par add honge.

        Isse "upar se messages load hote hue"
        wala effect nahi aayega.
    */

    const messageElements =
        await Promise.all(

            data.map(
                message =>
                    createMessageElement(
                        message
                    )
            )

        );


    const fragment =
        document.createDocumentFragment();


    for (
        const element of messageElements
    ) {

        if (element) {
            fragment.appendChild(
                element
            );
        }

    }


    messagesBox.appendChild(
        fragment
    );


    /*
        Direct latest message.
    */

    requestAnimationFrame(() => {

        messagesBox.scrollTop =
            messagesBox.scrollHeight;

    });
}


// =========================================
// CREATE MESSAGE ELEMENT
// =========================================

async function createMessageElement(
    message
) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "message " +
        (
            message.sender_name ===
            chatName
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
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );


    const nameHTML =
        escapeHTML(
            message.sender_name
        );


    let contentHTML =
        "";


    // =====================================
    // IMAGE
    // =====================================

    if (
        message.message_type ===
            "image" &&
        message.file_path
    ) {

        const {
            data,
            error
        } =
            await supabaseClient

                .storage

                .from(
                    "chat-images"
                )

                .createSignedUrl(
                    message.file_path,
                    3600
                );


        if (
            !error &&
            data
        ) {

            contentHTML = `

                <img
                    src="${data.signedUrl}"
                    class="message-image"
                    alt="Shared photo"
                    loading="lazy"
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
    // VOICE
    // =====================================

    else if (
        message.message_type ===
            "voice" &&
        message.file_path
    ) {

        const {
            data,
            error
        } =
            await supabaseClient

                .storage

                .from(
                    "chat-voice"
                )

                .createSignedUrl(
                    message.file_path,
                    3600
                );


        if (
            !error &&
            data
        ) {

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


    // =====================================
    // TEXT
    // =====================================

    else {

        contentHTML = `

            <div class="message-text">
                ${escapeHTML(
                    message.message ||
                    ""
                )}
            </div>

        `;
    }


    // =====================================
    // DELETE BUTTON
    // ONLY FOR MY MESSAGE
    // =====================================

    let deleteHTML =
        "";


    if (
        message.sender_name ===
        chatName
    ) {

        deleteHTML = `

            <button
                class="message-delete-btn"
                type="button"
                title="Delete message"
            >
                ⋮
            </button>

            <div class="message-delete-menu hidden">

                <button
                    class="delete-action"
                    type="button"
                >
                    🗑 Delete
                </button>

            </div>

        `;
    }


    // =====================================
    // MESSAGE HTML
    // =====================================

    div.innerHTML = `

        <div class="message-top-row">

            <div class="message-name">
                ${nameHTML}
            </div>

            ${deleteHTML}

        </div>

        ${contentHTML}

        <div class="message-time">
            ${time}
        </div>

    `;


    // =====================================
    // IMAGE CLICK
    // =====================================

    const image =
        div.querySelector(
            ".message-image"
        );


    if (image) {

        image.addEventListener(
            "click",
            () => {

                window.open(
                    image.src,
                    "_blank"
                );

            }
        );
    }


    // =====================================
    // DELETE MENU
    // =====================================

    const deleteBtn =
        div.querySelector(
            ".message-delete-btn"
        );


    const deleteMenu =
        div.querySelector(
            ".message-delete-menu"
        );


    const deleteAction =
        div.querySelector(
            ".delete-action"
        );


    if (
        deleteBtn &&
        deleteMenu &&
        deleteAction
    ) {

        deleteBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                /*
                    Close other menus.
                */

                document
                    .querySelectorAll(
                        ".message-delete-menu"
                    )
                    .forEach(
                        menu => {

                            if (
                                menu !==
                                deleteMenu
                            ) {

                                menu.classList.add(
                                    "hidden"
                                );

                            }

                        }
                    );


                deleteMenu.classList.toggle(
                    "hidden"
                );

            }
        );


        deleteAction.addEventListener(
            "click",
            async () => {

                deleteMenu.classList.add(
                    "hidden"
                );


                const confirmed =
                    confirm(
                        "Delete this message?"
                    );


                if (!confirmed) {
                    return;
                }


                await deleteMessage(
                    message
                );

            }
        );
    }


    // =====================================
    // VOICE PLAYER
    // =====================================

    const voiceAudio =
        div.querySelector(
            ".voice-audio"
        );


    if (voiceAudio) {

        voiceAudio.addEventListener(
            "play",
            () => {

                pauseChatMusicForVoice();

            }
        );


        voiceAudio.addEventListener(
            "pause",
            () => {

                if (
                    voiceAudio.currentTime <
                    voiceAudio.duration
                ) {

                    resumeChatMusicAfterVoice();

                }

            }
        );


        voiceAudio.addEventListener(
            "ended",
            () => {

                resumeChatMusicAfterVoice();

            }
        );
    }


    return div;
}


// =========================================
// DISPLAY MESSAGE
// =========================================

async function displayMessage(
    message
) {

    /*
        Avoid duplicate realtime messages.
    */

    if (
        document.querySelector(
            `[data-message-id="${message.id}"]`
        )
    ) {

        return;

    }


    const element =
        await createMessageElement(
            message
        );


    if (!element) {
        return;
    }


    messagesBox.appendChild(
        element
    );


    scrollMessagesToBottom();
}


// =========================================
// SEND TEXT MESSAGE
// =========================================

async function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    if (!chatName) {
        return;
    }


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


    messageInput.value =
        "";

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
// DELETE MESSAGE
// =========================================

async function deleteMessage(
    message
) {

    /*
        Frontend safety check:
        sirf current user's messages.
    */

    if (
        message.sender_name !==
        chatName
    ) {

        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from("messages")

            .delete()

            .eq(
                "id",
                message.id
            );


    if (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Message delete nahi hua."
        );

        return;
    }


    /*
        Realtime DELETE event
        normally UI se remove karega.
    */

    const element =
        document.querySelector(
            `[data-message-id="${message.id}"]`
        );


    if (element) {

        element.remove();

    }


    /*
        Delete photo/voice from storage.
    */

    if (
        message.file_path &&
        message.message_type ===
            "image"
    ) {

        await supabaseClient

            .storage

            .from(
                "chat-images"
            )

            .remove([
                message.file_path
            ]);
    }


    if (
        message.file_path &&
        message.message_type ===
            "voice"
    ) {

        await supabaseClient

            .storage

            .from(
                "chat-voice"
            )

            .remove([
                message.file_path
            ]);
    }
}


// =========================================
// PHOTO INPUT
// =========================================

photoInput.addEventListener(
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
                "Sirf image select kar."
            );

            photoInput.value =
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

            photoInput.value =
                "";

            return;
        }


        try {

            await sendPhoto(
                file
            );

        } catch (error) {

            console.error(
                "Photo error:",
                error
            );

            alert(
                "Photo send nahi hui."
            );

        }


        photoInput.value =
            "";
    }
);


// =========================================
// SEND PHOTO
// =========================================

async function sendPhoto(
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
        "chat/" +
        safeName;


    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from(
                "chat-images"
            )

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

        await supabaseClient

            .storage

            .from(
                "chat-images"
            )

            .remove([
                filePath
            ]);

        throw dbError;
    }
}


// =========================================
// VOICE BUTTON
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


voiceRecordBtn.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


// =========================================
// START VOICE
// =========================================

async function startVoiceRecording(
    event
) {

    event.preventDefault();


    if (voiceRecording) {
        return;
    }


    if (!chatName) {
        return;
    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Microphone supported nahi hai."
        );

        return;
    }


    pauseChatMusicForVoice();


    try {

        voiceStream =
            await navigator
                .mediaDevices
                .getUserMedia({
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

        voiceRecording =
            true;

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

                resumeChatMusicAfterVoice();


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


        resumeChatMusicAfterVoice();


        cleanupVoiceUI();


        alert(
            "Microphone permission allow karni padegi."
        );
    }
}


// =========================================
// STOP VOICE
// =========================================

async function stopVoiceRecording() {

    if (
        !voiceRecording ||
        !mediaRecorder
    ) {

        return;
    }


    voiceRecording =
        false;


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
// CANCEL VOICE
// =========================================

async function cancelVoiceRecording() {

    if (!voiceRecording) {
        return;
    }


    voiceRecording =
        false;


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


    resumeChatMusicAfterVoice();
}


// =========================================
// UPLOAD VOICE
// =========================================

async function uploadVoice(
    blob,
    mimeType
) {

    if (
        blob.size >
        MAX_VOICE_SIZE
    ) {

        alert(
            "Voice 10MB se chhoti honi chahiye."
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


    const fileName =
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const filePath =
        "voice/" +
        fileName;


    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from(
                "chat-voice"
            )

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

        await supabaseClient

            .storage

            .from(
                "chat-voice"
            )

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
            .padStart(
                2,
                "0"
            );
}


// =========================================
// CLEANUP VOICE UI
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


            // ==============================
            // NEW MESSAGE
            // ==============================

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

                    await displayMessage(
                        payload.new
                    );

                }

            )


            // ==============================
            // DELETE MESSAGE
            // ==============================

            .on(

                "postgres_changes",

                {
                    event:
                        "DELETE",

                    schema:
                        "public",

                    table:
                        "messages"
                },

                payload => {

                    const element =
                        document.querySelector(
                            `[data-message-id="${payload.old.id}"]`
                        );


                    if (element) {

                        element.remove();

                    }

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


setInterval(
    () => {

        if (currentUser) {
            updateLastSeen();
        }

    },
    60000
);


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

            .from(
                "gallery_photos"
            )

            .select("*")

            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Gallery error:",
            error
        );

        return;
    }


    galleryGrid.innerHTML =
        "";


    for (
        const photo of data
    ) {

        await displayGalleryPhoto(
            photo
        );

    }
}


// =========================================
// DISPLAY GALLERY
// =========================================

async function displayGalleryPhoto(
    photo
) {

    if (
        document.querySelector(
            `[data-gallery-id="${photo.id}"]`
        )
    ) {

        return;
    }


    const {
        data,
        error
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


    if (
        error ||
        !data
    ) {

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
                src="${data.signedUrl}"
                class="gallery-image"
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

            return;
        }


        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {

            alert(
                "Photo 5MB se chhoti honi chahiye."
            );

            return;
        }


        try {

            await uploadGalleryPhoto(
                file
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


    const fileName =
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const filePath =
        "wall/" +
        fileName;


    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from(
                "prsn-gallery"
            )

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

            .from(
                "gallery_photos"
            )

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

            .from(
                "prsn-gallery"
            )

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
                        galleryScreen
                            .classList
                            .contains(
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
                        "Gallery realtime:",
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

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;
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
            "Supabase connection failed:",
            error
        );

        return;
    }


    console.log(
        "🔥 PRSN SUPABASE CONNECTED",
        data
    );
}


testSupabase();
