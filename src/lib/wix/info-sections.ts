export interface ProductInfoSection {
	title: string;
	description: string;
}

type RawInfoSection = {
	title?: string;
	description?: unknown;
	plainDescription?: unknown;
	value?: unknown;
};

/** Plain text from Wix rich-content nodes, HTML strings, or primitives. */
function extractDescription(raw: unknown): string {
	if (raw == null) return "";
	if (typeof raw === "number" || typeof raw === "boolean") {
		return String(raw);
	}
	if (typeof raw === "string") {
		const stripped = raw.replace(/<[^>]+>/g, "").trim();
		return stripped || raw.trim();
	}
	if (typeof raw === "object") {
		const obj = raw as Record<string, unknown>;
		if ("plainDescription" in obj) {
			return extractDescription(obj.plainDescription);
		}
		if (typeof obj.text === "string") {
			return obj.text.trim();
		}
		const textData = obj.textData as { text?: string } | undefined;
		if (textData?.text) {
			return textData.text.trim();
		}
		if (Array.isArray(obj.nodes)) {
			return extractTextFromRichNodes(obj.nodes);
		}
	}
	return "";
}

function extractTextFromRichNodes(nodes: unknown[]): string {
	const parts: string[] = [];
	for (const node of nodes) {
		if (!node || typeof node !== "object") continue;
		const n = node as Record<string, unknown>;
		if (n.type === "TEXT" && n.textData && typeof n.textData === "object") {
			const text = (n.textData as { text?: string }).text;
			if (text) parts.push(text);
		}
		if (Array.isArray(n.nodes)) {
			parts.push(extractTextFromRichNodes(n.nodes));
		}
	}
	return parts.join(" ").trim();
}

function normalizeRawSection(
	section: RawInfoSection
): ProductInfoSection | null {
	const title = (section.title ?? "").trim();
	const description = extractDescription(
		section.plainDescription ?? section.description ?? section.value
	);
	if (!title || !description) return null;
	return { title, description };
}

function parseRawInfoSections(
	sections: RawInfoSection[] | undefined
): ProductInfoSection[] {
	return (sections ?? [])
		.map(normalizeRawSection)
		.filter((s): s is ProductInfoSection => s !== null);
}

export function parseV1AdditionalInfoSections(product: {
	additionalInfoSections?: RawInfoSection[];
}): ProductInfoSection[] {
	return parseRawInfoSections(product.additionalInfoSections);
}

export function parseV3InfoSections(product: {
	infoSections?: RawInfoSection[];
}): ProductInfoSection[] {
	return parseRawInfoSections(product.infoSections);
}

export function getInfoSectionValue(
	sections: ProductInfoSection[],
	title: string
): string | undefined {
	const key = title.toLowerCase();
	return sections.find((s) => s.title.toLowerCase() === key)?.description;
}

export function infoSectionsToDetailRows(
	sections: ProductInfoSection[]
): Array<{ label: string; value: string }> {
	return sections.map((s) => ({ label: s.title, value: s.description }));
}

export function buildProductDetails(catalog: {
	author?: string;
	publisher?: string;
	language?: string;
	sku?: string;
	infoSections?: ProductInfoSection[];
}): Array<{ label: string; value: string }> {
	if (catalog.infoSections?.length) {
		const rows = infoSectionsToDetailRows(catalog.infoSections);
		if (catalog.sku && !rows.some((r) => /^(isbn|sku)$/i.test(r.label))) {
			rows.push({ label: "ISBN", value: catalog.sku });
		}
		return rows;
	}

	const rows: Array<{ label: string; value: string }> = [];
	if (catalog.author) rows.push({ label: "Author", value: catalog.author });
	if (catalog.language)
		rows.push({ label: "Language", value: catalog.language });
	if (catalog.publisher)
		rows.push({ label: "Publisher", value: catalog.publisher });
	if (catalog.sku) rows.push({ label: "ISBN", value: catalog.sku });
	return rows;
}
