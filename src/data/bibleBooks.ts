export interface BibleBook {
  word: string;
  description: string;
  testament: "Old Testament" | "New Testament";
  category: string;
  chapters: number;
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament - Law
  { word: "GENESIS", description: "The book of beginnings - creation, fall, flood, and patriarchs", testament: "Old Testament", category: "Law", chapters: 50 },
  { word: "EXODUS", description: "The deliverance of Israel from Egypt and the giving of the Law", testament: "Old Testament", category: "Law", chapters: 40 },
  { word: "LEVITICUS", description: "The laws of sacrifice, purity, and holiness for priests and people", testament: "Old Testament", category: "Law", chapters: 27 },
  { word: "NUMBERS", description: "The wilderness wanderings and numbering of Israel's tribes", testament: "Old Testament", category: "Law", chapters: 36 },
  { word: "DEUTERONOMY", description: "Moses' farewell speeches and the renewal of the covenant", testament: "Old Testament", category: "Law", chapters: 34 },

  // Old Testament - History
  { word: "JOSHUA", description: "The conquest and division of the Promised Land", testament: "Old Testament", category: "History", chapters: 24 },
  { word: "JUDGES", description: "The cycle of apostasy, oppression, and deliverance in Israel", testament: "Old Testament", category: "History", chapters: 21 },
  { word: "RUTH", description: "The loyalty of Ruth and God's provision through Boaz", testament: "Old Testament", category: "History", chapters: 4 },
  { word: "SAMUEL", description: "The rise of the monarchy from Samuel to David", testament: "Old Testament", category: "History", chapters: 55 },
  { word: "KINGS", description: "The united and divided kingdoms of Israel and Judah", testament: "Old Testament", category: "History", chapters: 47 },
  { word: "CHRONICLES", description: "A retelling of Israel's history focused on David and Judah", testament: "Old Testament", category: "History", chapters: 65 },
  { word: "EZRA", description: "The return from exile and rebuilding of the temple", testament: "Old Testament", category: "History", chapters: 10 },
  { word: "NEHEMIAH", description: "The rebuilding of Jerusalem's walls and spiritual renewal", testament: "Old Testament", category: "History", chapters: 13 },
  { word: "ESTHER", description: "The providential deliverance of the Jews in Persia", testament: "Old Testament", category: "History", chapters: 10 },

  // Old Testament - Wisdom
  { word: "JOB", description: "The suffering of a righteous man and God's sovereignty", testament: "Old Testament", category: "Wisdom", chapters: 42 },
  { word: "PSALMS", description: "The hymnbook of Israel - prayers, praises, and laments", testament: "Old Testament", category: "Wisdom", chapters: 150 },
  { word: "PROVERBS", description: "Wisdom sayings for practical godly living", testament: "Old Testament", category: "Wisdom", chapters: 31 },
  { word: "ECCLESIASTES", description: "The search for meaning and purpose under the sun", testament: "Old Testament", category: "Wisdom", chapters: 12 },
  { word: "SONG OF SOLOMON", description: "The poetry of love and devotion between bride and groom", testament: "Old Testament", category: "Wisdom", chapters: 8 },

  // Old Testament - Prophets
  { word: "ISAIAH", description: "The messianic prophet - judgment and future glory", testament: "Old Testament", category: "Prophets", chapters: 66 },
  { word: "JEREMIAH", description: "The weeping prophet and the fall of Jerusalem", testament: "Old Testament", category: "Prophets", chapters: 52 },
  { word: "LAMENTATIONS", description: "Jeremiah's mourning over the destruction of Jerusalem", testament: "Old Testament", category: "Prophets", chapters: 5 },
  { word: "EZEKIEL", description: "Visions of God's glory and the future temple", testament: "Old Testament", category: "Prophets", chapters: 48 },
  { word: "DANIEL", description: "Faithfulness in exile and apocalyptic visions", testament: "Old Testament", category: "Prophets", chapters: 12 },
  { word: "HOSEA", description: "God's faithful love for an unfaithful Israel", testament: "Old Testament", category: "Prophets", chapters: 14 },
  { word: "JOEL", description: "The day of the Lord and the outpouring of the Spirit", testament: "Old Testament", category: "Prophets", chapters: 3 },
  { word: "AMOS", description: "Justice and righteousness for the poor and oppressed", testament: "Old Testament", category: "Prophets", chapters: 9 },
  { word: "JONAH", description: "The reluctant prophet and God's mercy for all nations", testament: "Old Testament", category: "Prophets", chapters: 4 },
  { word: "MICAH", description: "What the Lord requires - justice, mercy, and humility", testament: "Old Testament", category: "Prophets", chapters: 7 },
  { word: "NAHUM", description: "The fall of Nineveh and God's judgment on evil", testament: "Old Testament", category: "Prophets", chapters: 3 },
  { word: "HABAKKUK", description: "A dialogue with God about suffering and faith", testament: "Old Testament", category: "Prophets", chapters: 3 },
  { word: "ZEPHANIAH", description: "The day of the Lord and the remnant restored", testament: "Old Testament", category: "Prophets", chapters: 3 },
  { word: "HAGGAI", description: "The call to rebuild God's temple", testament: "Old Testament", category: "Prophets", chapters: 2 },
  { word: "ZECHARIAH", description: "Visions of restoration and the coming King", testament: "Old Testament", category: "Prophets", chapters: 14 },
  { word: "MALACHI", description: "The final prophet and the messenger to come", testament: "Old Testament", category: "Prophets", chapters: 4 },

  // New Testament - Gospels
  { word: "MATTHEW", description: "Jesus as the promised Messiah and King", testament: "New Testament", category: "Gospels", chapters: 28 },
  { word: "MARK", description: "The suffering servant who came to serve and give his life", testament: "New Testament", category: "Gospels", chapters: 16 },
  { word: "LUKE", description: "The perfect Son of Man who came to seek and save the lost", testament: "New Testament", category: "Gospels", chapters: 24 },
  { word: "JOHN", description: "The Word made flesh - the divine Savior of the world", testament: "New Testament", category: "Gospels", chapters: 21 },

  // New Testament - History
  { word: "ACTS", description: "The Holy Spirit's work in building the early church", testament: "New Testament", category: "History", chapters: 28 },

  // New Testament - Epistles
  { word: "ROMANS", description: "The gospel of grace - justification by faith alone", testament: "New Testament", category: "Epistles", chapters: 16 },
  { word: "CORINTHIANS", description: "Practical instruction for a troubled church", testament: "New Testament", category: "Epistles", chapters: 16 },
  { word: "GALATIANS", description: "Freedom from legalism through Christ", testament: "New Testament", category: "Epistles", chapters: 6 },
  { word: "EPHESIANS", description: "The riches of God's grace and spiritual armor", testament: "New Testament", category: "Epistles", chapters: 6 },
  { word: "PHILIPPIANS", description: "Joy in all circumstances through Christ", testament: "New Testament", category: "Epistles", chapters: 4 },
  { word: "COLOSSIANS", description: "The supremacy and sufficiency of Christ", testament: "New Testament", category: "Epistles", chapters: 4 },
  { word: "THESSALONIANS", description: "Encouragement about Christ's return and daily living", testament: "New Testament", category: "Epistles", chapters: 6 },
  { word: "TIMOTHY", description: "Instructions for church leaders and godly conduct", testament: "New Testament", category: "Epistles", chapters: 6 },
  { word: "TITUS", description: "Qualifications for elders and sound doctrine", testament: "New Testament", category: "Epistles", chapters: 3 },
  { word: "PHILEMON", description: "A plea for forgiveness and reconciliation in Christ", testament: "New Testament", category: "Epistles", chapters: 1 },
  { word: "HEBREWS", description: "The superiority of Christ over the old covenant", testament: "New Testament", category: "Epistles", chapters: 13 },
  { word: "JAMES", description: "Faith that works - genuine devotion in action", testament: "New Testament", category: "Epistles", chapters: 5 },
  { word: "PETER", description: "Hope and perseverance through suffering for Christ", testament: "New Testament", category: "Epistles", chapters: 8 },
  { word: "JOHN", description: "Fellowship with God through love and truth", testament: "New Testament", category: "Epistles", chapters: 5 },
  { word: "JUDE", description: "Contending for the faith against false teachers", testament: "New Testament", category: "Epistles", chapters: 1 },

  // New Testament - Apocalyptic
  { word: "REVELATION", description: "The ultimate victory of Christ and the new creation", testament: "New Testament", category: "Apocalyptic", chapters: 22 },
];

export const CATEGORIES = [
  "Law",
  "History",
  "Wisdom",
  "Prophets",
  "Gospels",
  "Epistles",
  "Apocalyptic",
] as const;

export const TESTAMENTS = ["Old Testament", "New Testament"] as const;
