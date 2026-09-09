export type RoomSlug = 'courtyard-room' | 'terrace-room' | 'sea-studio' | 'aurel-suite';
export type Photo = { id: string; alt: string; caption: string; category: string };
export type RoomType = {
  slug: RoomSlug; name: string; short: string; description: string; feeling: string;
  capacity: number; area: number; baseRate: number; bed: string; view: string;
  bathroom: string; amenities: string[]; units: string[]; gallery: Photo[];
};
function photos(slug: RoomSlug, captions: string[]): Photo[] {
  return captions.map((caption, i) => ({ id: `${slug}-${i + 1}`, alt: caption, caption, category: 'Rooms' }));
}
export const ROOMS: RoomType[] = [
  { slug: 'courtyard-room', name: 'Courtyard Room', short: 'A quiet corner, open to the courtyard.',
    description: 'Morning light moves across the limewashed walls. Beyond the walnut-framed window, an olive tree casts its small, shifting shadows. A soft queen bed, a good reading chair, and just enough room to make yourself at home.',
    feeling: 'For mornings with the window open.', capacity: 2, area: 24, baseRate: 19000,
    bed: 'One queen bed', view: 'Planted courtyard', bathroom: 'Pale-stone bathroom with a walk-in rain shower, bronze fittings and handmade basin.',
    amenities: ['Linen bedding', 'Reading chair', 'Air conditioning', 'Wi-Fi', 'Tea and coffee', 'Refillable bath products', 'Cotton robes', 'In-room safe'],
    units: ['C01', 'C02', 'C03', 'C04'], gallery: photos('courtyard-room', ['Queen bed in the Courtyard Room, with linen bedding and a walnut headboard.', 'A reading corner and courtyard-facing window in the Courtyard Room.', 'Stone walk-in shower and bronze fixtures in the Courtyard Room bathroom.', 'The Courtyard Room window opens onto olive trees and the limestone courtyard.']) },
  { slug: 'terrace-room', name: 'Terrace Room', short: 'Your own place in the afternoon shade.',
    description: 'Inside, a king bed and cool stone underfoot. Outside, a planted terrace with two woven chairs and a little table for whatever the day brings. Open the doors, pour something cold, and let the garden become part of the room.',
    feeling: 'A room with a little more outside.', capacity: 2, area: 30, baseRate: 25000,
    bed: 'One king bed', view: 'Private planted terrace', bathroom: 'Limewashed bathroom with a generous walk-in shower, stone basin and aged bronze taps.',
    amenities: ['Private terrace', 'Linen bedding', 'Air conditioning', 'Wi-Fi', 'Tea and coffee', 'Refillable bath products', 'Cotton robes', 'In-room safe'],
    units: ['T01', 'T02', 'T03', 'T04'], gallery: photos('terrace-room', ['King bed and open doors to the Terrace Room’s planted terrace.', 'Walnut furniture and woven textures inside the Terrace Room.', 'The Terrace Room’s stone basin and walk-in shower.', 'Two woven chairs on the private planted terrace; no sea view.']) },
  { slug: 'sea-studio', name: 'Sea Studio', short: 'Space to linger. A window to the sea.',
    description: 'A generous, light-filled studio with the coastline framed by tall windows. Read on the linen daybed, sleep with the curtains half drawn, and wake to the changing color of the water. The daybed becomes a single bed for a third guest.',
    feeling: 'The horizon, from your pillow.', capacity: 3, area: 38, baseRate: 34000,
    bed: 'King bed + single daybed', view: 'Sea-facing windows', bathroom: 'Light-filled stone bathroom with a walk-in rain shower, wide vanity and bronze fittings.',
    amenities: ['Sea-facing windows', 'Daybed / single extra bed', 'Linen bedding', 'Air conditioning', 'Wi-Fi', 'Tea and coffee', 'Cotton robes', 'In-room safe'],
    units: ['S01', 'S02'], gallery: photos('sea-studio', ['King bed and sea-facing window in the Sea Studio.', 'A linen daybed accommodates a third guest in the Sea Studio.', 'Pale stone, bronze taps and a walk-in shower in the Sea Studio bathroom.', 'Blue-green sea seen through the Sea Studio’s tall window; no private terrace.']) },
  { slug: 'aurel-suite', name: 'Aurel Suite', short: 'A little house within the house.',
    description: 'A quiet king bedroom, a separate lounge, and a private terrace looking out to sea. There is space for slow mornings together and a door to close when someone wants an early night. A two-person sofa bed in the lounge welcomes two additional guests.',
    feeling: 'Room for everyone. Time for yourself.', capacity: 4, area: 52, baseRate: 42000,
    bed: 'King bedroom + double sofa bed', view: 'Private sea-facing terrace', bathroom: 'Spacious pale-stone bathroom with a walk-in rain shower, double vanity and bronze fixtures.',
    amenities: ['Separate lounge', 'Private sea terrace', 'Double sofa bed', 'Linen bedding', 'Air conditioning', 'Wi-Fi', 'Tea and coffee', 'Cotton robes'],
    units: ['A01', 'A02'], gallery: photos('aurel-suite', ['The Aurel Suite’s king bedroom with walnut furniture and linen bedding.', 'The Aurel Suite’s separate lounge, with a two-person sofa bed.', 'A double stone vanity and walk-in shower in the Aurel Suite bathroom.', 'The Aurel Suite’s private terrace looks across the blue-green sea.']) },
];
export const SUPPORT: Photo[] = [
  { id: 'hero', alt: 'A warm limestone coastal house, a small turquoise pool and the Mediterranean horizon.', caption: 'A small house between the garden and the sea.', category: 'The house' },
  { id: 'courtyard', alt: 'An olive tree shades a quiet limestone courtyard with walnut doors and arched passageways.', caption: 'The courtyard, where the day begins.', category: 'The house' },
  { id: 'pool', alt: 'The house’s small rectangular pool, surrounded by pale stone and quiet planting.', caption: 'A little cool water, a lot of afternoon.', category: 'The house' },
  { id: 'dining', alt: 'Bread, seasonal fruit and handmade ceramics on a sunlit breakfast table.', caption: 'Breakfast, with nowhere to hurry.', category: 'At the table' },
  { id: 'coast', alt: 'A rocky coastal footpath beside clear blue-green water and Mediterranean vegetation.', caption: 'Follow the coast until you feel like turning back.', category: 'The coast' },
  { id: 'ceramics', alt: 'Handmade ceramic bowls and working clay on a warm, sunlit studio table.', caption: 'An afternoon spent making something by hand.', category: 'The coast' },
  { id: 'evening', alt: 'An intimate outdoor table set with linen and ceramics in the warm light of dusk.', caption: 'The last light, and one more course.', category: 'At the table' },
];
export const ALL_PHOTOS = [...SUPPORT, ...ROOMS.flatMap(room => room.gallery)];
export const getRoom = (slug: string) => ROOMS.find(room => room.slug === slug);
export const DISCLOSURE = 'Portfolio demonstration. Reservations are saved in this browser only. No payment is taken and no room is reserved.';
export const POLICY = 'Check-in from 15:00; checkout by 11:00 (Europe/Athens). Cancel before the arrival date for a full simulated refund. On arrival day or after check-in, please save a local inquiry. Prices include all fictional taxes and fees.';
