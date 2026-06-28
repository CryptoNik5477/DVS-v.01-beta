import type { Locale } from "@/i18n/config";

/**
 * Localised long-form content (FAQ + static pages) for all supported locales.
 * Centralised here so translators edit a single file. Falls back to English.
 */

export interface FaqItem {
  q: string;
  a: string;
}
export interface ContentPage {
  title: string;
  body: string[];
}
type PageKey = "about" | "contact" | "privacy" | "terms";

export const faqByLocale: Record<Locale, FaqItem[]> = {
  en: [
    { q: "How long does international shipping take?", a: "We ship worldwide from Thailand. Standard delivery takes 5–24 business days depending on your region; express options with full tracking are available at checkout." },
    { q: "Can I add a player name and number?", a: "Yes! Every customizable jersey includes our flocking configurator — add any name, number, font and color with a live preview before you buy." },
    { q: "What sizes do you offer?", a: "All jerseys are available from XS to XXL. Check the size guide on each product page for exact measurements." },
    { q: "Which payment methods do you accept?", a: "We accept Visa, Mastercard, Apple Pay and Google Pay through our secure Stripe checkout. More methods are coming soon." },
    { q: "What is your return policy?", a: "Unworn items in original condition can be returned within 14 days. Personalized (flocked) jerseys are final sale unless faulty." },
  ],
  fr: [
    { q: "Combien de temps prend la livraison internationale ?", a: "Nous expédions dans le monde entier depuis la Thaïlande. La livraison standard prend 5 à 24 jours ouvrés selon la région ; des options express avec suivi complet sont disponibles au paiement." },
    { q: "Puis-je ajouter un nom et un numéro de joueur ?", a: "Oui ! Chaque maillot personnalisable inclut notre configurateur de flocage — ajoutez nom, numéro, police et couleur avec un aperçu en direct avant l'achat." },
    { q: "Quelles tailles proposez-vous ?", a: "Tous les maillots sont disponibles du XS au XXL. Consultez le guide des tailles sur chaque fiche produit pour les mesures exactes." },
    { q: "Quels moyens de paiement acceptez-vous ?", a: "Nous acceptons Visa, Mastercard, Apple Pay et Google Pay via notre paiement sécurisé Stripe. D'autres moyens arrivent bientôt." },
    { q: "Quelle est votre politique de retour ?", a: "Les articles non portés et en état d'origine peuvent être retournés sous 14 jours. Les maillots personnalisés (floqués) ne sont ni repris ni échangés sauf défaut." },
  ],
  it: [
    { q: "Quanto tempo richiede la spedizione internazionale?", a: "Spediamo in tutto il mondo dalla Thailandia. La consegna standard richiede 5–24 giorni lavorativi a seconda della regione; al checkout sono disponibili opzioni express con tracciamento completo." },
    { q: "Posso aggiungere nome e numero del giocatore?", a: "Sì! Ogni maglia personalizzabile include il nostro configuratore — aggiungi nome, numero, carattere e colore con anteprima in tempo reale prima dell'acquisto." },
    { q: "Quali taglie offrite?", a: "Tutte le maglie sono disponibili dalla XS alla XXL. Consulta la guida alle taglie su ogni pagina prodotto per le misure esatte." },
    { q: "Quali metodi di pagamento accettate?", a: "Accettiamo Visa, Mastercard, Apple Pay e Google Pay tramite il checkout sicuro Stripe. Presto altri metodi." },
    { q: "Qual è la vostra politica di reso?", a: "Gli articoli non indossati e in condizioni originali possono essere resi entro 14 giorni. Le maglie personalizzate sono vendita finale salvo difetti." },
  ],
  de: [
    { q: "Wie lange dauert der internationale Versand?", a: "Wir versenden weltweit aus Thailand. Der Standardversand dauert je nach Region 5–24 Werktage; Express-Optionen mit voller Sendungsverfolgung gibt es an der Kasse." },
    { q: "Kann ich Spielername und Nummer hinzufügen?", a: "Ja! Jedes personalisierbare Trikot enthält unseren Beflockungs-Konfigurator — füge Name, Nummer, Schriftart und Farbe mit Live-Vorschau vor dem Kauf hinzu." },
    { q: "Welche Größen bietet ihr an?", a: "Alle Trikots sind von XS bis XXL erhältlich. Die genauen Maße findest du in der Größentabelle auf jeder Produktseite." },
    { q: "Welche Zahlungsmethoden akzeptiert ihr?", a: "Wir akzeptieren Visa, Mastercard, Apple Pay und Google Pay über den sicheren Stripe-Checkout. Weitere Methoden folgen bald." },
    { q: "Wie ist eure Rückgaberichtlinie?", a: "Ungetragene Artikel im Originalzustand können innerhalb von 14 Tagen zurückgegeben werden. Personalisierte (beflockte) Trikots sind vom Umtausch ausgeschlossen, außer bei Mängeln." },
  ],
  es: [
    { q: "¿Cuánto tarda el envío internacional?", a: "Enviamos a todo el mundo desde Tailandia. La entrega estándar tarda de 5 a 24 días hábiles según la región; en el pago hay opciones exprés con seguimiento completo." },
    { q: "¿Puedo añadir nombre y número de jugador?", a: "¡Sí! Cada camiseta personalizable incluye nuestro configurador de estampado — añade nombre, número, tipografía y color con vista previa en vivo antes de comprar." },
    { q: "¿Qué tallas ofrecéis?", a: "Todas las camisetas están disponibles de XS a XXL. Consulta la guía de tallas en cada página de producto para las medidas exactas." },
    { q: "¿Qué métodos de pago aceptáis?", a: "Aceptamos Visa, Mastercard, Apple Pay y Google Pay mediante el pago seguro de Stripe. Pronto más métodos." },
    { q: "¿Cuál es vuestra política de devoluciones?", a: "Los artículos sin usar y en su estado original pueden devolverse en 14 días. Las camisetas personalizadas son venta final salvo defecto." },
  ],
  nl: [
    { q: "Hoe lang duurt internationale verzending?", a: "We verzenden wereldwijd vanuit Thailand. Standaardlevering duurt 5–24 werkdagen afhankelijk van je regio; express-opties met volledige tracering zijn beschikbaar bij het afrekenen." },
    { q: "Kan ik een spelersnaam en nummer toevoegen?", a: "Ja! Elk personaliseerbaar shirt bevat onze bedrukkingsconfigurator — voeg naam, nummer, lettertype en kleur toe met een live voorvertoning vóór je koopt." },
    { q: "Welke maten bieden jullie aan?", a: "Alle shirts zijn verkrijgbaar van XS tot XXL. Bekijk de maattabel op elke productpagina voor exacte maten." },
    { q: "Welke betaalmethoden accepteren jullie?", a: "We accepteren Visa, Mastercard, Apple Pay en Google Pay via de veilige Stripe-checkout. Binnenkort meer methoden." },
    { q: "Wat is jullie retourbeleid?", a: "Ongedragen artikelen in originele staat kunnen binnen 14 dagen worden geretourneerd. Gepersonaliseerde (bedrukte) shirts zijn uitgesloten van retour, tenzij defect." },
  ],
};

