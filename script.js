// ═══════════════════════════════════════════════════════
//  ParetoSlider — Interactive Slider Logic
// ═══════════════════════════════════════════════════════

// ─── Snap slider value to nearest key in mapping ────────────────────────────
function closestKey(mapping, value) {
    const keys = Object.keys(mapping).map(Number).sort((a, b) => a - b);
    let best = keys[0];
    for (const k of keys) {
        if (Math.abs(k - value) < Math.abs(best - value)) best = k;
    }
    return best;
}

// ─── Wire up one slider → image ─────────────────────────────────────────────
function setupSlider(sliderId, imageId, mapping) {
    const slider = document.getElementById(sliderId);
    const image  = document.getElementById(imageId);
    if (!slider || !image) return;

    image.src = mapping[closestKey(mapping, parseInt(slider.value))];

    slider.addEventListener('input', function () {
        const src = mapping[closestKey(mapping, parseInt(this.value))];
        image.src = src;
        image.onerror = () => { image.src = Object.values(mapping)[0]; };
    });
}

// ─── Preload images ──────────────────────────────────────────────────────────
function preload(mapping) {
    Object.values(mapping).forEach(src => { const i = new Image(); i.src = src; });
}

// ════════════════════════════════════════════════════════════════════════════
//  IMAGE MAPPINGS
//  Keys = slider position (0–100), values = image path
// ════════════════════════════════════════════════════════════════════════════

const MAPPINGS = {

    // Header teaser: origami crane, photorealistic → sketch (5 frames)
    'teaser': {
        0:   'assets/teaser_crane/frame_0.png',   // 100% photorealistic
        25:  'assets/teaser_crane/frame_1.png',
        50:  'assets/teaser_crane/frame_2.png',
        75:  'assets/teaser_crane/frame_3.png',
        100: 'assets/teaser_crane/frame_4.png'    // 100% sketch
    },

    // T2I examples (9 frames: photo → style)
    'bunny': {
        0: 'assets/t2i_flat_vector/frame_0.png',
        13: 'assets/t2i_flat_vector/frame_1.png',
        25: 'assets/t2i_flat_vector/frame_2.png',
        38: 'assets/t2i_flat_vector/frame_3.png',
        50: 'assets/t2i_flat_vector/frame_4.png',
        63: 'assets/t2i_flat_vector/frame_5.png',
        75: 'assets/t2i_flat_vector/frame_6.png',
        88: 'assets/t2i_flat_vector/frame_7.png',
        100: 'assets/t2i_flat_vector/frame_8.png'
    },
    'hummingbird': {
        0: 'assets/t2i_animation/frame_0.png',
        13: 'assets/t2i_animation/frame_1.png',
        25: 'assets/t2i_animation/frame_2.png',
        38: 'assets/t2i_animation/frame_3.png',
        50: 'assets/t2i_animation/frame_4.png',
        63: 'assets/t2i_animation/frame_5.png',
        75: 'assets/t2i_animation/frame_6.png',
        88: 'assets/t2i_animation/frame_7.png',
        100: 'assets/t2i_animation/frame_8.png'
    },
    'bee': {
        0: 'assets/t2i_watercolor/frame_0.png',
        13: 'assets/t2i_watercolor/frame_1.png',
        25: 'assets/t2i_watercolor/frame_2.png',
        38: 'assets/t2i_watercolor/frame_3.png',
        50: 'assets/t2i_watercolor/frame_4.png',
        63: 'assets/t2i_watercolor/frame_5.png',
        75: 'assets/t2i_watercolor/frame_6.png',
        88: 'assets/t2i_watercolor/frame_7.png',
        100: 'assets/t2i_watercolor/frame_8.png'
    },

    // Editing examples (frame_0 = input shown statically; slider starts at frame_1)
    'edit-oliver': {
        0:   'assets/edit_anime_55/frame_1.jpg',
        33:  'assets/edit_anime_55/frame_2.jpg',
        67:  'assets/edit_anime_55/frame_3.jpg',
        100: 'assets/edit_anime_55/frame_4.jpg'
    },
    'edit-pixar': {
        0:   'assets/edit_face_25/frame_1.jpeg',
        50:  'assets/edit_face_25/frame_2.jpeg',
        100: 'assets/edit_face_25/frame_3.jpeg'
    },
    'edit-warrior': {
        0:   'assets/edit_28/frame_1.png',
        50:  'assets/edit_28/frame_2.png',
        100: 'assets/edit_28/frame_3.png'
    },
    'edit-ghibli': {
        0:   'assets/edit_face_12/frame_1.jpeg',
        50:  'assets/edit_face_12/frame_2.jpeg',
        100: 'assets/edit_face_12/frame_3.jpeg'
    }
};

// ════════════════════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {

    // Header teaser
    setupSlider('teaser-slider',       'teaser-image',        MAPPINGS['teaser']);

    // T2I style sliders
    setupSlider('bunny-slider',        'bunny-image',         MAPPINGS['bunny']);
    setupSlider('hummingbird-slider',  'hummingbird-image',   MAPPINGS['hummingbird']);
    setupSlider('bee-slider',          'bee-image',           MAPPINGS['bee']);

    // Editing sliders
    setupSlider('edit-oliver-slider',  'edit-oliver-image',   MAPPINGS['edit-oliver']);
    setupSlider('edit-pixar-slider',   'edit-pixar-image',    MAPPINGS['edit-pixar']);
    setupSlider('edit-warrior-slider', 'edit-warrior-image',  MAPPINGS['edit-warrior']);
    setupSlider('edit-ghibli-slider',  'edit-ghibli-image',   MAPPINGS['edit-ghibli']);

    // Preload all images for instant slider response
    Object.values(MAPPINGS).forEach(preload);
});

// ─── Copy BibTeX ─────────────────────────────────────────────────────────────
function copyBibTeX() {
    const text = document.querySelector('.bibtex-code').textContent;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(showCopyFeedback).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); showCopyFeedback(); } catch (e) {}
    document.body.removeChild(ta);
}

function showCopyFeedback() {
    const btn = document.querySelector('.copy-bibtex-btn');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.background = '#27ae60';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
}
