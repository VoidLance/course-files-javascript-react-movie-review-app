# Movie Review

Movie Review is a Next.js and React app for discovering movies using data from
[The Movie Database (TMDB)](https://www.themoviedb.org/). Browse popular and
highly rated titles, explore genres, search by movie or actor, and open a movie's
TMDB page for more information.

## Features

- Popular, highly rated, and genre-specific movie pages
- Movie-title and actor searches powered by TMDB
- Client-side filtering by genre and minimum rating
- Sorting by popularity, rating, release date, or title
- Light and dark themes
- Responsive movie cards with posters, descriptions, genres, and ratings
- TypeScript, Tailwind CSS, and Next.js API routes

Movie ratings are sourced from TMDB and displayed as read-only values.

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js with npm
- A [TMDB API key](https://www.themoviedb.org/settings/api)

### Install and configure

```bash
git clone https://github.com/VoidLance/course-files-javascript-react-movie-review-app.git
cd course-files-javascript-react-movie-review-app
bun install
cp .env.example .env
```

Open `.env` and add your TMDB key:

```dotenv
TMDB_API_KEY="your-tmdb-api-key"
```

The key is used by the server-side `/api/movies` route and should not be
committed.

### Run locally

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The main
navigation includes:

- `/most-popular` — popular movies
- `/highly-rated` — top-rated movies with genre filters
- `/action`, `/fantasy`, `/romance`, and `/comedy` — genre pages

To create and run a production build:

```bash
bun run build
bun run start
```

If you use npm, replace `bun install` with `npm install` and `bun run <script>`
with `npm run <script>`.

## Project commands

| Command | Description |
| --- | --- |
| `bun run dev` | Start Next.js in development mode |
| `bun run build` | Create a production build |
| `bun run start` | Serve the production build |
| `bun run typecheck` | Run the TypeScript compiler without emitting files |
| `bun run check` | Run linting and TypeScript checks |
| `bun run format:check` | Check formatting with Prettier |
| `bun run format:write` | Format supported source files |

## Support and documentation

- Read the [Next.js documentation](https://nextjs.org/docs)
- Read the [TMDB API documentation](https://developer.themoviedb.org/docs)
- [Open an issue](https://github.com/VoidLance/course-files-javascript-react-movie-review-app/issues)
  for bugs or feature requests

When reporting an issue, include the page or command involved, the expected
behavior, and the relevant error output without sharing your API key.

## Contributing and maintenance

The project is maintained by [VoidLance](https://github.com/VoidLance).
Contributions are welcome: open an issue to discuss a substantial change, then
submit a focused pull request with a clear description and validation steps.
Please keep secrets such as `.env` files out of commits.

## Attribution

Movie metadata and images are provided by [TMDB](https://www.themoviedb.org/).
This product uses the TMDB API but is not endorsed or certified by TMDB.
