// ============================================================
// PRSN — THE OG JOURNEY
// FINAL SCRIPT.JS
// ============================================================

import * as THREE from "three";


// ============================================================
// CONFIG
// ============================================================

const CONFIG = window.PRSN_CONFIG || {

    SUPABASE_URL:
        "https://xvvtzhqyihwgjdzdqkvx.supabase.co",

    SUPABASE_PUBLISHABLE_KEY:
        "sb_publishable_Gp8pbf7ciC-QHUhMg6lyzA_WT6UaKoB"
};


const supabaseClient =
    window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_PUBLISHABLE_KEY
    );


// ============================================================
// PRSN SETTINGS
// ============================================================

const ALLOWED_USERS = [
    "SHYAM",
    "RAVI",
    "PRASHANT",
    "NUKS"
];

const CHAT_CODE =
    "BACHYO";


// Temporary frontend admin gate.
//
// IMPORTANT:
// Ye real security nahi hai.
// Final secure version ke liye Supabase Auth + RLS use karna best hai.

const ADMIN_USERNAME =
    "PRSN_ADMIN";

const ADMIN_PASSWORD =
    "BACHYO_ADMIN";


const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;

const MAX_VOICE_SIZE =
    10 * 1024 * 1024;

const INITIAL_MESSAGES_LIMIT =
    50;


// ============================================================
// APP STATE
// ============================================================

let currentUser =
    null;

let chatName =
    null;

let chatChannel =
    null;

let galleryChannel =
    null;


// ============================================================
// VOICE STATE
// ============================================================

let mediaRecorder =
    null;

let voiceStream =
    null;

let voiceChunks =
    [];

let voiceRecording =
    false;

let voiceCancelled =
    false;

let voiceStartTime =
    null;

let voiceTimerInterval =
    null;

let chatMusicWasPlaying =
    false;


// ============================================================
// THREE.JS STATE
// ============================================================

let scene;
let camera;
let renderer;

let trainGroup;
let trainWheels = [];
let smokePoints;

let journeyStarted =
    false;

let introFinished =
    false;

let renderActive =
    true;

let renderFrame =
    null;

let threeReady =
    false;

let journeyTimeline =
    null;

let trainMotion = {
    speed: 0
};

const cameraLook =
    new THREE.Vector3(
        0,
        1.8,
        3
    );

const introPointer = {
    x: 0,
    y: 0
};


// ============================================================
// MAIN ELEMENTS
// ============================================================

const introScreen =
    document.getElementById(
        "introScreen"
    );

const threeCanvas =
    document.getElementById(
        "threeCanvas"
    );

const introHero =
    document.getElementById(
        "introHero"
    );

const passengerHUD =
    document.getElementById(
        "passengerHUD"
    );

const introStartArea =
    document.getElementById(
        "introStartArea"
    );

const startJourneyBtn =
    document.getElementById(
        "startJourneyBtn"
    );

const skipIntroBtn =
    document.getElementById(
        "skipIntroBtn"
    );

const journeyStatus =
    document.getElementById(
        "journeyStatus"
    );

const cameraStatus =
    document.getElementById(
        "cameraStatus"
    );

const trainStatus =
    document.getElementById(
        "trainStatus"
    );

const altitudeStatus =
    document.getElementById(
        "altitudeStatus"
    );

const journeyProgressBar =
    document.getElementById(
        "journeyProgressBar"
    );

const cloudTransition =
    document.getElementById(
        "cloudTransition"
    );


// ============================================================
// NORMAL SCREENS
// ============================================================

const nameScreen =
    document.getElementById(
        "nameScreen"
    );

const dashboard =
    document.getElementById(
        "dashboard"
    );

const nameInput =
    document.getElementById(
        "nameInput"
    );

const enterBtn =
    document.getElementById(
        "enterBtn"
    );

const nameError =
    document.getElementById(
        "nameError"
    );

const currentUserElement =
    document.getElementById(
        "currentUser"
    );

const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );


// ============================================================
// ADMIN ELEMENTS
// ============================================================

const adminLoginScreen =
    document.getElementById(
        "adminLoginScreen"
    );

const adminPanel =
    document.getElementById(
        "adminPanel"
    );

const adminBackBtn =
    document.getElementById(
        "adminBackBtn"
    );

const adminUsername =
    document.getElementById(
        "adminUsername"
    );

const adminPassword =
    document.getElementById(
        "adminPassword"
    );

const adminLoginBtn =
    document.getElementById(
        "adminLoginBtn"
    );

const adminLoginError =
    document.getElementById(
        "adminLoginError"
    );

const adminRefreshBtn =
    document.getElementById(
        "adminRefreshBtn"
    );

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );

const adminMembersList =
    document.getElementById(
        "adminMembersList"
    );

const adminActivityList =
    document.getElementById(
        "adminActivityList"
    );

const adminDeletedList =
    document.getElementById(
        "adminDeletedList"
    );

const adminMediaList =
    document.getElementById(
        "adminMediaList"
    );

const activityUserFilter =
    document.getElementById(
        "activityUserFilter"
    );

const activityTypeFilter =
    document.getElementById(
        "activityTypeFilter"
    );


// ============================================================
// CHAT ELEMENTS
// ============================================================

const chatBtn =
    document.getElementById(
        "chatBtn"
    );

const chatModal =
    document.getElementById(
        "chatModal"
    );

const closeChat =
    document.getElementById(
        "closeChat"
    );

const chatCodeInput =
    document.getElementById(
        "chatCode"
    );

const unlockChat =
    document.getElementById(
        "unlockChat"
    );

const chatError =
    document.getElementById(
        "chatError"
    );

const chatScreen =
    document.getElementById(
        "chatScreen"
    );

const backFromChat =
    document.getElementById(
        "backFromChat"
    );

const messagesBox =
    document.getElementById(
        "messages"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const sendMessageBtn =
    document.getElementById(
        "sendMessage"
    );

const photoInput =
    document.getElementById(
        "photoInput"
    );


// ============================================================
// VOICE ELEMENTS
// ============================================================

const voiceRecordBtn =
    document.getElementById(
        "voiceRecordBtn"
    );

const voiceStatus =
    document.getElementById(
        "voiceStatus"
    );

const voiceStatusText =
    document.getElementById(
        "voiceStatusText"
    );

const voiceTimer =
    document.getElementById(
        "voiceTimer"
    );


// ============================================================
// GALLERY
// ============================================================

const galleryBtn =
    document.getElementById(
        "galleryBtn"
    );

const galleryScreen =
    document.getElementById(
        "galleryScreen"
    );

const backFromGallery =
    document.getElementById(
        "backFromGallery"
    );

const galleryInput =
    document.getElementById(
        "galleryInput"
    );

const galleryGrid =
    document.getElementById(
        "galleryGrid"
    );


// ============================================================
// MUSIC
// ============================================================

const bgMusic =
    document.getElementById(
        "bgMusic"
    );

const chatMusic =
    document.getElementById(
        "chatMusic"
    );

const musicBtn =
    document.getElementById(
        "musicBtn"
    );


// ============================================================
// CURSOR
// ============================================================

const cursorGlow =
    document.getElementById(
        "cursorGlow"
    );


// ============================================================
// GENERAL HELPERS
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(
            value ?? ""
        );

    return div.innerHTML;
}


function showScreen(screen) {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );

    screen?.classList.add(
        "active"
    );

    requestAnimationFrame(
        refreshRevealAnimations
    );
}


function formatDate(date) {

    if (!date) {
        return "Never";
    }

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


function formatTime(date) {

    return new Date(date)
        .toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}


function showError(
    element,
    text
) {

    if (!element) {
        return;
    }

    element.textContent =
        text;

    setTimeout(
        () => {

            if (
                element.textContent ===
                text
            ) {
                element.textContent = "";
            }

        },
        3200
    );
}


function scrollMessagesToBottom() {

    messagesBox.scrollTop =
        messagesBox.scrollHeight;
}


// ============================================================
// THREE.JS — INITIALIZE
// ============================================================

function initThreeScene() {

    try {

        scene =
            new THREE.Scene();

        scene.background =
            new THREE.Color(
                0x05080d
            );

        scene.fog =
            new THREE.FogExp2(
                0x07101a,
                0.014
            );


        camera =
            new THREE.PerspectiveCamera(
                52,
                window.innerWidth /
                window.innerHeight,
                0.1,
                500
            );


        camera.position.set(
            7.2,
            4.7,
            19
        );


        renderer =
            new THREE.WebGLRenderer({
                canvas:
                    threeCanvas,

                antialias:
                    true,

                alpha:
                    false,

                powerPreference:
                    "high-performance"
            });


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.7
            )
        );


        renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        renderer.toneMappingExposure =
            1.1;


        if (
            window.innerWidth >
            800
        ) {

            renderer.shadowMap.enabled =
                true;

            renderer.shadowMap.type =
                THREE.PCFSoftShadowMap;

        }


        createLighting();

        createWorld();

        createTrain();

        createSmoke();

        createStars();


        threeReady =
            true;


        window.addEventListener(
            "resize",
            resizeThree
        );


        window.addEventListener(
            "pointermove",
            event => {

                introPointer.x =
                    (
                        event.clientX /
                        window.innerWidth -
                        .5
                    );

                introPointer.y =
                    (
                        event.clientY /
                        window.innerHeight -
                        .5
                    );

            },
            {
                passive: true
            }
        );


        renderThree();

    }

    catch (error) {

        console.error(
            "3D scene failed:",
            error
        );

        threeReady =
            false;
    }

}


