export function Contact() {
  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Let's Connect
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're looking to collaborate, discuss technology, or just say hello—I'd love to hear from you!
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Contact Info */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Get In Touch
            </h2>
            <p className="text-foreground/90 mb-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                <div>
                  <div className="font-semibold text-primary mb-1">Email</div>
                  <a href="mailto:scott@scottkunian.com" className="text-foreground/80 hover:text-accent transition-colors duration-300">
                    scott@scottkunian.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors duration-300">
                <div>
                  <div className="font-semibold text-accent mb-1">LinkedIn</div>
                  <a
                    href="https://www.linkedin.com/in/scott-kunian-8984302/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    linkedin.com/in/scott-kunian-8984302
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors duration-300">
                <div>
                  <div className="font-semibold text-secondary mb-1">Facebook</div>
                  <a
                    href="https://www.facebook.com/skunian/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    facebook.com/skunian
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Links */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-accent/20 hover:border-accent/40 transition-all duration-500 hover:scale-[1.02]">
            <h3 className="text-2xl font-bold text-accent mb-6">
              My Ventures
            </h3>
            <div className="space-y-4">
              <a
                href="https://www.midgardhobbiesandgames.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-card border border-primary/20 hover:border-primary transition-all duration-300"
              >
                <div className="font-semibold text-primary mb-1">Midgard Hobbies & Games</div>
                <div className="text-sm text-foreground/70">Game store in Derry, NH</div>
              </a>
              <a
                href="https://www.affairstorememberflorist.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-card border border-accent/20 hover:border-accent transition-all duration-300"
              >
                <div className="font-semibold text-accent mb-1">Affairs to Remember Florist</div>
                <div className="text-sm text-foreground/70">Family flower shop</div>
              </a>
            </div>
          </div>
        </div>

        {/* Additional CTA Section */}
        <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-primary/20">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Looking to Collaborate?
            </h3>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              I'm always interested in hearing about new projects, tech discussions, or gaming adventures!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/projects"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-primary/50 rounded-xl font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
              >
                View My Work
              </a>
              <a
                href="/about"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-accent/50 rounded-xl font-semibold text-accent hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
              >
                Learn More About Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
