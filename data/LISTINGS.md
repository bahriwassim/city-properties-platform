# Listings data

The four City Properties listings supplied for this refresh are typed seed records in `data/listings.ts`. `LISTINGS` maps them to the existing `Property` model used by homepage cards, category pages, filters, and the existing residential/commercial detail routes. Both `sourceUrl` and `source_url` are kept for the source page; the original photo URLs remain in `photos` for traceability. The rendered `image_url` and `large_url` values use local WebP derivatives only.

## Add a listing

1. Add a record to the `rows` array in `data/listings.ts`, following the existing `SeedListing` shape. Add only verified details and leave unknown optional fields out or `null`.
2. Add its source page to `source_url` and original property image URLs to `photos`.
3. Run `node --experimental-strip-types scripts/prepare-listings.mjs`. It checks `_o`, then `_xl`, then the supplied `_l` URL; preserves the downloaded large source as `<slug>-NN_l.jpg` or `.png`; and writes WebP variants for 480, 960, 1600, and 2400 widths without enlarging small originals.
4. The data mapper builds local image paths automatically. Use `listing_type: 'sale'` for residential sales, `'rent'` for residential lettings, or `'commercial'` for commercial listings.

When Supabase is configured, seed listings are merged with published database listings by slug. Without Supabase, the seed records keep the public catalogue and detail pages usable. New Homes continues to use the existing developments table.

The source image service returned all 24 requested photos. Their largest source dimensions are 668 px on the long side (some portrait photos are 501 px high), so larger named WebP variants retain native resolution rather than being artificially enlarged. The hero image is separate and remains under 300 KB.
