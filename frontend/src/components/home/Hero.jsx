import { LinkButton } from "../ui/Button";
import SearchBar from "./SearchBar";

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen%20Golf%20VIII%20Facelift%20IMG%208947.jpg?width=1600";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/85 to-blue-900/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-950/20 to-transparent" />

      <div className="relative mx-auto flex max-w-5xl flex-col px-4 py-24 sm:px-6 sm:py-32">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
          La bonne voiture, au bon prix, en quelques clics.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-blue-100">
          Mounfact Car vous propose un large choix de véhicules récents partout au Maroc. Réservez
          en ligne, récupérez vos clés le jour même.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to="/cars" variant="accent" className="px-6 py-3 text-base">
            Louer une voiture
          </LinkButton>
          <a
            href="#voitures-populaires"
            className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Voir nos voitures
          </a>
        </div>

        <div className="mt-10 max-w-2xl">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
