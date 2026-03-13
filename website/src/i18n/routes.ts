// DE path -> EN path mapping (without base prefix)
// null = no EN equivalent (legal pages stay German-only)
export const routeMap: Record<string, string | null> = {
  '/': '/',
  '/terrops/': '/terrops/',
  '/terrops/demo/': '/terrops/demo/',
  '/loesungen/events/': '/solutions/events/',
  '/loesungen/corporate/': '/solutions/corporate/',
  '/loesungen/kritis/': '/solutions/critical-infrastructure/',
  '/infrastruktur/': '/infrastructure/',
  '/infrastruktur/kamerasysteme/': '/infrastructure/camera-systems/',
  '/infrastruktur/durchsagesysteme/': '/infrastructure/pa-systems/',
  '/infrastruktur/leitstelle/': '/infrastructure/command-center/',
  '/referenzen/': '/references/',
  '/unternehmen/': '/about/',
  '/kontakt/': '/contact/',
  '/impressum/': null,
  '/datenschutz/': null,
  '/agb/': null,
};
