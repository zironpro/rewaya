/**
 * Static fallback catalog when WIX_CLIENT_ID is unset or CMS bundles are not seeded.
 * Live catalog: Wix Stores V1 + CMS collection `BundleDetails`.
 */
export interface Book {
	id: string;
	title: string;
	isbn: string;
	publisher: string;
	author: string;
	language: string;
	genre: string;
	overview: string;
	image: string;
	retailPrice: number;
	costPrice: number;
}

export interface Bundle {
	id: string;
	title: string;
	count: number;
	price: number;
	originalPrice: number;
	tag: string;
	mainImage: string;
	books: Book[];
	/** Wix Stores product ID for checkout */
	wixProductId?: string;
}

export const bundles: Bundle[] = [
	{
		id: "bundle-1",
		title: "Quran & Salah Essentials",
		count: 5,
		price: 149,
		originalPrice: 165,
		tag: "Kids Favorite",
		mainImage: "/bundle_kids_essentials_1778661036870.png",
		books: [
			{
				id: "b1-1",
				title: "Animal Stories From The Quran - Horse",
				isbn: "9555832904756",
				publisher: "Al-Rewaya Kids",
				author: "Multiple Authors",
				language: "English",
				genre: "Quran Stories",
				overview:
					"A beautiful exploration of the story of the horse as mentioned in the Holy Quran, tailored for young minds.",
				image:
					"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
				retailPrice: 20.0,
				costPrice: 7.0,
			},
			{
				id: "b1-2",
				title: "101 Comics Sunnah of Prophet Muhammad",
				isbn: "97889670618753",
				publisher: "Al-Rewaya Kids",
				author: "Multiple Authors",
				language: "English",
				genre: "Sunnah/Comics",
				overview:
					"Engaging comic-style illustrations that teach 101 essential Sunnahs of the Prophet in a fun way.",
				image:
					"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
				retailPrice: 40.0,
				costPrice: 13.0,
			},
			{
				id: "b1-3",
				title: "Graded Phonics",
				isbn: "97889673420636",
				publisher: "Educational Press",
				author: "Educational Experts",
				language: "English",
				genre: "Learning",
				overview:
					"A systematic approach to learning phonics, essential for early literacy and Quranic reading foundations.",
				image:
					"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
				retailPrice: 45.0,
				costPrice: 16.0,
			},
			{
				id: "b1-4",
				title: "My First Book Of The Quran",
				isbn: "97889672972853",
				publisher: "Al-Rewaya Kids",
				author: "Multiple Authors",
				language: "English",
				genre: "Quran Foundation",
				overview:
					"The perfect introduction to the Quran for toddlers, with simple language and vibrant illustrations.",
				image:
					"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
				retailPrice: 30.0,
				costPrice: 9.0,
			},
			{
				id: "b1-5",
				title: "My First Book Of Salah",
				isbn: "97889672972846",
				publisher: "Al-Rewaya Kids",
				author: "Multiple Authors",
				language: "English",
				genre: "Ibadah",
				overview:
					"A step-by-step visual guide to performing Salah, designed for children to follow along easily.",
				image:
					"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
				retailPrice: 30.0,
				costPrice: 9.0,
			},
		],
	},
	{
		id: "bundle-2",
		title: "Kids Activity & Stories",
		count: 5,
		price: 115,
		originalPrice: 130,
		tag: "Best Seller",
		mainImage: "/bundle_kids_activities_1778661057672.png",
		books: [
			{
				id: "b2-1",
				title: "Basic Duaa for Children",
				isbn: "9788178985459",
				publisher: "Goodword Books",
				author: "Multiple Authors",
				language: "English",
				genre: "Supplications",
				overview: "A collection of daily Duas every Muslim child should know.",
				image:
					"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
				retailPrice: 10.0,
				costPrice: 4.0,
			},
			{
				id: "b2-2",
				title: "Arabic Alphabet Flash Card",
				isbn: "9788178985558",
				publisher: "Learning Roots",
				author: "Education Team",
				language: "Arabic/English",
				genre: "Learning Tools",
				overview: "High-quality flash cards for mastering the Arabic alphabet.",
				image:
					"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
				retailPrice: 15.0,
				costPrice: 5.0,
			},
			{
				id: "b2-3",
				title: "101 Sahabiyath Stories And Dua",
				isbn: "9789351790501",
				publisher: "Al-Rewaya Press",
				author: "History Scholars",
				language: "English",
				genre: "Biography",
				overview: "Inspiring stories of the female companions of the Prophet.",
				image:
					"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
				retailPrice: 55.0,
				costPrice: 18.0,
			},
			{
				id: "b2-4",
				title: "Quran Activity Book for Kids",
				isbn: "9788178989785",
				publisher: "Activity Hub",
				author: "Creative Team",
				language: "English",
				genre: "Activity",
				overview: "Games and puzzles themed around the Quran.",
				image:
					"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
				retailPrice: 25.0,
				costPrice: 6.0,
			},
			{
				id: "b2-5",
				title: "Seerah Activity Book",
				isbn: "9789351790488",
				publisher: "Activity Hub",
				author: "Creative Team",
				language: "English",
				genre: "Activity",
				overview:
					"Learn the life of the Prophet through interactive exercises.",
				image:
					"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
				retailPrice: 25.0,
				costPrice: 6.0,
			},
		],
	},
	{
		id: "bundle-3",
		title: "Learning & Fun Archive",
		count: 5,
		price: 85,
		originalPrice: 95,
		tag: "Top Value",
		mainImage: "/bundle_learning_fun_1778661083188.png",
		books: [
			{
				id: "b3-1",
				title: "Amazing Flash Card Set of 4 Boxes",
				isbn: "9789388810739",
				publisher: "Learning Roots",
				author: "Educational Team",
				language: "English",
				genre: "Flash Cards",
				overview:
					"A comprehensive set of flash cards covering various subjects.",
				image:
					"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
				retailPrice: 35.0,
				costPrice: 8.5,
			},
			{
				id: "b3-2",
				title: "Cursive Handwriting word family",
				isbn: "9789390183760",
				publisher: "Edu Press",
				author: "Penmanship Experts",
				language: "English",
				genre: "Skill Building",
				overview: "Improve handwriting through word family exercises.",
				image:
					"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
				retailPrice: 10.0,
				costPrice: 4.5,
			},
			{
				id: "b3-3",
				title: "Reusable Wipe and Clean Book - Patterns",
				isbn: "9789388810647",
				publisher: "Edu Press",
				author: "Penmanship Experts",
				language: "English",
				genre: "Activity",
				overview: "Endless practice with wipe-and-clean pattern drawing.",
				image:
					"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
				retailPrice: 15.0,
				costPrice: 4.5,
			},
			{
				id: "b3-4",
				title: "101 Brain Booster Activity Book",
				isbn: "9789388369794",
				publisher: "Brain Games",
				author: "Mental Skills Team",
				language: "English",
				genre: "Logic",
				overview: "Challenging puzzles to boost cognitive development.",
				image:
					"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
				retailPrice: 15.0,
				costPrice: 6.5,
			},
			{
				id: "b3-5",
				title: "Colour with Sticker-Unicorn Adventure",
				isbn: "9789354407215",
				publisher: "Creative Kids",
				author: "Artistic Team",
				language: "English",
				genre: "Art/Activity",
				overview: "Sticker fun and coloring for imaginative play.",
				image:
					"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
				retailPrice: 20.0,
				costPrice: 7.0,
			},
		],
	},
	{
		id: "bundle-4",
		title: "Knowledge & Adventure",
		count: 5,
		price: 149,
		originalPrice: 168,
		tag: "Premium Set",
		mainImage: "/bundle_knowledge_adventure_1778661106586.png",
		books: [
			{
				id: "b4-1",
				title: "Quran Quiz, Sahabah Quiz, Sahabiyat Quiz, hadith Quiz",
				isbn: "9789351791133",
				publisher: "Knowledge Press",
				author: "Educational Scholars",
				language: "English",
				genre: "Quiz",
				overview: "A massive quiz set covering all areas of Islamic knowledge.",
				image:
					"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
				retailPrice: 15.0,
				costPrice: 4.0,
			},
			{
				id: "b4-2",
				title: "My Big Book Of Enchanting Stories",
				isbn: "9788131931028",
				publisher: "Storyhouse",
				author: "Children's Authors",
				language: "English",
				genre: "Stories",
				overview: "A large collection of magical and moral tales.",
				image:
					"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
				retailPrice: 35.0,
				costPrice: 12.0,
			},
			{
				id: "b4-3",
				title: "365 Wonders Of The World",
				isbn: "9788131932520",
				publisher: "Discovery Press",
				author: "Global Experts",
				language: "English",
				genre: "Knowledge",
				overview: "A wonder for every day of the year.",
				image:
					"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
				retailPrice: 48.0,
				costPrice: 15.15,
			},
			{
				id: "b4-4",
				title: "Peel, Stick & Play - Season",
				isbn: "9788131970171",
				publisher: "Creative Play",
				author: "Design Team",
				language: "English",
				genre: "Activity",
				overview: "Interactive sticker play themed around the seasons.",
				image:
					"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
				retailPrice: 30.0,
				costPrice: 9.55,
			},
			{
				id: "b4-5",
				title: "101 Ultimate Brain Booster",
				isbn: "9788131958247",
				publisher: "Skill Master",
				author: "Mental Coaches",
				language: "English",
				genre: "Logic",
				overview: "The final word in cognitive exercise books.",
				image:
					"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
				retailPrice: 40.0,
				costPrice: 11.5,
			},
		],
	},
	{
		id: "bundle-5",
		title: "Prophet & Quran Stories",
		count: 5,
		price: 125,
		originalPrice: 145,
		tag: "Best Seller",
		mainImage: "/bundle_prophet_stories_1778661132026.png",
		books: [
			{
				id: "b5-1",
				title: "The Story of Animals in the Quran-Zebra",
				isbn: "9555832905623",
				publisher: "Nature Press",
				author: "Islamic Authors",
				language: "English",
				genre: "Quran Stories",
				overview:
					"Learn about the animal kingdom through the lens of revelation.",
				image:
					"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
				retailPrice: 35.0,
				costPrice: 10.5,
			},
			{
				id: "b5-2",
				title: "25 Blessed Prophets",
				isbn: "97889670618135",
				publisher: "Prophet Series",
				author: "History Team",
				language: "English",
				genre: "Prophets",
				overview:
					"Short, engaging biographies of the 25 prophets mentioned in the Quran.",
				image:
					"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
				retailPrice: 60.0,
				costPrice: 17.0,
			},
			{
				id: "b5-3",
				title: "Test Your IQ World Search-Electrifying",
				isbn: "97889673643141",
				publisher: "Puzzle Master",
				author: "Game Design Team",
				language: "English",
				genre: "Logic",
				overview: "Challenging word searches to test your focus.",
				image:
					"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
				retailPrice: 15.0,
				costPrice: 4.25,
			},
			{
				id: "b5-4",
				title: "Sudoku Difficult Puzzle",
				isbn: "9555832900864",
				publisher: "Puzzle Master",
				author: "Game Design Team",
				language: "English",
				genre: "Logic",
				overview: "Hardcore Sudoku for advanced puzzle lovers.",
				image:
					"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
				retailPrice: 15.0,
				costPrice: 4.15,
			},
			{
				id: "b5-5",
				title: "My Quran Stories - Amazing Stories From The Quran",
				isbn: "9555832906606",
				publisher: "Storyhouse",
				author: "Islamic Authors",
				language: "English",
				genre: "Quran Stories",
				overview: "A treasury of miracles and lessons from the Quran.",
				image:
					"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
				retailPrice: 20.0,
				costPrice: 5.41,
			},
		],
	},
];