// ============================================================
// LIGHTING
// ============================================================

function createLighting() {

    const hemisphere =
        new THREE.HemisphereLight(
            0x8adfff,
            0x120609,
            1.5
        );

    scene.add(
        hemisphere
    );


    const moon =
        new THREE.DirectionalLight(
            0xb8e9ff,
            2.2
        );

    moon.position.set(
        10,
        18,
        15
    );

    moon.castShadow =
        renderer.shadowMap.enabled;

    scene.add(
        moon
    );


    const burgundy =
        new THREE.PointLight(
            0xb52e58,
            40,
            35,
            2
        );

    burgundy.position.set(
        -7,
        4,
        4
    );

    scene.add(
        burgundy
    );


    const stationLight =
        new THREE.PointLight(
            0xffd88b,
            25,
            28,
            2
        );

    stationLight.position.set(
        7,
        5,
        10
    );

    scene.add(
        stationLight
    );

}


// ============================================================
// WORLD
// ============================================================

function createWorld() {

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x071016,

            roughness:
                .98,

            metalness:
                .02
        });


    const ground =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                150,
                350
            ),
            groundMaterial
        );


    ground.rotation.x =
        -Math.PI / 2;

    ground.position.y =
        -.14;

    ground.position.z =
        -100;

    ground.receiveShadow =
        true;

    scene.add(
        ground
    );


    // ========================================================
    // RAILS
    // ========================================================

    const railMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x80909a,

            metalness:
                .85,

            roughness:
                .28
        });


    [
        -1.3,
        1.3
    ].forEach(
        x => {

            const rail =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .12,
                        .14,
                        330
                    ),
                    railMaterial
                );

            rail.position.set(
                x,
                .05,
                -120
            );

            rail.receiveShadow =
                true;

            scene.add(
                rail
            );

        }
    );


    // ========================================================
    // SLEEPERS
    // ========================================================

    const sleeperMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x251b19,

            roughness:
                .95
        });


    for (
        let z = 28;
        z > -270;
        z -= 2.2
    ) {

        const sleeper =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    4.1,
                    .10,
                    .30
                ),
                sleeperMaterial
            );

        sleeper.position.set(
            0,
            -.01,
            z
        );

        scene.add(
            sleeper
        );
    }


    // ========================================================
    // STATION
    // ========================================================

    const platformMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x171a1e,

            roughness:
                .80,

            metalness:
                .1
        });


    const platform =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                6,
                .55,
                28
            ),
            platformMaterial
        );

    platform.position.set(
        5.3,
        .10,
        9
    );

    platform.receiveShadow =
        true;

    scene.add(
        platform
    );


    const platformLine =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .12,
                .05,
                26
            ),
            new THREE.MeshBasicMaterial({
                color:
                    0xd8b466
            })
        );

    platformLine.position.set(
        2.45,
        .40,
        9
    );

    scene.add(
        platformLine
    );


    // ========================================================
    // LAMPS
    // ========================================================

    for (
        let z = 18;
        z > -220;
        z -= 18
    ) {

        createPole(
            -7,
            z
        );

        createPole(
            7,
            z - 7
        );

    }


    // ========================================================
    // TREES
    // ========================================================

    for (
        let z = 25;
        z > -230;
        z -= 9
    ) {

        createTree(
            -8 -
            Math.random() * 10,
            z +
            Math.random() * 5
        );

        createTree(
            8 +
            Math.random() * 12,
            z -
            Math.random() * 5
        );

    }


    // ========================================================
    // MOUNTAINS
    // ========================================================

    const mountainMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x101b22,

            roughness:
                1
        });


    for (
        let i = 0;
        i < 24;
        i++
    ) {

        const size =
            6 +
            Math.random() * 15;


        const mountain =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    size,
                    size * 1.6,
                    5
                ),
                mountainMaterial
            );


        const side =
            i % 2 === 0
                ? -1
                : 1;


        mountain.position.set(
            side *
            (
                25 +
                Math.random() * 35
            ),
            size * .7 - .1,
            -20 -
            Math.random() * 220
        );


        mountain.rotation.y =
            Math.random() *
            Math.PI;


        scene.add(
            mountain
        );

    }

}


// ============================================================
// POLE
// ============================================================

function createPole(
    x,
    z
) {

    const poleMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x313b43,

            metalness:
                .65,

            roughness:
                .4
        });


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .07,
                .09,
                5,
                8
            ),
            poleMaterial
        );


    pole.position.set(
        x,
        2.4,
        z
    );


    scene.add(
        pole
    );


    const arm =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.15,
                .06,
                .06
            ),
            poleMaterial
        );


    arm.position.set(
        x +
        (
            x > 0
                ? -.5
                : .5
        ),
        4.7,
        z
    );


    scene.add(
        arm
    );


    const bulb =
        new THREE.PointLight(
            0x8de9ff,
            3,
            8,
            2
        );


    bulb.position.set(
        x +
        (
            x > 0
                ? -1
                : 1
        ),
        4.55,
        z
    );


    scene.add(
        bulb
    );

}


// ============================================================
// TREE
// ============================================================

function createTree(
    x,
    z
) {

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .12,
                .17,
                1.8,
                6
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x33241d,

                roughness:
                    1
            })
        );


    trunk.position.set(
        x,
        .8,
        z
    );


    scene.add(
        trunk
    );


    const foliage =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                .95,
                2.5,
                7
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x0b261f,

                roughness:
                    1
            })
        );


    foliage.position.set(
        x,
        2.45,
        z
    );


    scene.add(
        foliage
    );

}


// ============================================================
// TRAIN
// ============================================================

function createTrain() {

    trainGroup =
        new THREE.Group();


    trainGroup.position.set(
        0,
        0,
        4
    );


    const burgundy =
        new THREE.MeshStandardMaterial({
            color:
                0x6b1531,

            metalness:
                .62,

            roughness:
                .28
        });


    const burgundyLight =
        new THREE.MeshStandardMaterial({
            color:
                0xa62c53,

            metalness:
                .52,

            roughness:
                .32
        });


    const dark =
        new THREE.MeshStandardMaterial({
            color:
                0x101319,

            metalness:
                .65,

            roughness:
                .30
        });


    const cream =
        new THREE.MeshStandardMaterial({
            color:
                0xd9d1c4,

            metalness:
                .28,

            roughness:
                .38
        });


    const glass =
        new THREE.MeshPhysicalMaterial({
            color:
                0x74dfff,

            roughness:
                .08,

            transmission:
                .22,

            transparent:
                true,

            opacity:
                .36,

            metalness:
                .05
        });


    // ========================================================
    // ENGINE BASE
    // ========================================================

    const engineBase =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.85,
                .45,
                4.1
            ),
            dark
        );


    engineBase.position.set(
        0,
        .65,
        0
    );


    engineBase.castShadow =
        true;


    trainGroup.add(
        engineBase
    );


    // ========================================================
    // ENGINE NOSE
    // ========================================================

    const engineNose =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.45,
                1.15,
                1.75
            ),
            burgundy
        );


    engineNose.position.set(
        0,
        1.38,
        -1.25
    );


    engineNose.castShadow =
        true;


    trainGroup.add(
        engineNose
    );


    // ========================================================
    // CABIN
    // ========================================================

    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.55,
                2.05,
                1.85
            ),
            burgundy
        );


    cabin.position.set(
        0,
        1.83,
        .95
    );


    cabin.castShadow =
        true;


    trainGroup.add(
        cabin
    );


    const cabinFront =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.20,
                .75,
                .06
            ),
            glass
        );


    cabinFront.position.set(
        0,
        2.05,
        -.005
    );


    trainGroup.add(
        cabinFront
    );


    // ========================================================
    // ROOF
    // ========================================================

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.85,
                .20,
                2.15
            ),
            cream
        );


    roof.position.set(
        0,
        2.95,
        .95
    );


    trainGroup.add(
        roof
    );


    // ========================================================
    // CHIMNEY
    // ========================================================

    const chimney =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .24,
                .34,
                1.25,
                12
            ),
            dark
        );


    chimney.position.set(
        0,
        2.35,
        -1.35
    );


    trainGroup.add(
        chimney
    );


    // ========================================================
    // GOLD STRIPE
    // ========================================================

    const stripe =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                .08,
                3.5
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0xd6ae5d,

                metalness:
                    .75,

                roughness:
                    .26
            })
        );


    stripe.position.set(
        0,
        1.10,
        0
    );


    trainGroup.add(
        stripe
    );


    // ========================================================
    // ENGINE HEADLIGHTS
    // ========================================================

    [
        -.72,
        .72
    ].forEach(
        x => {

            const lamp =
                new THREE.Mesh(
                    new THREE.SphereGeometry(
                        .16,
                        12,
                        12
                    ),
                    new THREE.MeshBasicMaterial({
                        color:
                            0xffe0a0
                    })
                );


            lamp.position.set(
                x,
                1.55,
                -2.15
            );


            trainGroup.add(
                lamp
            );


            const light =
                new THREE.PointLight(
                    0xffd993,
                    8,
                    13,
                    2
                );


            light.position.set(
                x,
                1.55,
                -2.35
            );


            trainGroup.add(
                light
            );

        }
    );


    // ========================================================
    // ENGINE WHEELS
    // ========================================================

    [
        -1.30,
        .1,
        1.30
    ].forEach(
        z => {

            createWheelPair(
                trainGroup,
                z
            );

        }
    );


    // ========================================================
    // COACHES
    // ========================================================

    const coach1 =
        createCoach(
            4.25,
            burgundyLight,
            glass
        );


    const coach2 =
        createCoach(
            8.10,
            burgundy,
            glass
        );


    const coach3 =
        createCoach(
            11.95,
            burgundyLight,
            glass
        );


    trainGroup.add(
        coach1,
        coach2,
        coach3
    );


    // ========================================================
    // PASSENGERS — STYLIZED SEATED KIDS
    // ========================================================

    addPassenger(
        coach1,
        -.55,
        -.52,
        0x3d86ff
    );

    addPassenger(
        coach1,
        .55,
        .48,
        0xff9a42
    );

    addPassenger(
        coach2,
        -.55,
        -.48,
        0x7fd75d
    );

    addPassenger(
        coach2,
        .55,
        .52,
        0xc34fff
    );


    scene.add(
        trainGroup
    );

}


