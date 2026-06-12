import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Business } from './models/Business';
import { Feedback } from './models/Feedback';
import { Scan } from './models/Scan';
import { User } from './models/User';
import { Registration } from './models/Registration';
import { Subscription } from './models/Subscription';
import { authMiddleware, requireRole, generateToken, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-google-reviews';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    // Seed default admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({ email: 'admin@aireviews.com', password: 'admin123', role: 'admin' });
      console.log('Default admin created: admin@aireviews.com / admin123');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// ==========================================
// AUTH ROUTES
// ==========================================

app.post('/api/auth/register', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role, businessId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const user = await User.create({ email, password, role: role || 'merchant', businessId: businessId || null });
    return res.status(201).json({ _id: user._id, email: user.email, role: user.role, businessId: user.businessId });
  } catch (error) {
    console.error('Error in POST /api/auth/register:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user._id.toString());
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({ _id: user._id, email: user.email, role: user.role, businessId: user.businessId });
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
  return res.status(200).json({ message: 'Logged out successfully.' });
});

app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    return res.status(200).json({ _id: user._id, email: user.email, role: user.role, businessId: user.businessId });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/admin/users', authMiddleware, requireRole('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().populate('businessId', 'name').sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/admin/users/:id', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid User ID format.' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// MERCHANT REGISTRATION (Public)
// ==========================================

app.post('/api/auth/register-merchant', async (req: Request, res: Response) => {
  try {
    const { name, category, context, googleReviewUrl, location, mobileNumber, email, password } = req.body;
    if (!name || !category || !email || !password) {
      return res.status(400).json({ error: 'Business name, category, email, and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    const existingReg = await Registration.findOne({ email });
    if (existingUser || existingReg) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const registration = await Registration.create({
      name, category, context: context || '', googleReviewUrl: googleReviewUrl || '',
      location: location || '', mobileNumber: mobileNumber || '', email, password
    });
    return res.status(201).json({ message: 'Registration submitted. Waiting for admin approval.', _id: registration._id });
  } catch (error) {
    console.error('Error in POST /api/auth/register-merchant:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/admin/registrations', authMiddleware, requireRole('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return res.status(200).json(registrations);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/admin/registrations/:id/approve', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Registration ID.' });
    }
    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ error: 'Registration not found.' });

    // Create business
    const business = await Business.create({
      name: reg.name, category: reg.category, context: reg.context,
      googleReviewUrl: reg.googleReviewUrl, location: reg.location,
      mobileNumber: reg.mobileNumber, isApproved: true
    });

    // Create merchant user
    const user = await User.create({ email: reg.email, password: reg.password, role: 'merchant', businessId: business._id });

    // Update registration status
    reg.status = 'approved';
    await reg.save();

    return res.status(200).json({ message: 'Registration approved. Business and merchant account created.', business, user: { _id: user._id, email: user.email } });
  } catch (error) {
    console.error('Error approving registration:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/admin/registrations/:id/reject', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Registration ID.' });
    }
    const reg = await Registration.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!reg) return res.status(404).json({ error: 'Registration not found.' });
    return res.status(200).json({ message: 'Registration rejected.', registration: reg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fallback template reviews generator
function getFallbackReviews(name: string, category: string, context: string, rating: number, language: string): string[] {
  const isHighRating = rating >= 4;
  
  const templates: Record<string, string[]> = isHighRating ? {
    'English': [
      `Absolutely love ${name}! The best ${category} in town. The service was fantastic and the experience was overall amazing. Highly recommend!`,
      `Had a great experience at ${name}. Their attention to detail and customer care really stands out. Will definitely be coming back soon.`,
      `Very pleased with this ${category}. They were friendly, professional, and delivered exactly what I was hoping for. Five stars!`,
      `Great quality and super friendly staff. You can tell they care about their customer's satisfaction. Highly recommend ${name}!`,
      `A wonderful find! Prompt service, high quality, and a really welcoming environment. Definitely worth visiting.`
    ],
    'Spanish': [
      `¡Me encanta ${name}! El mejor ${category} de la zona. El servicio fue fantástico y la experiencia en general fue increíble. ¡Muy recomendado!`,
      `Tuve una gran experiencia en ${name}. Su atención al detalle y cuidado al cliente realmente destacan. Definitivamente volveré pronto.`,
      `Muy satisfecho con este ${category}. Fueron amables, profesionales y ofrecieron exactamente lo que esperaba. ¡Cinco estrellas!`,
      `Excelente calidad y personal super amable. Se nota que se preocupan por la satisfacción del cliente. ¡Recomiendo mucho ${name}!`,
      `¡Un gran descubrimiento! Servicio rápido, alta calidad y un ambiente muy acogedor. Definitivamente vale la pena visitarlo.`
    ],
    'French': [
      `J'adore ${name} ! Le meilleur ${category} de la ville. Le service était fantastique et l'expérience globale était incroyable. Je recommande vivement !`,
      `J'ai passé un excellent moment chez ${name}. Leur attention aux détails et leur service client se démarquent vraiment. Je reviendrai à coup sûr.`,
      `Très satisfait de ce ${category}. Ils étaient sympathiques, professionnels et ont répondu à toutes mes attentes. Cinq étoiles !`,
      `Excellente qualité et personnel super sympa. On voit qu'ils se soucient de la satisfaction de leurs clients. Je recommande chaudement ${name} !`,
      `Une superbe découverte ! Service rapide, qualité au top et accueil très chaleureux. Vaut vraiment le détour.`
    ],
    'German': [
      `Ich liebe ${name} absolut! Der beste ${category} in der Stadt. Der Service war fantastisch und die Erfahrung insgesamt großartig. Sehr zu empfehlen!`,
      `Hatte eine tolle Erfahrung bei ${name}. Die Liebe zum Detail und der Kundenservice stechen wirklich heraus. Komme auf jeden Fall bald wieder.`,
      `Sehr zufrieden mit diesem ${category}. Sie waren freundlich, professionell und haben genau das geliefert, was ich mir erhofft hatte. Fünf Sterne!`,
      `Tolle Qualität und super freundliches Personal. Man merkt, dass ihnen die Kundenzufriedenheit am Herzen liegt. Sehr zu empfehlen, ${name}!`,
      `Ein wunderbarer Fund! Schneller Service, hohe Qualität und ein wirklich einladendes Umfeld. Definitiv einen Besuch wert.`
    ],
    'Hindi': [
      `${name} मुझे बहुत पसंद आया! शहर का सबसे बेहतरीन ${category}। सेवा शानदार थी और अनुभव कुल मिलाकर बहुत बढ़िया था। ज़रूर आएं!`,
      `${name} में बहुत अच्छा अनुभव रहा। ग्राहकों के प्रति इनका ध्यान और व्यवहार कमाल का है। मैं जल्द ही दोबारा आऊंगा।`,
      `इस ${category} से बहुत खुश हूँ। वे मिलनसार, पेशेवर थे और बिल्कुल वैसा ही मिला जैसी मुझे उम्मीद थी। 5 स्टार!`,
      `शानدار गुणवत्ता और बेहद मिलनसार स्टाफ। आप बता सकते हैं कि उन्हें ग्राहक की संतुष्टि की परवाह है। ${name} की अत्यधिक सिफारिश करता हूँ!`,
      `एक अद्भुत अनुभव! त्वरित सेवा, उच्च गुणवत्ता और बहुत ही स्वागत योग्य वातावरण। यहाँ जाना वाकई सार्थक है।`
    ]
  } : {
    'English': [
      `${name} has potential, but the experience was mixed. The ${category} quality was decent, but the service needs some improvement.`,
      `An average experience at ${name}. Some aspects were good, but others felt a bit lacking. Hopefully they can improve.`,
      `Okay ${category} service, but not quite up to my expectations. The staff was polite but the wait time was too long.`,
      `Decent quality, though I expected a bit more based on reviews. The overall experience was just okay.`,
      `Fine visit to ${name}, but there is room for improvement in their speed and customer attention.`
    ],
    'Spanish': [
      `${name} tiene potencial, pero la experiencia fue mixta. La calidad del ${category} estuvo bien, pero el servicio necesita mejorar.`,
      `Una experiencia promedio en ${name}. Algunos aspectos fueron buenos, pero otros dejaron que desear. Ojalá mejoren.`,
      `Servicio de ${category} aceptable, pero no cumplió del todo mis expectativas. El personal fue amable pero la espera fue larga.`,
      `Calidad aceptable, aunque esperaba un poco más por las opiniones. La experiencia en general fue regular.`,
      `Visita aceptable a ${name}, pero hay margen de mejora en la rapidez y atención al cliente.`
    ],
    'French': [
      `${name} a du potentiel, mais l'expérience était mitigée. La qualité de ce ${category} était correcte, mais le service doit être amélioré.`,
      `Une expérience moyenne chez ${name}. Certains aspects étaient bons, d'autres laissaient à désirer. En espérant des améliorations.`,
      `Service de ${category} convenable, mais pas tout à fait à la hauteur de mes attentes. Personnel poli mais temps d'attente trop long.`,
      `Qualité correcte, bien que je m'attendais à un peu mieux d'après les avis. L'expérience globale était moyenne.`,
      `Visite correcte chez ${name}, mais des progrès restent à faire sur la rapidité et l'attention aux clients.`
    ],
    'German': [
      `${name} hat Potenzial, aber die Erfahrung war gemischt. Die ${category}-Qualität war in Ordnung, aber der Service muss verbessert werden.`,
      `Eine durchschnittliche Erfahrung bei ${name}. Einige Aspekte waren gut, andere ausbaufähig. Hoffentlich verbessern sie sich.`,
      `Akzeptabler ${category}-Service, aber nicht ganz auf der Höhe meiner Erwartungen. Personal war höflich, aber die Wartezeit zu lang.`,
      `Ordentliche Qualität, obwohl ich mir nach den Bewertungen mehr erhofft hatte. Die Gesamterfahrung war nur okay.`,
      `Ganz netter Besuch bei ${name}, aber es gibt Luft nach oben bei der Schnelligkeit und Aufmerksamkeit.`
    ],
    'Hindi': [
      `${name} में सुधार की गुंजाइश है, लेकिन अनुभव मिला-जुला रहा। ${category} की गुणवत्ता ठीक थी, लेकिन सेवा में सुधार की आवश्यकता है।`,
      `${name} में एक औसत अनुभव। कुछ चीजें अच्छी थीं, लेकिन अन्य में कमी महसूस हुई। उम्मीद है कि वे सुधार करेंगे।`,
      `ठीक-ठाक ${category} सेवा, लेकिन मेरी उम्मीदों के अनुरूप नहीं। स्टाफ विनम्र था लेकिन प्रतीक्षा समय बहुत लंबा था।`,
      `ठीक गुणवत्ता, हालांकि समीक्षाओं के आधार पर मैंने कुछ अधिक की उम्मीद की थी। कुल मिलाकर अनुभव सामान्य रहा।`,
      `${name} की यात्रा ठीक रही, लेकिन गति और ग्राहकों के प्रति ध्यान देने में सुधार की आवश्यकता है।`
    ]
  };

  const defaultTemplates = templates['English'];
  const selectedTemplates = templates[language] || defaultTemplates;

  // Insert specific context elements in the templates
  const lowercaseContext = context.toLowerCase();
  let contextSnippet = '';
  if (lowercaseContext.includes('pizza')) contextSnippet = language === 'English' ? ' The pizza was delicious!' : '';
  if (lowercaseContext.includes('coffee')) contextSnippet = language === 'English' ? ' Best coffee I\'ve had in a while.' : '';
  if (lowercaseContext.includes('friendly')) contextSnippet = language === 'English' ? ' The staff is incredibly friendly.' : '';

  return selectedTemplates.map(t => {
    if (contextSnippet && Math.random() > 0.4 && isHighRating) {
      return t.replace('五 stars!', `Five stars! ${contextSnippet}`).replace('Five stars!', `Five stars! ${contextSnippet}`).replace('¡Cinco estrellas!', `¡Cinco estrellas! ${contextSnippet}`);
    }
    return t;
  });
}

// Routes

// 1. Create or Update Business
app.post('/api/business', async (req: Request, res: Response) => {
  try {
    const { id, name, category, context, googleReviewUrl, keywords } = req.body;

    if (!name || !category || !context || !googleReviewUrl) {
      return res.status(400).json({ error: 'All fields (name, category, context, googleReviewUrl) are required.' });
    }

    const keywordsArray = Array.isArray(keywords)
      ? keywords.map((k: string) => k.trim()).filter((k: string) => k.length > 0)
      : typeof keywords === 'string'
        ? keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
        : [];

    let business;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      business = await Business.findByIdAndUpdate(
        id,
        { name, category, context, googleReviewUrl, keywords: keywordsArray },
        { new: true, runValidators: true }
      );
    }

    if (!business) {
      business = new Business({ name, category, context, googleReviewUrl, keywords: keywordsArray });
      await business.save();
    }

    return res.status(200).json(business);
  } catch (error) {
    console.error('Error in POST /api/business:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Fetch Business details
app.get('/api/business/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    return res.status(200).json(business);
  } catch (error) {
    console.error('Error in GET /api/business/:id:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Submit Private Customer Feedback (Low Ratings 1-3 Stars)
app.post('/api/business/:id/feedback', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, feedbackText, customerContact } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    if (!rating || !feedbackText) {
      return res.status(400).json({ error: 'Rating and feedbackText are required.' });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    if (!business.isApproved) {
      return res.status(403).json({ error: 'This business review portal is pending approval.' });
    }

    const feedback = new Feedback({
      businessId: business._id,
      rating,
      feedbackText,
      customerContact: customerContact || ''
    });

    await feedback.save();
    return res.status(201).json({ success: true, message: 'Feedback submitted privately. Thank you!' });
  } catch (error) {
    console.error('Error in POST /api/business/:id/feedback:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3.5 Log QR Code Scan Event
app.post('/api/business/:id/scan', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    const scan = new Scan({ businessId: id });
    await scan.save();

    return res.status(201).json({ success: true, message: 'Scan logged successfully.' });
  } catch (error) {
    console.error('Error in POST /api/business/:id/scan:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Retrieve List of Feedbacks & Daily Scans Count for Admin Dashboard
app.get('/api/business/:id/feedbacks', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const feedbacks = await Feedback.find({ businessId: id }).sort({ createdAt: -1 });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const scansToday = await Scan.countDocuments({
      businessId: id,
      createdAt: { $gte: startOfToday }
    });

    return res.status(200).json({ feedbacks, scansToday });
  } catch (error) {
    console.error('Error in GET /api/business/:id/feedbacks:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Generate 4-5 AI Reviews
app.post('/api/business/:id/generate-reviews', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, language } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    if (!business.isApproved) {
      return res.status(403).json({ error: 'This business review portal is pending approval.' });
    }

    const targetRating = rating || 5;
    const targetLanguage = language || 'English';

    // If Gemini key is missing, immediately run fallback
    if (!GEMINI_API_KEY) {
      console.log('Gemini API key missing, generating template reviews.');
      const reviews = getFallbackReviews(business.name, business.category, business.context, targetRating, targetLanguage);
      return res.status(200).json({ reviews });
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const keywordsStr = business.keywords && business.keywords.length > 0
        ? `\nSEO Keywords to naturally include in the reviews (use these words/phrases organically, not forced): ${business.keywords.join(', ')}`
        : '';

      const prompt = `You are an AI generating realistic, diverse, and natural customer reviews in ${targetLanguage} for a ${business.category} business named "${business.name}".
Business Context: ${business.context}${keywordsStr}
Target Rating: ${targetRating} out of 5 stars.
Instructions:
Generate exactly 4 to 5 unique review suggestions of varying lengths (from short one-sentence to medium 2-3 sentences), with different writing styles/tones (e.g., highly enthusiastic, professional, warm, simple, direct).
IMPORTANT: Naturally weave in the SEO keywords where they fit organically. Do NOT stuff keywords — they should read like a real customer wrote them. Use synonyms and variations where possible.
Do NOT include any numbers, bullets, list headers, quotes around the options, or additional conversational intro/outro text.
Return the suggestions formatted strictly as a single JSON array of strings, like this:
["Review suggestion 1", "Review suggestion 2", "Review suggestion 3", "Review suggestion 4"]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Clean the response if Gemini wraps it in markdown blocks
      if (text.startsWith('```json')) {
        text = text.substring(7);
      } else if (text.startsWith('```')) {
        text = text.substring(3);
      }
      if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.status(200).json({ reviews: parsed });
        }
      } catch (parseErr) {
        console.error('Failed to parse Gemini JSON output, falling back to line parsing:', text);
        // Fallback line parsing
        const lines = text
          .split('\n')
          .map(l => l.replace(/^[-*•\d.]+\s*/, '').replace(/^"|"$/g, '').trim())
          .filter(l => l.length > 0);
        if (lines.length > 0) {
          return res.status(200).json({ reviews: lines });
        }
      }

      // If parsing failed completely
      const reviews = getFallbackReviews(business.name, business.category, business.context, targetRating, targetLanguage);
      return res.status(200).json({ reviews });

    } catch (geminiError) {
      console.error('Gemini API execution error:', geminiError);
      // Fallback
      const reviews = getFallbackReviews(business.name, business.category, business.context, targetRating, targetLanguage);
      return res.status(200).json({ reviews });
    }
  } catch (error) {
    console.error('Error in POST /api/business/:id/generate-reviews:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
// ==========================================
// SUPER ADMIN ENDPOINTS
// ==========================================

// 1. Get all businesses
app.get('/api/admin/businesses', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    return res.status(200).json(businesses);
  } catch (error) {
    console.error('Error in GET /api/admin/businesses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Create a business (with optional isApproved status) + merchant account
app.post('/api/admin/business', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, context, googleReviewUrl, keywords, isApproved, email, password, location, mobileNumber } = req.body;

    if (!name || !category || !context || !googleReviewUrl) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const keywordsArray = Array.isArray(keywords)
      ? keywords.map((k: string) => k.trim()).filter((k: string) => k.length > 0)
      : typeof keywords === 'string'
        ? keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
        : [];

    const business = new Business({
      name,
      category,
      context,
      googleReviewUrl,
      keywords: keywordsArray,
      location: location || '',
      mobileNumber: mobileNumber || '',
      isApproved: isApproved === undefined ? false : isApproved
    });

    await business.save();

    // Create merchant user account if email/password provided
    let merchantUser = null;
    if (email && password) {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        merchantUser = await User.create({ email, password, role: 'merchant', businessId: business._id });
      }
    }

    return res.status(201).json({ business, merchantUser: merchantUser ? { _id: merchantUser._id, email: merchantUser.email } : null });
  } catch (error) {
    console.error('Error in POST /api/admin/business:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Edit business details
app.put('/api/admin/business/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, context, googleReviewUrl, keywords, isApproved, location, mobileNumber } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const keywordsArray = Array.isArray(keywords)
      ? keywords.map((k: string) => k.trim()).filter((k: string) => k.length > 0)
      : typeof keywords === 'string'
        ? keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
        : undefined;

    const updateData: any = { name, category, context, googleReviewUrl, isApproved };
    if (location !== undefined) updateData.location = location;
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
    if (keywordsArray !== undefined) updateData.keywords = keywordsArray;

    const business = await Business.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    return res.status(200).json(business);
  } catch (error) {
    console.error('Error in PUT /api/admin/business/:id:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Toggle/Set business approval status
app.put('/api/admin/business/:id/approve', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const business = await Business.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    return res.status(200).json(business);
  } catch (error) {
    console.error('Error in PUT /api/admin/business/:id/approve:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Delete a business (and cascade delete feedbacks)
app.delete('/api/admin/business/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }

    const business = await Business.findByIdAndDelete(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    // Cascade delete feedbacks associated with this business
    await Feedback.deleteMany({ businessId: id });

    return res.status(200).json({ success: true, message: 'Business and all associated feedbacks deleted successfully.' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/business/:id:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. Get all feedbacks system-wide
app.get('/api/admin/feedbacks', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('businessId', 'name')
      .sort({ createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error in GET /api/admin/feedbacks:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// CSV EXPORT ENDPOINTS
// ==========================================

app.get('/api/business/:id/feedbacks/csv', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }
    const feedbacks = await Feedback.find({ businessId: id }).sort({ createdAt: -1 });

    const csvHeader = 'Date,Rating,Feedback,Customer Contact\n';
    const csvRows = feedbacks.map(fb => {
      const date = new Date(fb.createdAt).toLocaleDateString('en-IN');
      const rating = fb.rating;
      const feedback = `"${(fb.feedbackText || '').replace(/"/g, '""')}"`;
      const contact = fb.customerContact || 'Anonymous';
      return `${date},${rating},${feedback},${contact}`;
    }).join('\n');

    const csv = csvHeader + csvRows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="feedbacks-${id}.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting feedbacks CSV:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/business/:id/contacts/csv', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }
    const feedbacks = await Feedback.find({ businessId: id, customerContact: { $ne: '' } }).sort({ createdAt: -1 });

    const csvHeader = 'Customer Contact,Rating,Date\n';
    const csvRows = feedbacks.map(fb => {
      const contact = fb.customerContact || '';
      const rating = fb.rating;
      const date = new Date(fb.createdAt).toLocaleDateString('en-IN');
      return `${contact},${rating},${date}`;
    }).join('\n');

    const csv = csvHeader + csvRows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="contacts-${id}.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting contacts CSV:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// QR CODE CUSTOMIZATION
// ==========================================

app.put('/api/business/:id/qr-settings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { qrColor, qrBgColor } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }
    const updateData: any = {};
    if (qrColor) updateData.qrColor = qrColor;
    if (qrBgColor) updateData.qrBgColor = qrBgColor;

    const business = await Business.findByIdAndUpdate(id, updateData, { new: true });
    if (!business) return res.status(404).json({ error: 'Business not found.' });
    return res.status(200).json(business);
  } catch (error) {
    console.error('Error updating QR settings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// SUBSCRIPTION & REVENUE (Admin)
// ==========================================

const PLAN_PRICES: Record<string, number> = { free: 0, pro: 999, enterprise: 4999 };

app.post('/api/admin/subscribe', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { businessId, plan, paymentMethod, transactionId } = req.body;
    if (!businessId || !plan) {
      return res.status(400).json({ error: 'businessId and plan are required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid Business ID.' });
    }

    const amount = PLAN_PRICES[plan] || 0;
    const now = new Date();
    const endDate = new Date(now);
    if (plan === 'pro') endDate.setMonth(endDate.getMonth() + 1);
    else if (plan === 'enterprise') endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription = await Subscription.create({
      businessId, plan, amount, currency: 'INR',
      paymentMethod: paymentMethod || '', transactionId: transactionId || '',
      status: 'active', startDate: now, endDate
    });

    await Business.findByIdAndUpdate(businessId, { plan, planExpiry: endDate });

    return res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/admin/subscriptions', authMiddleware, requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const subs = await Subscription.find().populate('businessId', 'name').sort({ createdAt: -1 });
    return res.status(200).json(subs);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/admin/revenue', authMiddleware, requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const subs = await Subscription.find({ status: 'active' });
    const totalRevenue = subs.reduce((sum, s) => sum + s.amount, 0);

    const monthlyRevenue: { month: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const monthStr = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      const monthTotal = subs
        .filter(s => s.startDate >= d && s.startDate <= monthEnd)
        .reduce((sum, s) => sum + s.amount, 0);
      monthlyRevenue.push({ month: monthStr, revenue: monthTotal });
    }

    const planCounts = { free: 0, pro: 0, enterprise: 0 };
    const businesses = await Business.find();
    businesses.forEach(b => { planCounts[b.plan as keyof typeof planCounts]++; });

    return res.status(200).json({
      totalRevenue,
      activeSubscriptions: subs.length,
      planCounts,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// MERCHANT: UPDATE PROFILE (QR + location)
// ==========================================

app.put('/api/business/:id/profile', authMiddleware, requireRole('merchant'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { qrColor, qrBgColor, location, mobileNumber } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Business ID format.' });
    }
    const updateData: any = {};
    if (qrColor) updateData.qrColor = qrColor;
    if (qrBgColor) updateData.qrBgColor = qrBgColor;
    if (location !== undefined) updateData.location = location;
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;

    const business = await Business.findByIdAndUpdate(id, updateData, { new: true });
    if (!business) return res.status(404).json({ error: 'Business not found.' });
    return res.status(200).json(business);
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