export const pagesByLocale: Record<Locale, Record<PageKey, ContentPage>> = {
  en: {
    about: { title: "About JerseyFootAcademy", body: ["JerseyFootAcademy is a premium football jersey store bringing authentic-quality kits from the world's greatest clubs and national teams to fans everywhere.", "We ship worldwide from Thailand and offer custom flocking so you can wear your name and number with pride.", "Support Your Team. Wear The Passion."] },
    contact: { title: "Contact Us", body: ["Questions about an order, sizing or shipping? Our support team typically replies within one business day.", "Email: hello@jerseyfootacademy.com", "Phone: +66 83 919 2903", "Location: Mukdahan, Thailand"] },
    privacy: { title: "Privacy Policy", body: ["We respect your privacy and collect only the data necessary to process your orders and improve your experience.", "Payment information is handled securely by Stripe and is never stored on our servers.", "This is placeholder text — replace it with your reviewed privacy policy before going live."] },
    terms: { title: "Terms of Service", body: ["By using JerseyFootAcademy you agree to our terms of sale, shipping and returns.", "Personalised (flocked) items are final sale unless faulty.", "This is placeholder text — replace it with your reviewed terms before going live."] },
  },
  fr: {
    about: { title: "À propos de JerseyFootAcademy", body: ["JerseyFootAcademy est une boutique premium de maillots de football qui propose aux fans du monde entier des maillots de qualité authentique des plus grands clubs et sélections.", "Nous expédions dans le monde entier depuis la Thaïlande et proposons un flocage personnalisé pour porter fièrement votre nom et votre numéro.", "Soutenez votre équipe. Portez la passion."] },
    contact: { title: "Nous contacter", body: ["Une question sur une commande, une taille ou la livraison ? Notre équipe répond généralement sous un jour ouvré.", "Email : hello@jerseyfootacademy.com", "Téléphone : +66 83 919 2903", "Adresse : Mukdahan, Thaïlande"] },
    privacy: { title: "Politique de confidentialité", body: ["Nous respectons votre vie privée et ne collectons que les données nécessaires au traitement de vos commandes et à l'amélioration de votre expérience.", "Les informations de paiement sont traitées de manière sécurisée par Stripe et ne sont jamais stockées sur nos serveurs.", "Ceci est un texte provisoire — remplacez-le par votre politique de confidentialité validée avant la mise en ligne."] },
    terms: { title: "Conditions générales", body: ["En utilisant JerseyFootAcademy, vous acceptez nos conditions de vente, de livraison et de retour.", "Les articles personnalisés (floqués) ne sont ni repris ni échangés, sauf défaut.", "Ceci est un texte provisoire — remplacez-le par vos conditions validées avant la mise en ligne."] },
  },
  it: {
    about: { title: "Chi è JerseyFootAcademy", body: ["JerseyFootAcademy è un negozio premium di maglie da calcio che porta ai tifosi di tutto il mondo maglie di qualità autentica dei più grandi club e nazionali.", "Spediamo in tutto il mondo dalla Thailandia e offriamo la personalizzazione per indossare con orgoglio il tuo nome e il tuo numero.", "Sostieni la tua squadra. Indossa la passione."] },
    contact: { title: "Contattaci", body: ["Domande su un ordine, sulle taglie o sulla spedizione? Il nostro team risponde di solito entro un giorno lavorativo.", "Email: hello@jerseyfootacademy.com", "Telefono: +66 83 919 2903", "Sede: Mukdahan, Thailandia"] },
    privacy: { title: "Informativa sulla privacy", body: ["Rispettiamo la tua privacy e raccogliamo solo i dati necessari per elaborare i tuoi ordini e migliorare la tua esperienza.", "Le informazioni di pagamento sono gestite in modo sicuro da Stripe e non vengono mai memorizzate sui nostri server.", "Questo è un testo segnaposto — sostituiscilo con la tua informativa sulla privacy verificata prima della pubblicazione."] },
    terms: { title: "Termini di servizio", body: ["Utilizzando JerseyFootAcademy accetti i nostri termini di vendita, spedizione e reso.", "Gli articoli personalizzati sono vendita finale salvo difetti.", "Questo è un testo segnaposto — sostituiscilo con i tuoi termini verificati prima della pubblicazione."] },
  },
  de: {
    about: { title: "Über JerseyFootAcademy", body: ["JerseyFootAcademy ist ein Premium-Shop für Fußballtrikots, der Fans weltweit Trikots in authentischer Qualität der größten Vereine und Nationalmannschaften bietet.", "Wir versenden weltweit aus Thailand und bieten individuelle Beflockung, damit du deinen Namen und deine Nummer mit Stolz trägst.", "Unterstütze dein Team. Trage die Leidenschaft."] },
    contact: { title: "Kontakt", body: ["Fragen zu einer Bestellung, Größen oder dem Versand? Unser Team antwortet in der Regel innerhalb eines Werktags.", "E-Mail: hello@jerseyfootacademy.com", "Telefon: +66 83 919 2903", "Standort: Mukdahan, Thailand"] },
    privacy: { title: "Datenschutzerklärung", body: ["Wir respektieren deine Privatsphäre und erheben nur die Daten, die zur Bearbeitung deiner Bestellungen und zur Verbesserung deiner Erfahrung nötig sind.", "Zahlungsinformationen werden sicher von Stripe verarbeitet und niemals auf unseren Servern gespeichert.", "Dies ist ein Platzhaltertext — ersetze ihn vor dem Livegang durch deine geprüfte Datenschutzerklärung."] },
    terms: { title: "Nutzungsbedingungen", body: ["Mit der Nutzung von JerseyFootAcademy akzeptierst du unsere Verkaufs-, Versand- und Rückgabebedingungen.", "Personalisierte (beflockte) Artikel sind vom Umtausch ausgeschlossen, außer bei Mängeln.", "Dies ist ein Platzhaltertext — ersetze ihn vor dem Livegang durch deine geprüften Bedingungen."] },
  },
  es: {
    about: { title: "Sobre JerseyFootAcademy", body: ["JerseyFootAcademy es una tienda premium de camisetas de fútbol que ofrece a los aficionados de todo el mundo camisetas de calidad auténtica de los mejores clubes y selecciones.", "Enviamos a todo el mundo desde Tailandia y ofrecemos estampado personalizado para llevar tu nombre y número con orgullo.", "Apoya a tu equipo. Viste la pasión."] },
    contact: { title: "Contacto", body: ["¿Dudas sobre un pedido, tallas o el envío? Nuestro equipo suele responder en un día hábil.", "Email: hello@jerseyfootacademy.com", "Teléfono: +66 83 919 2903", "Ubicación: Mukdahan, Tailandia"] },
    privacy: { title: "Política de privacidad", body: ["Respetamos tu privacidad y solo recopilamos los datos necesarios para procesar tus pedidos y mejorar tu experiencia.", "La información de pago la gestiona Stripe de forma segura y nunca se almacena en nuestros servidores.", "Este es un texto provisional — sustitúyelo por tu política de privacidad revisada antes de publicar."] },
    terms: { title: "Términos del servicio", body: ["Al usar JerseyFootAcademy aceptas nuestros términos de venta, envío y devoluciones.", "Los artículos personalizados son venta final salvo defecto.", "Este es un texto provisional — sustitúyelo por tus términos revisados antes de publicar."] },
  },
  nl: {
    about: { title: "Over JerseyFootAcademy", body: ["JerseyFootAcademy is een premium voetbalshirtwinkel die fans wereldwijd shirts van authentieke kwaliteit van de grootste clubs en nationale teams biedt.", "We verzenden wereldwijd vanuit Thailand en bieden eigen bedrukking zodat je je naam en nummer met trots draagt.", "Steun je team. Draag de passie."] },
    contact: { title: "Contact", body: ["Vragen over een bestelling, maten of verzending? Ons team reageert doorgaans binnen één werkdag.", "E-mail: hello@jerseyfootacademy.com", "Telefoon: +66 83 919 2903", "Locatie: Mukdahan, Thailand"] },
    privacy: { title: "Privacybeleid", body: ["We respecteren je privacy en verzamelen alleen de gegevens die nodig zijn om je bestellingen te verwerken en je ervaring te verbeteren.", "Betaalgegevens worden veilig door Stripe verwerkt en nooit op onze servers opgeslagen.", "Dit is een plaatshoudertekst — vervang deze vóór livegang door je gecontroleerde privacybeleid."] },
    terms: { title: "Servicevoorwaarden", body: ["Door JerseyFootAcademy te gebruiken ga je akkoord met onze verkoop-, verzend- en retourvoorwaarden.", "Gepersonaliseerde (bedrukte) artikelen zijn uitgesloten van retour, tenzij defect.", "Dit is een plaatshoudertekst — vervang deze vóór livegang door je gecontroleerde voorwaarden."] },
  },
};

export function getFaq(locale: string): FaqItem[] {
  return faqByLocale[(locale as Locale)] ?? faqByLocale.en;
}
export function getContentPage(locale: string, key: string): ContentPage | undefined {
  const set = pagesByLocale[(locale as Locale)] ?? pagesByLocale.en;
  return set[key as PageKey];
}
export const contentPageKeys: PageKey[] = ["about", "contact", "privacy", "terms"];