// ============================================================
// TRAIN WHEEL
// ============================================================

function createWheelPair(
    group,
    z
) {

    [
        -1.43,
        1.43
    ].forEach(
        x => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        .48,
                        .48,
                        .22,
                        18
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            0x16181c,

                        metalness:
                            .85,

                        roughness:
                            .28
                    })
                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                x,
                .48,
                z
            );


            wheel.castShadow =
                true;


            group.add(
                wheel
            );


            trainWheels.push(
                wheel
            );

        }
    );

}


// ============================================================
// COACH
// ============================================================

function createCoach(
    localZ,
    bodyMaterial,
    glassMaterial
) {

    const coach =
        new THREE.Group();


    coach.position.z =
        localZ;


    const base =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.8,
                .42,
                3.20
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x12151a,

                metalness:
                    .7,

                roughness:
                    .3
            })
        );


    base.position.y =
        .65;


    coach.add(
        base
    );


    const lowerBody =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.72,
                .70,
                3.05
            ),
            bodyMaterial
        );


    lowerBody.position.y =
        1.10;


    coach.add(
        lowerBody
    );


    // pillars

    [
        [-1.20,-1.25],
        [1.20,-1.25],
        [-1.20,1.25],
        [1.20,1.25]
    ].forEach(
        ([x,z]) => {

            const pillar =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .16,
                        1.35,
                        .16
                    ),
                    bodyMaterial
                );


            pillar.position.set(
                x,
                1.92,
                z
            );


            coach.add(
                pillar
            );

        }
    );


    // transparent side glass

    [
        -1.29,
        1.29
    ].forEach(
        x => {

            const panel =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .05,
                        1.05,
                        2.45
                    ),
                    glassMaterial
                );


            panel.position.set(
                x,
                1.92,
                0
            );


            coach.add(
                panel
            );

        }
    );


    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.95,
                .18,
                3.30
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0xcac3b7,

                metalness:
                    .3,

                roughness:
                    .4
            })
        );


    roof.position.y =
        2.63;


    coach.add(
        roof
    );


    [
        -1.1,
        1.1
    ].forEach(
        z => {

            createWheelPair(
                coach,
                z
            );

        }
    );


    return coach;
}


// ============================================================
// PASSENGER
// ============================================================

function addPassenger(
    coach,
    x,
    z,
    shirtColor
) {

    const person =
        new THREE.Group();


    // seat

    const seat =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .7,
                .18,
                .65
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x20252a,

                roughness:
                    .8
            })
        );


    seat.position.y =
        1.36;


    person.add(
        seat
    );


    // body

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .50,
                .72,
                .35
            ),
            new THREE.MeshStandardMaterial({
                color:
                    shirtColor,

                roughness:
                    .65
            })
        );


    body.position.y =
        1.77;


    person.add(
        body
    );


    // head

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .28,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0xd29a74,

                roughness:
                    .82
            })
        );


    head.position.y =
        2.30;


    person.add(
        head
    );


    // hair

    const hair =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .285,
                12,
                8,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x1d1715,

                roughness:
                    .9
            })
        );


    hair.position.y =
        2.37;


    person.add(
        hair
    );


    // legs seated

    [
        -.14,
        .14
    ].forEach(
        legX => {

            const leg =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .14,
                        .55,
                        .14
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            0x222937
                    })
                );


            leg.position.set(
                legX,
                1.20,
                -.20
            );


            leg.rotation.x =
                -.55;


            person.add(
                leg
            );

        }
    );


    person.position.set(
        x,
        0,
        z
    );


    coach.add(
        person
    );

}


// ============================================================
// SMOKE
// ============================================================

function createSmoke() {

    const count =
        42;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[
            i * 3
        ] =
            (
                Math.random() -
                .5
            ) * .5;


        positions[
            i * 3 + 1
        ] =
            2.8 +
            Math.random() * 4;


        positions[
            i * 3 + 2
        ] =
            -1.35 +
            Math.random() * 1.6;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({
            color:
                0xbfd2dc,

            size:
                .20,

            transparent:
                true,

            opacity:
                .22,

            depthWrite:
                false
        });


    smokePoints =
        new THREE.Points(
            geometry,
            material
        );


    trainGroup.add(
        smokePoints
    );

}


// ============================================================
// STARS
// ============================================================

function createStars() {

    const count =
        500;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[
            i * 3
        ] =
            (
                Math.random() -
                .5
            ) * 200;


        positions[
            i * 3 + 1
        ] =
            15 +
            Math.random() * 60;


        positions[
            i * 3 + 2
        ] =
            -200 +
            Math.random() * 280;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const points =
        new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                color:
                    0xd9f6ff,

                size:
                    .10,

                transparent:
                    true,

                opacity:
                    .65
            })
        );


    scene.add(
        points
    );

}


// ============================================================
// UPDATE SMOKE
// ============================================================

function updateSmoke(
    delta
) {

    if (!smokePoints) {
        return;
    }


    const position =
        smokePoints.geometry
            .attributes
            .position;


    for (
        let i = 0;
        i < position.count;
        i++
    ) {

        let y =
            position.getY(i);


        let x =
            position.getX(i);


        let z =
            position.getZ(i);


        y +=
            delta *
            (
                .4 +
                Math.random() *
                .5
            );


        x +=
            Math.sin(
                performance.now() *
                .001 +
                i
            ) *
            .0015;


        z +=
            delta *
            .10;


        if (
            y >
            7
        ) {

            y =
                2.9 +
                Math.random() *
                .4;


            x =
                (
                    Math.random() -
                    .5
                ) * .25;


            z =
                -1.4 +
                Math.random() *
                .25;

        }


        position.setXYZ(
            i,
            x,
            y,
            z
        );

    }


    position.needsUpdate =
        true;

}


// ============================================================
// RENDER LOOP
// ============================================================

const threeClock =
    new THREE.Clock();


function renderThree() {

    if (
        !renderActive ||
        !renderer ||
        !scene ||
        !camera
    ) {

        return;
    }


    renderFrame =
        requestAnimationFrame(
            renderThree
        );


    const delta =
        Math.min(
            threeClock.getDelta(),
            .04
        );


    updateSmoke(
        delta
    );


    trainWheels.forEach(
        wheel => {

            wheel.rotation.x -=
                trainMotion.speed *
                delta *
                7;

        }
    );


    if (
        !journeyStarted &&
        trainGroup
    ) {

        trainGroup.rotation.z =
            Math.sin(
                performance.now() *
                .0013
            ) *
            .002;


        camera.position.x +=
            (
                7.2 +
                introPointer.x *
                .8 -
                camera.position.x
            ) *
            .025;


        camera.position.y +=
            (
                4.7 -
                introPointer.y *
                .35 -
                camera.position.y
            ) *
            .025;

    }


    camera.lookAt(
        cameraLook
    );


    renderer.render(
        scene,
        camera
    );

}


// ============================================================
// RESIZE 3D
// ============================================================

function resizeThree() {

    if (
        !renderer ||
        !camera
    ) {
        return;
    }


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.7
        )
    );

}


// ============================================================
// JOURNEY SEQUENCE
// ============================================================

