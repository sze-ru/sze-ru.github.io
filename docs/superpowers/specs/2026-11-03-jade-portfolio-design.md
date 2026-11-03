# Jade Ong portfolio design

Approved direction: the five-page editorial portfolio proposed in conversation, with CP as the corrected collaboration name and `sze-ru` as repository owner. The user requested a first pass while contact information is forthcoming.

## Experience

Home, About, Experience, Selected Work and Contact are separate, directly accessible static pages. The home page introduces Jade through her name, portrait, tagline and three selected projects. About connects the brand pillars to her experience. Experience presents hospitality, operations and marketing roles with source-supported dates. Selected Work presents VIP hospitality, WaterSource Evergreen / ELDEX and Melissa, plus a supporting CP collaboration. Case studies describe Jade's contribution and learning without inventing campaign results. Contact communicates opportunity interests and supports email and LinkedIn once provided.

## Visual direction

Charcoal, warm white, deep red and restrained silver. Large sans-serif display type mixed with italic serif accents, editorial photography, generous spacing, fine rules and numbered sections. Subtle ambient motion, a controllable marquee and progressive scroll reveals. No decorative effects may obscure content. Mobile layouts preserve hierarchy and readable text.

## Implementation

A dependency-free Node build produces static HTML from shared layout, editable content and page modules. CSS and a small progressive-enhancement script supply layout, navigation and motion. Source assets are optimised as WebP. No runtime framework, server or account system is required. Contact fields are empty until supplied; absent destinations render explanatory text rather than fake links. Content and navigation work without JavaScript.

## Hosting and handover

Create public repository `sze-ru/sze-ru.github.io` and configure GitHub Pages. The first pass publishes `dist` to the `gh-pages` branch because the available GitHub OAuth sign-in cannot upload workflow files. Keep an optional Actions configuration in `docs/deployment/` for later activation. Deploy only `dist`, never the original attachments, research or assignment documents. Source ownership remains with sze-ru. Document content editing, build, preview and deployment. The first pass uses the default GitHub domain; a custom domain can be configured when supplied.

## Verification

Check generated routes, links, assets, metadata and omission of research documents. Browser-check desktop and mobile, keyboard navigation, reduced motion, no-JavaScript readability and automatic accessibility rules. Verify successful deployment and an HTTP response from the published URL. Email, LinkedIn and final video embeds remain explicit content limitations until supplied.
