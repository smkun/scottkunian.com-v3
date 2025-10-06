export function About() {
  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <section className="w-full max-w-6xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl px-6 py-12">
        {/* Hero Section with Gradient Text */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 pb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Rolling for Initiative: The Scott Kunian Saga
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Welcome to my world of tech, games, and creative adventures!
          </p>
        </div>

        {/* Career Journey */}
        <article className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-primary/20 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Career Journey
            </h2>
            <div className="space-y-4 text-foreground/90">
              <p className="leading-relaxed">
                With over <span className="text-accent font-semibold">30 years in IT</span>, I've worn many hats—from{' '}
                <span className="text-primary font-semibold">Systems Administrator</span> to{' '}
                <span className="text-primary font-semibold">Senior Systems Engineer</span> to{' '}
                <span className="text-accent font-semibold">IT Systems Team Leader</span>. My work blends hands‑on problem solving, infrastructure design, and leading cross‑functional teams.
              </p>
              <p className="leading-relaxed">
                Today, I lead systems at <span className="text-accent font-semibold">ClearMotion</span>. I manage{' '}
                <span className="text-primary font-semibold">VMware/vSphere, Windows/AD, networking, storage, and M365/Entra</span>. I also evaluate on‑prem vs. cloud costs and guide data‑center moves.
              </p>
              <p className="leading-relaxed">
                Before this, I spent nearly <span className="text-accent font-semibold">18 years at Radius Recycling</span>, coordinating IT across multiple sites, rolling out secure, scalable systems, and lifting uptime and performance.
              </p>
              <p className="leading-relaxed">
                I completed a <span className="text-accent font-semibold">26‑week Software Engineering Bootcamp</span> at{' '}
                <span className="text-primary font-semibold">General Assembly</span>. That added modern dev skills—<span className="text-primary font-semibold">JavaScript, Python, React, Node, and cloud</span>—to my infrastructure background.
              </p>
            </div>
          </div>
        </article>

        {/* Gaming Life */}
        <article className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-primary/20 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary mb-6">
              A Life Full of Games
            </h2>
            <div className="space-y-4 text-foreground/90">
              <p className="leading-relaxed">
                I've been gaming since <span className="text-accent font-semibold">1977</span> and I'm still at the table every week. Our{' '}
                <span className="text-primary font-semibold">Thursday group has run since 1989</span>. I GM and play{' '}
                <span className="text-primary font-semibold">D&D, RuneQuest, Traveller, Marvel Multiverse RPG, Daggerheart, Star Wars d6, Mutant Epoch</span>, and more.
              </p>
              <p className="leading-relaxed">
                I also run a home print farm for terrain and minis:{' '}
                <span className="text-accent font-semibold">4 Prusa MK4s, 2 Elegoo Saturn 4 Ultras, 1 Bambu A1 Mini</span>. Full encounters, armies, and custom set pieces roll off the bench.
              </p>
            </div>
          </div>
        </article>

        {/* Work Meets Play */}
        <article className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-primary/20 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-secondary/5 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Work Meets Play
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              I co‑own{' '}
              <a
                href="https://www.midgardhobbiesandgames.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-primary transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-primary font-semibold"
              >
                Midgard Hobbies & Games
              </a>{' '}
              in Derry, NH. I also support{' '}
              <a
                href="https://www.affairstorememberflorist.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-primary transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-primary font-semibold"
              >
                Affairs to Remember Florist
              </a>{' '}
              with IT and logistics.
            </p>
          </div>
        </article>

        {/* Pets */}
        <article className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-primary/20 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Pets
            </h2>

            {/* Current Pets */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-secondary mb-4">Current</h3>
              <ul className="space-y-1 text-foreground/90">
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-accent text-xl">•</span>
                  <span><span className="text-accent font-semibold">Zula</span> — Rottweiler; Yes she really is a princess</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-accent text-xl">•</span>
                  <span><span className="text-accent font-semibold">Peanut</span> — white cat; veteran nap specialist</span>
                </li>
              </ul>
            </div>

            {/* In Memory */}
            <div>
              <h3 className="text-2xl font-bold text-secondary mb-4">In Memory</h3>
              <ul className="space-y-1 text-foreground/90">
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Max</span> — American Staffordshire Terrier, 90 lb; steady guardian</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Daphne</span> — Russian Blue; refined and bossy</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Poli</span> — my mom's cat</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Tigger</span> — the old and crusty</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Droopy</span> — the forever kitten</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Cheetoh</span> — the very orange cat</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Diggy</span> — followed Lori home and stayed</span>
                </li>
                <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-muted-foreground text-xl">•</span>
                  <span><span className="text-muted-foreground font-semibold">Ugy the Barbarian</span> — rescued from a squirrel trap; fierce heart</span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        {/* Fun Facts */}
        <article className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-primary/20 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Fun Facts
            </h2>
            <ul className="space-y-1 text-foreground/90">
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <span>Gaming since 6 years old—first D&D session in <span className="text-accent font-semibold">1977</span>.</span>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <span>Can print an entire 3D army overnight with my printers.</span>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <span>Favorite Movie: <span className="text-accent font-semibold">Conan the Barbarian</span>.</span>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <span>Favorite Game: <span className="text-accent font-semibold">Conan Exiles</span> (and MMOs).</span>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <span>Tabletop Wargaming Fanatic—<span className="text-accent font-semibold">Heavy Gear</span> is my favorite.</span>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <div>
                  <span className="text-accent font-semibold">Thursday Night Epic:</span> You have run the same RPG night since <span className="text-accent font-semibold">1989</span>, routinely herding 7 to 10 players without flipping the table. That is logistics, diplomacy and storytelling rolled into one.
                </div>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <div>
                  <span className="text-accent font-semibold">Print Farm Flex:</span> With <span className="text-primary font-semibold">7 printers</span> (4 Prusa MK4s, 2 Elegoo Saturn 4 Ultras and 1 Bambu A1 Mini), you can spin up a full 28mm army or a complete dungeon overnight. You actually do.
                </div>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <div>
                  <span className="text-accent font-semibold">MMO Healer Street Cred:</span> Former <span className="text-primary font-semibold">server first Healing Paladin in WoW: Burning Crusade</span>. Today I still main support and plan a Wand/Bow healer in Throne and Liberty.
                </div>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <div>
                  <span className="text-accent font-semibold">IT by the Numbers:</span> You have led data center moves, built on‑prem vs cloud cost models executives can read and shipped Excel dashboards from Teams activity.
                </div>
              </li>
              <li className="leading-relaxed flex items-start gap-3 p-1 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                <span className="text-accent text-xl">•</span>
                <div>
                  <span className="text-accent font-semibold">Pets Are NPCs:</span> Your animals get campaign grade names (hello, <span className="text-primary font-semibold">Ugy the Barbarian</span>) and full backstories. In this house, companions are part of the party.
                </div>
              </li>
            </ul>
          </div>
        </article>

      </section>
    </div>
  );
}