function startJourney() {

    if (
        journeyStarted ||
        introFinished
    ) {

        return;
    }


    journeyStarted =
        true;


    startJourneyBtn.disabled =
        true;


    if (
        !threeReady ||
        !window.gsap
    ) {

        fallbackJourney();

        return;
    }


    const gsap =
        window.gsap;


    journeyTimeline =
        gsap.timeline({

            defaults: {
                ease:
                    "power2.inOut"
            },

            onUpdate() {

                const progress =
                    journeyTimeline
                        .progress();


                journeyProgressBar.style.width =
                    `${progress * 100}%`;


                altitudeStatus.textContent =
                    `${Math.round(
                        camera.position.y *
                        6
                    )} M`;

            },

            onComplete() {

                finishIntro();

            }

        });


    journeyTimeline

        // hide intro text

        .to(
            [
                introHero,
                passengerHUD
            ],
            {
                opacity:
                    0,

                y:
                    -30,

                duration:
                    .7
            },
            0
        )


        .to(
            introStartArea,
            {
                opacity:
                    0,

                scale:
                    .92,

                duration:
                    .5
            },
            0
        )


        // train starts

        .call(
            () => {

                cameraStatus.textContent =
                    "LIFTING";

                trainStatus.textContent =
                    "DEPARTING";

            },
            [],
            .2
        )


        .to(
            trainMotion,
            {
                speed:
                    1.8,

                duration:
                    2.2,

                ease:
                    "power2.in"
            },
            .2
        )


        .to(
            trainGroup.position,
            {
                z:
                    -28,

                duration:
                    3.3,

                ease:
                    "power2.in"
            },
            .2
        )


        // camera rises

        .to(
            camera.position,
            {
                x:
                    10,

                y:
                    11,

                z:
                    18,

                duration:
                    2.3
            },
            .4
        )


        .to(
            cameraLook,
            {
                x:
                    0,

                y:
                    1.3,

                z:
                    -8,

                duration:
                    2.3
            },
            .4
        )


        // drone mode

        .call(
            () => {

                cameraStatus.textContent =
                    "DRONE";

                trainStatus.textContent =
                    "MOVING";

            },
            [],
            2.5
        )


        .to(
            trainGroup.position,
            {
                z:
                    -68,

                duration:
                    4,

                ease:
                    "none"
            },
            2.5
        )


        .to(
            trainMotion,
            {
                speed:
                    3.0,

                duration:
                    1.5
            },
            2.5
        )


        .to(
            camera.position,
            {
                x:
                    12,

                y:
                    19,

                z:
                    2,

                duration:
                    3.6,

                ease:
                    "power1.inOut"
            },
            2.5
        )


        .to(
            cameraLook,
            {
                x:
                    0,

                y:
                    .8,

                z:
                    -38,

                duration:
                    3.6
            },
            2.5
        )


        // full overhead travel

        .call(
            () => {

                cameraStatus.textContent =
                    "AERIAL";

                trainStatus.textContent =
                    "CRUISING";

            },
            [],
            5.7
        )


        .to(
            trainGroup.position,
            {
                z:
                    -110,

                duration:
                    3.8,

                ease:
                    "power1.in"
            },
            6
        )


        .to(
            camera.position,
            {
                x:
                    5,

                y:
                    27,

                z:
                    -43,

                duration:
                    3.5
            },
            6
        )


        .to(
            cameraLook,
            {
                x:
                    0,

                y:
                    3,

                z:
                    -95,

                duration:
                    3.5
            },
            6
        )


        // clouds

        .call(
            () => {

                cameraStatus.textContent =
                    "CLOUDS";

                trainStatus.textContent =
                    "ARRIVING";

            },
            [],
            8.1
        )


        .to(
            cloudTransition,
            {
                opacity:
                    1,

                duration:
                    1.3,

                ease:
                    "power2.in"
            },
            8.3
        )


        .to(
            ".cloud-a",
            {
                x:
                    350,

                scale:
                    1.4,

                duration:
                    1.7
            },
            8.2
        )


        .to(
            ".cloud-b",
            {
                x:
                    -350,

                scale:
                    1.45,

                duration:
                    1.7
            },
            8.2
        )


        .to(
            ".cloud-c",
            {
                y:
                    -220,

                scale:
                    1.5,

                duration:
                    1.7
            },
            8.3
        );


}


// ============================================================
// FALLBACK JOURNEY
// ============================================================

function fallbackJourney() {

    introHero.style.opacity =
        "0";

    introStartArea.style.opacity =
        "0";

    cloudTransition.style.opacity =
        "1";


    setTimeout(
        finishIntro,
        1200
    );

}


// ============================================================
// SKIP INTRO
// ============================================================

function skipIntro() {

    if (
        introFinished
    ) {
        return;
    }


    if (
        journeyTimeline
    ) {

        journeyTimeline.kill();

    }


    if (
        window.gsap
    ) {

        window.gsap.to(
            cloudTransition,
            {
                opacity:
                    1,

                duration:
                    .45,

                onComplete:
                    finishIntro
            }
        );

    }

    else {

        finishIntro();

    }

}


// ============================================================
// FINISH INTRO
// ============================================================

function finishIntro() {

    if (
        introFinished
    ) {

        return;
    }


    introFinished =
        true;


    renderActive =
        false;


    if (
        renderFrame
    ) {

        cancelAnimationFrame(
            renderFrame
        );

    }


    showScreen(
        nameScreen
    );


    if (
        window.gsap
    ) {

        window.gsap.set(
            nameScreen,
            {
                opacity:
                    0
            }
        );


        window.gsap.to(
            nameScreen,
            {
                opacity:
                    1,

                duration:
                    .75
            }
        );


        window.gsap.to(
            introScreen,
            {
                opacity:
                    0,

                duration:
                    .8,

                onComplete() {

                    introScreen.style.display =
                        "none";


                    if (
                        renderer
                    ) {

                        renderer.dispose();

                    }


                    setTimeout(
                        () =>
                            nameInput.focus(),
                        250
                    );

                }
            }
        );

    }

    else {

        introScreen.style.display =
            "none";

        nameInput.focus();

    }

}


// ============================================================
// INTRO EVENTS
// ============================================================

startJourneyBtn.addEventListener(
    "click",
    startJourney
);


skipIntroBtn.addEventListener(
    "click",
    skipIntro
);


// ============================================================
// LOGIN / IDENTITY
// ============================================================

async function enterPRSN() {

    const typedName =
        nameInput.value
            .trim()
            .toUpperCase();


    nameError.textContent =
        "";


    // ========================================================
    // ADMIN ROUTE
    // ========================================================

    if (
        typedName ===
        "ADMIN"
    ) {

        nameInput.value =
            "";

        openAdminLogin();

        return;
    }


    // ========================================================
    // NORMAL MEMBER
    // ========================================================

    if (!typedName) {

        showError(
            nameError,
            "ENTER YOUR NAME."
        );

        return;
    }


    if (
        !ALLOWED_USERS.includes(
            typedName
        )
    ) {

        showError(
            nameError,
            "IDENTITY NOT RECOGNIZED."
        );

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


    showScreen(
        dashboard
    );


    if (bgMusic) {

        bgMusic.volume =
            .32;

        bgMusic.currentTime =
            0;

        bgMusic
            .play()
            .catch(
                () => {}
            );

    }


    await updateLastSeen();


    await logActivity(
        "LOGIN",
        "PRSN"
    );

}


// ============================================================
// LOGIN EVENTS
// ============================================================

enterBtn.addEventListener(
    "click",
    enterPRSN
);


nameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            enterPRSN();

        }

    }
);


// ============================================================
// ADMIN LOGIN ROUTING
// ============================================================

function openAdminLogin() {

    if (
        sessionStorage.getItem(
            "prsn_admin"
        ) ===
        "true"
    ) {

        openAdminPanel();

        return;
    }


    showScreen(
        adminLoginScreen
    );


    adminUsername.value =
        "";

    adminPassword.value =
        "";

    adminLoginError.textContent =
        "";


    setTimeout(
        () =>
            adminUsername.focus(),
        150
    );

}


// ============================================================
// ADMIN BACK
// ============================================================

adminBackBtn.addEventListener(
    "click",
    () => {

        showScreen(
            nameScreen
        );

        setTimeout(
            () =>
                nameInput.focus(),
            100
        );

    }
);


// ============================================================
// ADMIN LOGIN
// ============================================================

function loginAdmin() {

    const username =
        adminUsername.value
            .trim();


    const password =
        adminPassword.value;


    if (
        username !==
            ADMIN_USERNAME ||
        password !==
            ADMIN_PASSWORD
    ) {

        showError(
            adminLoginError,
            "ADMIN ACCESS DENIED."
        );

        return;
    }


    sessionStorage.setItem(
        "prsn_admin",
        "true"
    );


    openAdminPanel();

}


adminLoginBtn.addEventListener(
    "click",
    loginAdmin
);


adminPassword.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            loginAdmin();

        }

    }
);


adminUsername.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            adminPassword.focus();

        }

    }
);


// ============================================================
// ADMIN PANEL
// ============================================================

function openAdminPanel() {

    showScreen(
        adminPanel
    );

    loadAdminDashboard();

}


// ============================================================
// ADMIN LOGOUT
// ============================================================

