/* ============================================================
   EDIT THIS FILE to change your photos, links and email text.
   No other file needs touching for normal updates.
   ============================================================ */
window.SITE = {
  email: "sairah.gonzalezz@gmail.com",
  emailSubject: "Content enquiry",
  emailBody: "Hi Sairah,\n\nI'd like a quote for photo/video content.\n\nProperty name & location:\nType (hotel / Airbnb / holiday rental):\nWhat I need (photos, video, both):\nPreferred dates:\n\nThanks!",

  // Small round portrait. Put a file in /images and write its path, e.g. "images/sairah.jpg".
  // Leave "" to show a neutral placeholder circle.
  portrait: "images/portrait.jpg",

  // Hero photos for the turning wheel (28 spots on desktop, 16 on phones). If there are fewer
  // photos than spots, a few repeat on the opposite side of the circle, never both on screen at once.
  // To add one: put a 320px square copy in images/wheel/ (full-size goes in images/originals/),
  // then add a line:  { src: "images/wheel/my-photo.jpg", alt: "Describe it" },
  // The first photo starts at the top centre. Phones show only the first 16,
  // so keep your strongest shots near the top of this list.
  // (photo-12.jpg is left out: it's an alternate edit of photo-11, the same night-sky shot.)
  photos: [
    { src: "images/wheel/photo-22.jpg", alt: "Hotel lounge with velvet armchairs and warm ceiling lights" },
    { src: "images/wheel/photo-23.jpg", alt: "Ring chandelier hanging beneath a glass skylight" },
    { src: "images/wheel/photo-21.jpg", alt: "Warm-lit lobby lounge with sculpture and floating staircase" },
    { src: "images/wheel/photo-24.jpg", alt: "Meadow path leading toward rocky mountain peaks" },
    { src: "images/wheel/photo-15.jpg", alt: "Seafood lunch on a terrace overlooking a mountain village" },
    { src: "images/wheel/photo-02.jpg", alt: "Cathedral nave leading to a sunlit marble altar" },
    { src: "images/wheel/photo-14.jpg", alt: "Green valley and village seen from a mountain peak" },
    { src: "images/wheel/photo-10.jpg", alt: "Lighthouse glowing under a moonlit sky" },
    { src: "images/wheel/photo-09.jpg", alt: "Alpine-style chalet on a sunny village street" },
    { src: "images/wheel/photo-08.jpg", alt: "Frescoed cathedral dome seen from below" },
    { src: "images/wheel/photo-18.jpg", alt: "Mountain valley under a bright cloudy sky" },
    { src: "images/wheel/photo-05.jpg", alt: "Marble lectern beneath stained-glass star windows" },
    { src: "images/wheel/photo-16.jpg", alt: "Tall umbrella pines beside an old brick wall" },
    { src: "images/wheel/photo-11.jpg", alt: "Starry night sky above pine trees" },
    { src: "images/wheel/photo-03.jpg", alt: "Baroque altar sculpture with golden rays" },
    { src: "images/wheel/photo-20.jpg", alt: "Turquoise mountain river in summer" },
    { src: "images/wheel/photo-06.jpg", alt: "Marble crypt with carved ceiling and inlaid floor" },
    { src: "images/wheel/photo-17.jpg", alt: "Snowy mountain peaks behind fir trees" },
    { src: "images/wheel/photo-04.jpg", alt: "Church chapel with wooden pews and chequered floor" },
    { src: "images/wheel/photo-13.jpg", alt: "Milky Way above silhouetted pines" },
    { src: "images/wheel/photo-19.jpg", alt: "Dog napping under a pine tree on a mountain trail" },
    { src: "images/wheel/photo-01.jpg", alt: "Gilded coffered ceiling with framed paintings" },
    { src: "images/wheel/photo-07.jpg", alt: "Carved marble relief of a saint and cherubs" },
  ],

  // Social links shown under the bio. Add more like: { label: "TikTok", url: "https://www.tiktok.com/@yourname" }
  socials: [
    { label: "IG", url: "https://www.instagram.com/sairahgonzalez" }
  ],

  // Aerra-style dark nav that the main nav morphs into while scrolling through Work.
  // Hidden for now; change to true to bring it back (it's all still built).
  workNav: false,

  /* ABOUT section: intro text (right side) and small labelled details (left side, under ABOUT).
     A detail with link: "email" becomes a link that opens an email to you. */
  aboutIntro: "Hi, I'm Sairah. I create photography and short-form video for hotels, Airbnb hosts and holiday rentals, made to post on your own website, booking listings, social media and ads. I'm a content creator, not an influencer, so everything I make is yours to use.",
  aboutDetails: [
    { label: "Based in", value: "Surrey, UK" },
    { label: "Languages", value: "English, Spanish, Urdu" },
    { label: "Email", value: "sairah.gonzalezz@gmail.com", link: "email" }
  ],

  /* SERVICES section: numbered automatically (01, 02...). Edit, add or remove lines freely.
     title = main text, detail = small grey line under it, type = label on the right */
  services: [
    { title: "Property Photography", detail: "Rooms, interiors, exteriors and amenities.", type: "Photography" },
    { title: "Short-Form Video", detail: "Property tours, cinematic reels and promotional videos.", type: "Video" },
    { title: "Booking & Website Content", detail: "Visuals that showcase your property and encourage bookings.", type: "Photo & Video" },
    { title: "Social Media & Ad Content", detail: "Visuals for your own social channels and advertising.", type: "Photo & Video" },
    { title: "Lifestyle & Hospitality Content", detail: "Guest experiences, food, drinks and memorable details.", type: "Photo & Video" }
  ],
  servicesNote: "Every project is quoted to fit your property.",
  servicesLink: "Email me for a custom quote",

  /* WORK section: a wall of tiles, one per photo/video, arranged group by group in this order,
     each group under its own numbered heading.
     Hovering a tile shows its group title. Clicking opens it full-screen.
       photo: { src: "images/originals/name.jpg", alt: "Describe it" }
              (also put a 600x800 copy with the same name in images/tiles/ for the wall)
       video: { video: "videos/name.mp4", poster: "videos/name-poster.jpg", alt: "Describe it" }
     Add a group by copying one { title ... } block; add a photo/video by adding a line to items. */
  work: [
    {
      title: "Hotels & Dining",
      items: [
        { src: "images/originals/photo-22.jpg", alt: "Hotel lounge with velvet armchairs and warm ceiling lights" },
        { src: "images/originals/photo-23.jpg", alt: "Ring chandelier hanging beneath a glass skylight" },
        { src: "images/originals/photo-21.jpg", alt: "Warm-lit lobby lounge with sculpture and floating staircase" },
        { src: "images/originals/photo-15.jpg", alt: "Seafood lunch on a terrace overlooking a mountain village" },
        { video: "videos/clip-02.mp4", poster: "videos/clip-02-poster.jpg", alt: "Fried fish with salad and lemon on a sunny terrace with palm trees" }
      ]
    },
    {
      title: "Places & Landscapes",
      items: [
        { video: "videos/clip-01.mp4", poster: "videos/clip-01-poster.jpg", alt: "Walking across a wooden footbridge over a turquoise mountain river" },
        { src: "images/originals/photo-18.jpg", alt: "Mountain valley under a bright cloudy sky" },
        { src: "images/originals/photo-14.jpg", alt: "Green valley and village seen from a mountain peak" },
        { src: "images/originals/photo-20.jpg", alt: "Turquoise mountain river in summer" },
        { src: "images/originals/photo-17.jpg", alt: "Snowy mountain peaks behind fir trees" },
        { src: "images/originals/photo-24.jpg", alt: "Meadow path leading toward rocky mountain peaks" },
        { src: "images/originals/photo-16.jpg", alt: "Tall umbrella pines beside an old brick wall" },
        { src: "images/originals/photo-09.jpg", alt: "Alpine-style chalet on a sunny village street" },
        { src: "images/originals/photo-19.jpg", alt: "Dog napping under a pine tree on a mountain trail" }
      ]
    },
    {
      title: "Architecture & Detail",
      items: [
        { src: "images/originals/photo-02.jpg", alt: "Cathedral nave leading to a sunlit marble altar" },
        { src: "images/originals/photo-03.jpg", alt: "Baroque altar sculpture with golden rays" },
        { src: "images/originals/photo-08.jpg", alt: "Frescoed cathedral dome seen from below" },
        { src: "images/originals/photo-01.jpg", alt: "Gilded coffered ceiling with framed paintings" },
        { src: "images/originals/photo-05.jpg", alt: "Marble lectern beneath stained-glass star windows" },
        { src: "images/originals/photo-06.jpg", alt: "Marble crypt with carved ceiling and inlaid floor" },
        { src: "images/originals/photo-04.jpg", alt: "Church chapel with wooden pews and chequered floor" },
        { src: "images/originals/photo-07.jpg", alt: "Carved marble relief of a saint and cherubs" }
      ]
    },
    {
      title: "Night Skies",
      items: [
        { src: "images/originals/photo-10.jpg", alt: "Lighthouse glowing under a moonlit sky" },
        { src: "images/originals/photo-13.jpg", alt: "Milky Way above silhouetted pines" },
        { src: "images/originals/photo-11.jpg", alt: "Starry night sky above pine trees" }
      ]
    }
  ]
};
