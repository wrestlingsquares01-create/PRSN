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


    // Start first music

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
// CLOSE CODE MODAL
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


    // Code correct

    chatModal.classList.add(
        "hidden"
    );


    // Change music NOW

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
// CHAT NAME
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


    // IMAGE MESSAGE

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


    // TEXT MESSAGE

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
// PHOTO SEND
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
// SCROLL
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