adminLogoutBtn.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem(
            "prsn_admin"
        );


        showScreen(
            nameScreen
        );


        nameInput.value =
            "";


        setTimeout(
            () =>
                nameInput.focus(),
            120
        );

    }
);


// ============================================================
// ADMIN REFRESH
// ============================================================

adminRefreshBtn.addEventListener(
    "click",
    loadAdminDashboard
);


// ============================================================
// ADMIN TABS
// ============================================================

document
    .querySelectorAll(
        ".admin-tab"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const tab =
                        button.dataset
                            .adminTab;


                    document
                        .querySelectorAll(
                            ".admin-tab"
                        )
                        .forEach(
                            tabButton =>
                                tabButton
                                    .classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    document
                        .querySelectorAll(
                            ".admin-section"
                        )
                        .forEach(
                            section =>
                                section
                                    .classList
                                    .remove(
                                        "active"
                                    )
                        );


                    document
                        .querySelector(
                            `[data-admin-section="${tab}"]`
                        )
                        ?.classList
                        .add(
                            "active"
                        );

                }
            );

        }
    );


// ============================================================
// ADMIN DATA
// ============================================================

let cachedAdminActivity =
    [];


async function loadAdminDashboard() {

    adminRefreshBtn.disabled =
        true;


    try {

        await Promise.all([
            loadAdminMembers(),
            loadAdminActivity(),
            loadAdminDeletedMessages(),
            loadAdminMedia()
        ]);

    }

    finally {

        adminRefreshBtn.disabled =
            false;

    }

}


// ============================================================
// ADMIN MEMBERS
// ============================================================

async function loadAdminMembers() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "members"
            )

            .select(
                "*"
            )

            .order(
                "name"
            );


    if (error) {

        console.error(
            "Admin members error:",
            error
        );


        adminMembersList.innerHTML = `
            <div class="gallery-loading">
                MEMBERS UNAVAILABLE
            </div>
        `;

        return;
    }


    document.getElementById(
        "memberCount"
    ).textContent =
        data.length;


    let onlineCount =
        0;


    const now =
        Date.now();


    adminMembersList.innerHTML =
        data.map(
            member => {

                const lastSeen =
                    member.last_seen_at
                        ? new Date(
                            member.last_seen_at
                        ).getTime()
                        : 0;


                const online =
                    (
                        now -
                        lastSeen
                    ) <
                    120000;


                if (online) {
                    onlineCount++;
                }


                return `

                    <article class="admin-stat-card">

                        <span>
                            ${online
                                ? "ONLINE"
                                : "MEMBER"}
                        </span>

                        <strong
                            style="
                                font-size:20px;
                                letter-spacing:-1px;
                            "
                        >
                            ${escapeHTML(
                                member.name
                            )}
                        </strong>

                        <small>
                            ${
                                online
                                    ? "ACTIVE NOW"
                                    : `LAST SEEN ${escapeHTML(
                                        formatDate(
                                            member.last_seen_at
                                        )
                                    )}`
                            }
                        </small>

                    </article>

                `;

            }
        ).join("");


    document.getElementById(
        "onlineCount"
    ).textContent =
        onlineCount;

}


// ============================================================
// ACTIVITY LOGGING
// ============================================================

async function logActivity(
    action,
    section
) {

    if (!currentUser) {
        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from(
                "activity_logs"
            )

            .insert({

                user_name:
                    currentUser,

                action:
                    action,

                section:
                    section,

                created_at:
                    new Date()
                        .toISOString()

            });


    if (error) {

        // Site normal chalegi even if
        // activity_logs table abhi create nahi hui.

        console.warn(
            "Activity log unavailable:",
            error.message
        );

    }

}


// ============================================================
// LOAD ADMIN ACTIVITY
// ============================================================

async function loadAdminActivity() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "activity_logs"
            )

            .select(
                "*"
            )

            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            )

            .limit(
                500
            );


    if (error) {

        console.warn(
            "Activity table unavailable:",
            error.message
        );


        cachedAdminActivity =
            [];


        document.getElementById(
            "activityCount"
        ).textContent =
            "—";


        adminActivityList.innerHTML = `

            <div class="admin-warning-box">

                <span>
                    ◈
                </span>

                <p>
                    activity_logs table abhi Supabase me create nahi hui.
                </p>

            </div>

        `;


        return;
    }


    cachedAdminActivity =
        data;


    document.getElementById(
        "activityCount"
    ).textContent =
        data.length;


    renderAdminActivity();

}


// ============================================================
// ACTIVITY FILTER
// ============================================================

function renderAdminActivity() {

    const userFilter =
        activityUserFilter.value;


    const typeFilter =
        activityTypeFilter.value;


    const filtered =
        cachedAdminActivity.filter(
            item => {

                const userOK =
                    userFilter ===
                        "ALL" ||
                    item.user_name ===
                        userFilter;


                const typeOK =
                    typeFilter ===
                        "ALL" ||
                    item.action ===
                        typeFilter;


                return (
                    userOK &&
                    typeOK
                );

            }
        );


    if (
        filtered.length ===
        0
    ) {

        adminActivityList.innerHTML = `

            <div class="gallery-loading">
                NO ACTIVITY FOUND
            </div>

        `;

        return;
    }


    adminActivityList.innerHTML =
        filtered.map(
            item => `

                <div
                    class="friend-ticket"
                    style="
                        grid-template-columns:
                        auto 1fr auto;
                    "
                >

                    <span>
                        ●
                    </span>

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.user_name
                            )}
                            —
                            ${escapeHTML(
                                item.action
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.section ||
                                "PRSN"
                            )}
                        </small>

                    </div>

                    <i
                        style="
                            font-size:10px;
                            white-space:nowrap;
                        "
                    >
                        ${escapeHTML(
                            formatDate(
                                item.created_at
                            )
                        )}
                    </i>

                </div>

            `
        ).join("");

}


activityUserFilter.addEventListener(
    "change",
    renderAdminActivity
);


activityTypeFilter.addEventListener(
    "change",
    renderAdminActivity
);


// ============================================================
// DELETED MESSAGE ARCHIVE
// ============================================================

async function archiveDeletedMessage(
    message
) {

    const {
        error
    } =
        await supabaseClient

            .from(
                "deleted_messages"
            )

            .insert({

                original_message_id:
                    message.id,

                sender_name:
                    message.sender_name,

                message:
                    message.message,

                message_type:
                    message.message_type,

                file_path:
                    message.file_path,

                original_created_at:
                    message.created_at,

                deleted_at:
                    new Date()
                        .toISOString(),

                deleted_by:
                    currentUser

            });


    if (error) {

        console.warn(
            "Archive error:",
            error.message
        );


        return false;
    }


    return true;

}


// ============================================================
// ADMIN DELETED MESSAGES
// ============================================================

async function loadAdminDeletedMessages() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "deleted_messages"
            )

            .select(
                "*"
            )

            .order(
                "deleted_at",
                {
                    ascending:
                        false
                }
            )

            .limit(
                300
            );


    if (error) {

        console.warn(
            "Deleted archive unavailable:",
            error.message
        );


        document.getElementById(
            "deletedCount"
        ).textContent =
            "—";


        adminDeletedList.innerHTML = `

            <div class="admin-warning-box">

                <span>
                    ◈
                </span>

                <p>
                    deleted_messages table abhi Supabase me create nahi hui.
                </p>

            </div>

        `;


        return;
    }


    document.getElementById(
        "deletedCount"
    ).textContent =
        data.length;


    if (!data.length) {

        adminDeletedList.innerHTML = `

            <div class="gallery-loading">
                NO DELETED MESSAGES
            </div>

        `;

        return;
    }


    const cards =
        await Promise.all(

            data.map(
                async item => {

                    let mediaHTML =
                        "";


                    if (
                        item.message_type ===
                            "image" &&
                        item.file_path
                    ) {

                        const {
                            data:
                                signed
                        } =
                            await supabaseClient

                                .storage

                                .from(
                                    "chat-images"
                                )

                                .createSignedUrl(
                                    item.file_path,
                                    3600
                                );


                        if (
                            signed?.signedUrl
                        ) {

                            mediaHTML = `

                                <img
                                    src="${signed.signedUrl}"
                                    style="
                                        width:180px;
                                        max-height:180px;
                                        object-fit:cover;
                                        border-radius:10px;
                                        margin-top:10px;
                                    "
                                    alt="Archived photo"
                                >

                            `;

                        }

                    }


                    if (
                        item.message_type ===
                            "voice" &&
                        item.file_path
                    ) {

                        const {
                            data:
                                signed
                        } =
                            await supabaseClient

                                .storage

                                .from(
                                    "chat-voice"
                                )

                                .createSignedUrl(
                                    item.file_path,
                                    3600
                                );


                        if (
                            signed?.signedUrl
                        ) {

                            mediaHTML = `

                                <audio
                                    controls
                                    src="${signed.signedUrl}"
                                    style="
                                        margin-top:10px;
                                        width:240px;
                                        max-width:100%;
                                    "
                                ></audio>

                            `;

                        }

                    }


                    return `

                        <article
                            class="friend-ticket"
                            style="
                                display:block;
                            "
                        >

                            <strong>
                                ${escapeHTML(
                                    item.sender_name
                                )}
                            </strong>

                            <small>
                                DELETED
                                ${escapeHTML(
                                    formatDate(
                                        item.deleted_at
                                    )
                                )}
                            </small>

                            <div
                                style="
                                    margin-top:10px;
                                    color:rgba(255,255,255,.72);
                                    font-size:12px;
                                    line-height:1.6;
                                "
                            >

                                ${
                                    item.message_type ===
                                        "text"
                                        ? escapeHTML(
                                            item.message ||
                                            ""
                                        )
                                        : escapeHTML(
                                            item.message_type
                                                ?.toUpperCase() ||
                                            "MESSAGE"
                                        )
                                }

                            </div>

                            ${mediaHTML}

                        </article>

                    `;

                }
            )

        );


    adminDeletedList.innerHTML =
        cards.join("");

}


