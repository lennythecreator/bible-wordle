const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://lenyeuwaeme:churchgame@cluster0.1vm0yi1.mongodb.net/?appName=Cluster0';

const BIBLE_BOOKS = [
  // Old Testament - Law
  { word: "GENESIS", description: "The book of beginnings - creation, fall, flood, and patriarchs", testament: "Old Testament", category: "Law" },
  { word: "EXODUS", description: "The deliverance of Israel from Egypt and the giving of the Law", testament: "Old Testament", category: "Law" },
  { word: "LEVITICUS", description: "The laws of sacrifice, purity, and holiness for priests and people", testament: "Old Testament", category: "Law" },
  { word: "NUMBERS", description: "The wilderness wanderings and numbering of Israel's tribes", testament: "Old Testament", category: "Law" },
  { word: "DEUTERONOMY", description: "Moses' farewell speeches and the renewal of the covenant", testament: "Old Testament", category: "Law" },

  // Old Testament - History
  { word: "JOSHUA", description: "The conquest and division of the Promised Land", testament: "Old Testament", category: "History" },
  { word: "JUDGES", description: "The cycle of apostasy, oppression, and deliverance in Israel", testament: "Old Testament", category: "History" },
  { word: "RUTH", description: "The loyalty of Ruth and God's provision through Boaz", testament: "Old Testament", category: "History" },
  { word: "1SAMUEL", description: "The rise of the monarchy from Samuel to David", testament: "Old Testament", category: "History" },
  { word: "2SAMUEL", description: "David's reign as king of Israel", testament: "Old Testament", category: "History" },
  { word: "1KINGS", description: "Solomon's reign and the divided kingdom", testament: "Old Testament", category: "History" },
  { word: "2KINGS", description: "The fall of Israel and Judah", testament: "Old Testament", category: "History" },
  { word: "1CHRONICLES", description: "A retelling of Israel's history focused on David", testament: "Old Testament", category: "History" },
  { word: "2CHRONICLES", description: "A retelling focused on Judah's kings", testament: "Old Testament", category: "History" },
  { word: "EZRA", description: "The return from exile and rebuilding of the temple", testament: "Old Testament", category: "History" },
  { word: "NEHEMIAH", description: "The rebuilding of Jerusalem's walls and spiritual renewal", testament: "Old Testament", category: "History" },
  { word: "ESTHER", description: "The providential deliverance of the Jews in Persia", testament: "Old Testament", category: "History" },

  // Old Testament - Wisdom
  { word: "JOB", description: "The suffering of a righteous man and God's sovereignty", testament: "Old Testament", category: "Wisdom" },
  { word: "PSALMS", description: "The hymnbook of Israel - prayers, praises, and laments", testament: "Old Testament", category: "Wisdom" },
  { word: "PROVERBS", description: "Wisdom sayings for practical godly living", testament: "Old Testament", category: "Wisdom" },
  { word: "ECCLESIASTES", description: "The search for meaning and purpose under the sun", testament: "Old Testament", category: "Wisdom" },
  { word: "SONG OF SOLOMON", description: "The poetry of love and devotion between bride and groom", testament: "Old Testament", category: "Wisdom" },

  // Old Testament - Prophets
  { word: "ISAIAH", description: "The messianic prophet - judgment and future glory", testament: "Old Testament", category: "Prophets" },
  { word: "JEREMIAH", description: "The weeping prophet and the fall of Jerusalem", testament: "Old Testament", category: "Prophets" },
  { word: "LAMENTATIONS", description: "Jeremiah's mourning over the destruction of Jerusalem", testament: "Old Testament", category: "Prophets" },
  { word: "EZEKIEL", description: "Visions of God's glory and the future temple", testament: "Old Testament", category: "Prophets" },
  { word: "DANIEL", description: "Faithfulness in exile and apocalyptic visions", testament: "Old Testament", category: "Prophets" },
  { word: "HOSEA", description: "God's faithful love for an unfaithful Israel", testament: "Old Testament", category: "Prophets" },
  { word: "JOEL", description: "The day of the Lord and the outpouring of the Spirit", testament: "Old Testament", category: "Prophets" },
  { word: "AMOS", description: "Justice and righteousness for the poor and oppressed", testament: "Old Testament", category: "Prophets" },
  { word: "JONAH", description: "The reluctant prophet and God's mercy for all nations", testament: "Old Testament", category: "Prophets" },
  { word: "MICAH", description: "What the Lord requires - justice, mercy, and humility", testament: "Old Testament", category: "Prophets" },
  { word: "NAHUM", description: "The fall of Nineveh and God's judgment on evil", testament: "Old Testament", category: "Prophets" },
  { word: "HABAKKUK", description: "A dialogue with God about suffering and faith", testament: "Old Testament", category: "Prophets" },
  { word: "ZEPHANIAH", description: "The day of the Lord and the remnant restored", testament: "Old Testament", category: "Prophets" },
  { word: "HAGGAI", description: "The call to rebuild God's temple", testament: "Old Testament", category: "Prophets" },
  { word: "ZECHARIAH", description: "Visions of restoration and the coming King", testament: "Old Testament", category: "Prophets" },
  { word: "MALACHI", description: "The final prophet and the messenger to come", testament: "Old Testament", category: "Prophets" },

  // New Testament - Gospels
  { word: "MATTHEW", description: "Jesus as the promised Messiah and King", testament: "New Testament", category: "Gospels" },
  { word: "MARK", description: "The suffering servant who came to serve and give his life", testament: "New Testament", category: "Gospels" },
  { word: "LUKE", description: "The perfect Son of Man who came to seek and save the lost", testament: "New Testament", category: "Gospels" },
  { word: "JOHN", description: "The Word made flesh - the divine Savior of the world", testament: "New Testament", category: "Gospels" },

  // New Testament - History
  { word: "ACTS", description: "The Holy Spirit's work in building the early church", testament: "New Testament", category: "History" },

  // New Testament - Epistles
  { word: "ROMANS", description: "The gospel of grace - justification by faith alone", testament: "New Testament", category: "Epistles" },
  { word: "1CORINTHIANS", description: "Practical instruction for a troubled church", testament: "New Testament", category: "Epistles" },
  { word: "2CORINTHIANS", description: "Paul's defense of his apostolic ministry", testament: "New Testament", category: "Epistles" },
  { word: "GALATIANS", description: "Freedom from legalism through Christ", testament: "New Testament", category: "Epistles" },
  { word: "EPHESIANS", description: "The riches of God's grace and spiritual armor", testament: "New Testament", category: "Epistles" },
  { word: "PHILIPPIANS", description: "Joy in all circumstances through Christ", testament: "New Testament", category: "Epistles" },
  { word: "COLOSSIANS", description: "The supremacy and sufficiency of Christ", testament: "New Testament", category: "Epistles" },
  { word: "1THESSALONIANS", description: "Encouragement about Christ's return", testament: "New Testament", category: "Epistles" },
  { word: "2THESSALONIANS", description: "Clarification on Christ's return and daily living", testament: "New Testament", category: "Epistles" },
  { word: "1TIMOTHY", description: "Instructions for church leaders and godly conduct", testament: "New Testament", category: "Epistles" },
  { word: "2TIMOTHY", description: "Paul's final letter to his beloved student", testament: "New Testament", category: "Epistles" },
  { word: "TITUS", description: "Qualifications for elders and sound doctrine", testament: "New Testament", category: "Epistles" },
  { word: "PHILEMON", description: "A plea for forgiveness and reconciliation in Christ", testament: "New Testament", category: "Epistles" },
  { word: "HEBREWS", description: "The superiority of Christ over the old covenant", testament: "New Testament", category: "Epistles" },
  { word: "JAMES", description: "Faith that works - genuine devotion in action", testament: "New Testament", category: "Epistles" },
  { word: "1PETER", description: "Hope and perseverance through suffering for Christ", testament: "New Testament", category: "Epistles" },
  { word: "2PETER", description: "Warning against false teachers and growing in faith", testament: "New Testament", category: "Epistles" },
  { word: "1JOHN", description: "Fellowship with God through love and truth", testament: "New Testament", category: "Epistles" },
  { word: "2JOHN", description: "Walking in truth and love", testament: "New Testament", category: "Epistles" },
  { word: "3JOHN", description: "Supporting faithful workers of the truth", testament: "New Testament", category: "Epistles" },
  { word: "JUDE", description: "Contending for the faith against false teachers", testament: "New Testament", category: "Epistles" },

  // New Testament - Apocalyptic
  { word: "REVELATION", description: "The ultimate victory of Christ and the new creation", testament: "New Testament", category: "Apocalyptic" },
];

const BibleWordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true, uppercase: true, trim: true, minlength: 4 },
  description: { type: String, required: true },
  testament: { type: String, enum: ["Old Testament", "New Testament"], required: true },
  author: { type: String, trim: true },
  category: { type: String, required: true, enum: ["Law", "History", "Wisdom", "Prophets", "Gospels", "Epistles", "Apocalyptic"] },
  verse: { type: String, trim: true },
  verseText: { type: String, trim: true },
}, { timestamps: true });

const BibleWord = mongoose.models.BibleWord || mongoose.model('BibleWord', BibleWordSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let created = 0;
  let skipped = 0;

  for (const book of BIBLE_BOOKS) {
    try {
      const existing = await BibleWord.findOne({ word: book.word });
      if (existing) {
        skipped++;
        continue;
      }
      await BibleWord.create(book);
      created++;
    } catch (err) {
      console.error(`Error creating ${book.word}:`, err.message);
    }
  }

  console.log(`Done! Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed();