// ============================================================
// ADMIN MEDIA
// ============================================================

async function loadAdminMedia() {

    const [
        galleryResult,
        messageResult
    ] =
        await Promise.all([

            supabaseClient
                .from(
                    "gallery_photos"
                )
                .select(
                    "*"
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                )
                .limit(
                    40
                ),

            supabaseClient
                .from(
                    "messages"
                )
                .select(
                    "*"
                )
                .in(
                    "message_type",
                    [
                        "image",
                        "voice"
                    ]
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                )
                .limit(
                    40
                )

        ]);


    const galleryData =
        galleryResult.data ||
        [];


    const mediaMessages =
        messageResult.data ||
        [];


    const cards =
        [];


    for (
        const photo
        of galleryData
    ) {

        const {
            data:
                signed
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
            signed?.signedUrl
        ) {

            cards.push(`

                <article class="gallery-photo-card">

                    <div class="gallery-image-wrap">

                        <img
                            src="${signed.signedUrl}"
                            class="gallery-image"
                            alt="Gallery media"
                        >

                    </div>

                    <div class="gallery-info">

                        <span class="gallery-uploader">

                            ${escapeHTML(
                                photo.uploader_name
                            )}

                        </span>

                        <span class="gallery-date">

                            WALL

                        </span>

                    </div>

                </article>

            `);

        }

    }


    for (
        const item
        of mediaMessages
    ) {

        if (
            item.message_type ===
                "image" &&
            item.file_path
        ) {

            const {
                data:
                    signed
            } =
                await supabaseClient

                    .storage

                    .from(
                        "chat-images"
                    )

                    .createSignedUrl(
                        item.file_path,
                        3600
                    );


            if (
                signed?.signedUrl
            ) {

                cards.push(`

                    <article class="gallery-photo-card">

                        <div class="gallery-image-wrap">

                            <img
                                src="${signed.signedUrl}"
                                class="gallery-image"
                                alt="Chat photo"
                            >

                        </div>

                        <div class="gallery-info">

                            <span class="gallery-uploader">

                                ${escapeHTML(
                                    item.sender_name
                                )}

                            </span>

                            <span class="gallery-date">

                                CHAT

                            </span>

                        </div>

                    </article>

                `);

            }

        }


        else if (
            item.message_type ===
                "voice" &&
            item.file_path
        ) {

            const {
                data:
                    signed
            } =
                await supabaseClient

                    .storage

                    .from(
                        "chat-voice"
                    )

                    .createSignedUrl(
                        item.file_path,
                        3600
                    );


            if (
                signed?.signedUrl
            ) {

                cards.push(`

                    <article
                        class="gallery-photo-card"
                        style="
                            min-height:160px;
                            padding:18px;
                        "
                    >

                        <strong
                            style="
                                font-size:10px;
                                letter-spacing:1px;
                            "
                        >
                            ${escapeHTML(
                                item.sender_name
                            )}
                        </strong>

                        <small
                            style="
                                display:block;
                                margin-top:5px;
                                color:rgba(255,255,255,.3);
                            "
                        >
                            VOICE MESSAGE
                        </small>

                        <audio
                            controls
                            src="${signed.signedUrl}"
                            style="
                                width:100%;
                                margin-top:20px;
                            "
                        ></audio>

                    </article>

                `);

            }

        }

    }


    adminMediaList.innerHTML =
        cards.length
            ? cards.join("")
            : `
                <div class="gallery-loading">
                    NO MEDIA
                </div>
            `;

}


// ============================================================
// MUSIC
// ============================================================

musicBtn.addEventListener(
    "click",
    () => {

        if (!bgMusic) {
            return;
        }


        if (
            bgMusic.paused
        ) {

            bgMusic
                .play()
                .catch(
                    () => {}
                );


            musicBtn.textContent =
                "♫";

        }

        else {

            bgMusic.pause();

            musicBtn.textContent =
                "♪";

        }

    }
);


// ============================================================
// OPEN CHAT
// ============================================================

chatBtn.addEventListener(
    "click",
    async () => {

        chatModal.classList.remove(
            "hidden"
        );


        chatCodeInput.value =
            "";

        chatError.textContent =
            "";


        await logActivity(
            "OPENED_CHAT",
            "COMMUNITY_CHAT"
        );


        setTimeout(
            () =>
                chatCodeInput.focus(),
            120
        );

    }
);


// ============================================================
// CLOSE CHAT MODAL
// ============================================================

function closeChatModal() {

    chatModal.classList.add(
        "hidden"
    );

    chatCodeInput.value =
        "";

    chatError.textContent =
        "";
}


closeChat.addEventListener(
    "click",
    closeChatModal
);


chatModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            chatModal
        ) {

            closeChatModal();

        }

    }
);


// ============================================================
// UNLOCK CHAT
// ============================================================

async function unlockPrivateChat() {

    const code =
        chatCodeInput.value
            .trim()
            .toUpperCase();


    if (
        code !==
        CHAT_CODE
    ) {

        showError(
            chatError,
            "ACCESS CODE REJECTED."
        );

        return;
    }


    closeChatModal();


    chatName =
        currentUser;


    if (bgMusic) {

        bgMusic.pause();

        bgMusic.currentTime =
            0;

    }


    if (chatMusic) {

        chatMusic.volume =
            .25;

        chatMusic.currentTime =
            0;


        chatMusic
            .play()
            .catch(
                () => {}
            );

    }


    chatScreen.classList.remove(
        "hidden"
    );


    await loadMessages();


    startRealtimeChat();


    setTimeout(
        () =>
            messageInput.focus(),
        100
    );

}


unlockChat.addEventListener(
    "click",
    unlockPrivateChat
);


chatCodeInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            unlockPrivateChat();

        }

    }
);


// ============================================================
// BACK FROM CHAT
// ============================================================

backFromChat.addEventListener(
    "click",
    async () => {

        if (
            voiceRecording
        ) {

            cancelVoiceRecording();

        }


        chatScreen.classList.add(
            "hidden"
        );


        if (chatMusic) {

            chatMusic.pause();

            chatMusic.currentTime =
                0;

        }


        chatMusicWasPlaying =
            false;


        if (bgMusic) {

            bgMusic.currentTime =
                0;


            bgMusic
                .play()
                .catch(
                    () => {}
                );

        }

    }
);


// ============================================================
// LOAD CHAT
// ============================================================

async function loadMessages() {

    messagesBox.innerHTML = `

        <div class="gallery-loading">

            LOADING CONVERSATION...

        </div>

    `;


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "messages"
            )

            .select(
                "*"
            )

            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            )

            .limit(
                INITIAL_MESSAGES_LIMIT
            );


    if (error) {

        console.error(
            error
        );


        messagesBox.innerHTML = `

            <div class="gallery-loading">

                MESSAGES UNAVAILABLE

            </div>

        `;

        return;
    }


    const ordered =
        [...data]
            .reverse();


    const elements =
        await Promise.all(

            ordered.map(
                item =>
                    createMessageElement(
                        item
                    )
            )

        );


    messagesBox.innerHTML =
        "";


    const fragment =
        document.createDocumentFragment();


    elements.forEach(
        element => {

            if (element) {

                fragment.appendChild(
                    element
                );

            }

        }
    );


    messagesBox.appendChild(
        fragment
    );


    requestAnimationFrame(
        scrollMessagesToBottom
    );

}


// ============================================================
// CREATE MESSAGE
// ============================================================

async function createMessageElement(
    message
) {

    const element =
        document.createElement(
            "div"
        );


    const mine =
        message.sender_name ===
        chatName;


    element.className =
        mine
            ? "message mine"
            : "message";


    element.dataset.messageId =
        message.id;


    let content =
        "";


    if (
        message.message_type ===
            "image" &&
        message.file_path
    ) {

        const {
            data:
                signed
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


        content =
            signed?.signedUrl
                ? `

                    <img
                        src="${signed.signedUrl}"
                        class="message-image"
                        alt="Shared photo"
                    >

                `
                : `

                    <div class="message-text">
                        PHOTO UNAVAILABLE
                    </div>

                `;

    }


    else if (
        message.message_type ===
            "voice" &&
        message.file_path
    ) {

        const {
            data:
                signed
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


        content =
            signed?.signedUrl
                ? `

                    <div class="voice-message">

                        <div class="voice-message-icon">
                            ◉
                        </div>

                        <audio
                            class="voice-audio"
                            controls
                            src="${signed.signedUrl}"
                        ></audio>

                    </div>

                `
                : `

                    <div class="message-text">
                        VOICE UNAVAILABLE
                    </div>

                `;

    }


    else {

        content = `

            <div class="message-text">

                ${escapeHTML(
                    message.message ||
                    ""
                )}

            </div>

        `;

    }


    const deleteHTML =
        mine
            ? `

                <button
                    class="message-delete-btn"
                    type="button"
                >
                    •••
                </button>

                <div
                    class="message-delete-menu hidden"
                >

                    <button
                        class="delete-action"
                        type="button"
                    >
                        DELETE MESSAGE
                    </button>

                </div>

            `
            : "";


    element.innerHTML = `

        <div class="message-top-row">

            <div class="message-name">

                ${escapeHTML(
                    message.sender_name
                )}

            </div>

            ${deleteHTML}

        </div>

        ${content}

        <div class="message-time">

            ${formatTime(
                message.created_at
            )}

        </div>

    `;


    // ========================================================
    // IMAGE CLICK
    // ========================================================

    const image =
        element.querySelector(
            ".message-image"
        );


    if (image) {

        image.addEventListener(
            "click",
            () =>
                window.open(
                    image.src,
                    "_blank"
                )
        );

    }


    // ========================================================
    // DELETE MENU
    // ========================================================

    const deleteBtn =
        element.querySelector(
            ".message-delete-btn"
        );


    const deleteMenu =
        element.querySelector(
            ".message-delete-menu"
        );


    const deleteAction =
        element.querySelector(
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


                document
                    .querySelectorAll(
                        ".message-delete-menu"
                    )
                    .forEach(
                        menu =>
                            menu
                                .classList
                                .add(
                                    "hidden"
                                )
                    );


                deleteMenu
                    .classList
                    .remove(
                        "hidden"
                    );

            }
        );


        deleteAction.addEventListener(
            "click",
            async event => {

                event.stopPropagation();


                deleteMenu.classList.add(
                    "hidden"
                );


                if (
                    !confirm(
                        "Delete this message?"
                    )
                ) {

                    return;

                }


                await deleteMessage(
                    message
                );

            }
        );

    }


    // ========================================================
    // VOICE PLAYER
    // ========================================================

    const audio =
        element.querySelector(
            ".voice-audio"
        );


    if (audio) {

        audio.addEventListener(
            "play",
            pauseChatMusicForVoice
        );


        audio.addEventListener(
            "pause",
            () => {

                if (
                    Number.isFinite(
                        audio.duration
                    ) &&
                    audio.currentTime <
                    audio.duration
                ) {

                    resumeChatMusicAfterVoice();

                }

            }
        );


        audio.addEventListener(
            "ended",
            resumeChatMusicAfterVoice
        );

    }


    return element;

}


// ============================================================
// DISPLAY REALTIME MESSAGE
// ============================================================

async function displayMessage(
    message
) {

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


    messagesBox.appendChild(
        element
    );


    scrollMessagesToBottom();

}


// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage() {

    const text =
        messageInput.value
            .trim();


    if (
        !text ||
        !chatName
    ) {

        return;
    }


    sendMessageBtn.disabled =
        true;


    const {
        error
    } =
        await supabaseClient

            .from(
                "messages"
            )

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

        alert(
            "Message send nahi hua."
        );

        console.error(
            error
        );

        return;
    }


    messageInput.value =
        "";


    await logActivity(
        "SENT_MESSAGE",
        "COMMUNITY_CHAT"
    );

}


sendMessageBtn.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
                "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ============================================================
// DELETE MESSAGE
// ============================================================

async function deleteMessage(
    message
) {

    if (
        message.sender_name !==
        chatName
    ) {

        return;
    }


    // Archive first.
    //
    // Photo/voice storage intentionally
    // retain ki ja rahi hai so admin archive
    // media ko baad me dekh sake.

    const archived =
        await archiveDeletedMessage(
            message
        );


    if (!archived) {

        alert(
            "Archive setup missing hai. Message delete nahi kiya gaya."
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from(
                "messages"
            )

            .delete()

            .eq(
                "id",
                message.id
            );


    if (error) {

        console.error(
            error
        );

        alert(
            "Message delete nahi hua."
        );

        return;
    }


    document
        .querySelector(
            `[data-message-id="${message.id}"]`
        )
        ?.remove();


    await logActivity(
        "DELETED_MESSAGE",
        "COMMUNITY_CHAT"
    );

}


// ============================================================
// PHOTO
// ============================================================

photoInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (
            !file.type
                .startsWith(
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

        }

        catch (error) {

            console.error(
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


async function sendPhoto(
    file
) {

    const extension =
        (
            file.name
                .split(".")
                .pop() ||
            "jpg"
        )
            .toLowerCase();


    const filePath =
        "chat/" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const {
        error:
            uploadError
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
                    contentType:
                        file.type,

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (uploadError) {
        throw uploadError;
    }


    const {
        error:
            insertError
    } =
        await supabaseClient

            .from(
                "messages"
            )

            .insert({

                sender_name:
                    chatName,

                message:
                    "Photo",

                message_type:
                    "image",

                file_path:
                    filePath

            });


    if (insertError) {

        await supabaseClient

            .storage

            .from(
                "chat-images"
            )

            .remove([
                filePath
            ]);


        throw insertError;
    }


    await logActivity(
        "SENT_PHOTO",
        "COMMUNITY_CHAT"
    );

}


// ============================================================
// VOICE MUSIC HELPERS
// ============================================================

function pauseChatMusicForVoice() {

    if (!chatMusic) {
        return;
    }


    chatMusicWasPlaying =
        !chatMusic.paused;


    if (
        chatMusicWasPlaying
    ) {

        chatMusic.pause();

    }

}


function resumeChatMusicAfterVoice() {

    if (
        chatMusicWasPlaying &&
        chatMusic
    ) {

        chatMusic
            .play()
            .catch(
                () => {}
            );

    }


    chatMusicWasPlaying =
        false;

}


// ============================================================
// VOICE EVENTS
// ============================================================

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

        if (
            voiceRecording
        ) {

            stopVoiceRecording();

        }

    }
);


voiceRecordBtn.addEventListener(
    "pointercancel",
    cancelVoiceRecording
);


voiceRecordBtn.addEventListener(
    "contextmenu",
    event =>
        event.preventDefault()
);


// ============================================================
// START VOICE
// ============================================================

async function startVoiceRecording(
    event
) {

    event.preventDefault();


    if (
        voiceRecording ||
        !chatName
    ) {

        return;
    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
            .getUserMedia ||
        typeof MediaRecorder ===
            "undefined"
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
                    audio:
                        true
                });


        let mimeType =
            "audio/webm";


        if (
            MediaRecorder
                .isTypeSupported(
                    "audio/webm;codecs=opus"
                )
        ) {

            mimeType =
                "audio/webm;codecs=opus";

        }

        else if (
            MediaRecorder
                .isTypeSupported(
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


        voiceChunks =
            [];

        voiceCancelled =
            false;

        voiceRecording =
            true;

        voiceStartTime =
            Date.now();


        mediaRecorder.addEventListener(
            "dataavailable",
            event => {

                if (
                    event.data &&
                    event.data.size
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


                const cancelled =
                    voiceCancelled;


                cleanupVoiceUI();

                stopVoiceStream();

                resumeChatMusicAfterVoice();


                if (
                    cancelled ||
                    blob.size ===
                        0
                ) {

                    return;

                }


                try {

                    await uploadVoice(
                        blob,
                        finalType
                    );

                }

                catch (error) {

                    console.error(
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


        updateVoiceTimer();


        voiceTimerInterval =
            setInterval(
                updateVoiceTimer,
                250
            );

    }

    catch (error) {

        console.error(
            error
        );


        cleanupVoiceUI();

        stopVoiceStream();

        resumeChatMusicAfterVoice();


        alert(
            "Microphone permission allow karni padegi."
        );

    }

}


// ============================================================
// STOP VOICE
// ============================================================

function stopVoiceRecording() {

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

}


// ============================================================
// CANCEL VOICE
// ============================================================

function cancelVoiceRecording() {

    if (
        !voiceRecording
    ) {

        return;
    }


    voiceCancelled =
        true;

    voiceRecording =
        false;


    if (
        mediaRecorder &&
        mediaRecorder.state !==
            "inactive"
    ) {

        mediaRecorder.stop();

    }

    else {

        cleanupVoiceUI();

        stopVoiceStream();

        resumeChatMusicAfterVoice();

    }

}


// ============================================================
// UPLOAD VOICE
// ============================================================

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

    }


    const filePath =
        "voice/" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const {
        error:
            uploadError
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
                    contentType:
                        mimeType,

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (uploadError) {
        throw uploadError;
    }


    const {
        error:
            insertError
    } =
        await supabaseClient

            .from(
                "messages"
            )

            .insert({

                sender_name:
                    chatName,

                message:
                    "Voice message",

                message_type:
                    "voice",

                file_path:
                    filePath

            });


    if (insertError) {

        await supabaseClient

            .storage

            .from(
                "chat-voice"
            )

            .remove([
                filePath
            ]);


        throw insertError;
    }


    await logActivity(
        "SENT_VOICE",
        "COMMUNITY_CHAT"
    );

}


// ============================================================
// VOICE TIMER
// ============================================================

function updateVoiceTimer() {

    if (!voiceStartTime) {
        return;
    }


    const elapsed =
        Math.floor(
            (
                Date.now() -
                voiceStartTime
            ) /
            1000
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


// ============================================================
// CLEAN VOICE
// ============================================================

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


function stopVoiceStream() {

    voiceStream
        ?.getTracks()
        .forEach(
            track =>
                track.stop()
        );


    voiceStream =
        null;

}


// ============================================================
// REALTIME CHAT
// ============================================================

function startRealtimeChat() {

    if (
        chatChannel
    ) {

        return;
    }


    chatChannel =
        supabaseClient

            .channel(
                "prsn-community"
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

                    await displayMessage(
                        payload.new
                    );

                }

            )


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

                    document
                        .querySelector(
                            `[data-message-id="${payload.old.id}"]`
                        )
                        ?.remove();

                }

            )


            .subscribe();

}


// ============================================================
// LAST SEEN
// ============================================================

async function updateLastSeen() {

    if (!currentUser) {
        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from(
                "members"
            )

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

        console.warn(
            "Last seen:",
            error.message
        );

    }

}


setInterval(
    () => {

        if (
            currentUser
        ) {

            updateLastSeen();

        }

    },
    60000
);


// ============================================================
// AMAZING WALL
// ============================================================

galleryBtn.addEventListener(
    "click",
    async () => {

        galleryScreen.classList.remove(
            "hidden"
        );


        await logActivity(
            "OPENED_GALLERY",
            "AMAZING_WALL"
        );


        await loadGallery();


        startRealtimeGallery();

    }
);


backFromGallery.addEventListener(
    "click",
    () => {

        galleryScreen.classList.add(
            "hidden"
        );

    }
);


// ============================================================
// LOAD GALLERY
// ============================================================

async function loadGallery() {

    galleryGrid.innerHTML = `

        <div class="gallery-loading">

            LOADING MEMORIES...

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

            .select(
                "*"
            )

            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        galleryGrid.innerHTML = `

            <div class="gallery-loading">

                ARCHIVE UNAVAILABLE

            </div>

        `;

        return;
    }


    galleryGrid.innerHTML =
        "";


    for (
        const photo
        of data
    ) {

        await displayGalleryPhoto(
            photo
        );

    }

}


// ============================================================
// DISPLAY GALLERY PHOTO
// ============================================================

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
        data:
            signed
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
        !signed?.signedUrl
    ) {

        return;
    }


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "gallery-photo-card";


    card.dataset.galleryId =
        photo.id;


    card.innerHTML = `

        <div class="gallery-image-wrap">

            <img
                src="${signed.signedUrl}"
                class="gallery-image"
                alt="PRSN memory"
            >

        </div>

        <div class="gallery-info">

            <div class="gallery-uploader">

                ${escapeHTML(
                    photo.uploader_name
                )}

            </div>

            <div class="gallery-date">

                ${escapeHTML(
                    formatDate(
                        photo.created_at
                    )
                )}

            </div>

        </div>

    `;


    card
        .querySelector(
            ".gallery-image"
        )
        ?.addEventListener(
            "click",
            () =>
                window.open(
                    signed.signedUrl,
                    "_blank"
                )
        );


    galleryGrid.appendChild(
        card
    );

}


// ============================================================
// UPLOAD WALL PHOTO
// ============================================================

galleryInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (
            !file.type
                .startsWith(
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

        }

        catch (error) {

            console.error(
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


async function uploadGalleryPhoto(
    file
) {

    const extension =
        (
            file.name
                .split(".")
                .pop() ||
            "jpg"
        )
            .toLowerCase();


    const filePath =
        "wall/" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2) +
        "." +
        extension;


    const {
        error:
            uploadError
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
                    contentType:
                        file.type,

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (uploadError) {
        throw uploadError;
    }


    const {
        error:
            insertError
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


    if (insertError) {

        await supabaseClient

            .storage

            .from(
                "prsn-gallery"
            )

            .remove([
                filePath
            ]);


        throw insertError;
    }


    await logActivity(
        "SENT_PHOTO",
        "AMAZING_WALL"
    );

}


// ============================================================
// REALTIME WALL
// ============================================================

function startRealtimeGallery() {

    if (
        galleryChannel
    ) {

        return;
    }


    galleryChannel =
        supabaseClient

            .channel(
                "prsn-wall"
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
                        !galleryScreen
                            .classList
                            .contains(
                                "hidden"
                            )
                    ) {

                        await displayGalleryPhoto(
                            payload.new
                        );

                    }

                }

            )

            .subscribe();

}


// ============================================================
// GLOBAL DELETE MENU CLOSE
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".message-delete-btn"
            ) &&
            !event.target.closest(
                ".message-delete-menu"
            )
        ) {

            document
                .querySelectorAll(
                    ".message-delete-menu"
                )
                .forEach(
                    menu =>
                        menu
                            .classList
                            .add(
                                "hidden"
                            )
                );

        }

    }
);


// ============================================================
// ESCAPE
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


        if (
            !chatModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            closeChatModal();

        }

    }
);


// ============================================================
// CURSOR GLOW
// ============================================================

function initCursorGlow() {

    if (
        !cursorGlow ||
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        return;
    }


    let targetX =
        innerWidth / 2;

    let targetY =
        innerHeight / 2;

    let currentX =
        targetX;

    let currentY =
        targetY;


    window.addEventListener(
        "pointermove",
        event => {

            targetX =
                event.clientX;

            targetY =
                event.clientY;

        },
        {
            passive:
                true
        }
    );


    function animate() {

        currentX +=
            (
                targetX -
                currentX
            ) *
            .11;


        currentY +=
            (
                targetY -
                currentY
            ) *
            .11;


        cursorGlow.style.left =
            `${currentX}px`;


        cursorGlow.style.top =
            `${currentY}px`;


        requestAnimationFrame(
            animate
        );

    }


    animate();

}


// ============================================================
// 3D TILT UI
// ============================================================

function initTilt() {

    const reduced =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    document
        .querySelectorAll(
            "[data-tilt]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "pointermove",
                    event => {

                        const rect =
                            element
                                .getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height;


                        element.style.setProperty(
                            "--mx",
                            `${x * 100}%`
                        );


                        element.style.setProperty(
                            "--my",
                            `${y * 100}%`
                        );


                        if (
                            reduced ||
                            event.pointerType !==
                                "mouse"
                        ) {

                            return;
                        }


                        const rotateY =
                            (
                                x -
                                .5
                            ) *
                            5;


                        const rotateX =
                            -(
                                y -
                                .5
                            ) *
                            5;


                        element.style.transform = `

                            translateY(-5px)

                            rotateX(
                                ${rotateX}deg
                            )

                            rotateY(
                                ${rotateY}deg
                            )

                        `;

                    }
                );


                element.addEventListener(
                    "pointerleave",
                    () => {

                        element.style
                            .removeProperty(
                                "transform"
                            );

                    }
                );

            }
        );

}


// ============================================================
// SCROLL REVEALS
// ============================================================

let revealObserver;


function initScrollReveal() {

    revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add(
                                    "is-visible"
                                );

                        }

                        else if (
                            entry.boundingClientRect
                                .top >
                            0
                        ) {

                            entry.target
                                .classList
                                .remove(
                                    "is-visible"
                                );

                        }

                    }
                );

            },

            {
                threshold:
                    .14,

                rootMargin:
                    "0px 0px -6% 0px"
            }

        );


    document
        .querySelectorAll(
            ".reveal-section"
        )
        .forEach(
            element =>
                revealObserver
                    .observe(
                        element
                    )
        );

}


function refreshRevealAnimations() {

    document
        .querySelectorAll(
            ".screen.active .reveal-section"
        )
        .forEach(
            element => {

                const rect =
                    element
                        .getBoundingClientRect();


                if (
                    rect.top <
                    innerHeight *
                    .90
                ) {

                    element.classList.add(
                        "is-visible"
                    );

                }

            }
        );

}


// ============================================================
// CONNECTION TEST
// ============================================================

async function testSupabase() {

    const {
        error
    } =
        await supabaseClient

            .from(
                "members"
            )

            .select(
                "name"
            )

            .limit(
                1
            );


    if (error) {

        console.error(
            "PRSN Supabase:",
            error
        );

    }

    else {

        console.log(
            "✦ PRSN CONNECTED"
        );

    }

}


// ============================================================
// INITIALIZE
// ============================================================

function initialize() {

    initThreeScene();

    initCursorGlow();

    initTilt();

    initScrollReveal();

    testSupabase();

}


initialize();
