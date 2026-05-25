import { products as storesProducts } from "@wix/stores";

import type { BookProps } from "@/lib/store";

import {
	type CatalogProduct,
	PLACEHOLDER_VARIANT_ID,
	type ProductVariant,
} from "./catalog-types";
import {
	getInfoSectionValue,
	parseV1AdditionalInfoSections,
} from "./info-sections";
import type { WixCatalogProduct } from "./types";

const cartesian = <T>(data: T[][]): T[][] =>
	data.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [
		[],
	] as T[][]);

type V1Product = storesProducts.Product;

function mapV1OptionValue(
	option: NonNullable<V1Product["productOptions"]>[number],
	choice: NonNullable<
		NonNullable<V1Product["productOptions"]>[number]["choices"]
	>[number]
): string {
	if (option.optionType === "color") {
		return choice.description ?? choice.value ?? "";
	}
	return choice.value ?? choice.description ?? "";
}

function buildV1Variants(item: V1Product): ProductVariant[] {
	if (item.manageVariants && item.variants?.length) {
		return item.variants.map((variant) => ({
			id: variant._id ?? PLACEHOLDER_VARIANT_ID,
			title: item.name ?? undefined,
			availableForSale: variant.stock?.trackQuantity
				? (variant.stock?.quantity ?? 0) > 0
				: true,
			selectedOptions: Object.entries(variant.choices ?? {}).map(
				([name, value]) => ({ name, value: String(value) })
			),
			price: {
				amount: String(variant.variant?.priceData?.price ?? item.price?.price),
				currencyCode:
					variant.variant?.priceData?.currency ?? item.price?.currency,
			},
		}));
	}

	const optionSets =
		item.productOptions?.map(
			(option) =>
				option.choices?.map((choice) => ({
					name: option.name,
					value: mapV1OptionValue(option, choice),
				})) ?? []
		) ?? [];

	if (optionSets.length === 0) {
		return [
			{
				id: PLACEHOLDER_VARIANT_ID,
				title: item.name ?? undefined,
				availableForSale:
					item.stock?.inventoryStatus === "IN_STOCK" ||
					item.stock?.inventoryStatus === "PARTIALLY_OUT_OF_STOCK",
				selectedOptions: [],
				price: {
					amount: String(item.price?.price ?? 0),
					currencyCode: item.price?.currency,
				},
			},
		];
	}

	return cartesian(optionSets).map((selectedOptions) => ({
		id: PLACEHOLDER_VARIANT_ID,
		title: item.name ?? undefined,
		availableForSale: item.stock?.inventoryStatus === "IN_STOCK",
		selectedOptions: selectedOptions.filter((o) => Boolean(o.name && o.value)),
		price: {
			amount: String(item.price?.price ?? 0),
			currencyCode: item.price?.currency,
		},
	}));
}

export function reshapeV1Product(
	item: V1Product,
	categoryName?: string,
	categorySlug?: string,
	categoryId?: string
): CatalogProduct {
	const image =
		item.media?.mainMedia?.image?.url ??
		item.media?.mainMedia?.thumbnail?.url ??
		"";
	const variants = buildV1Variants(item);
	const infoSections = parseV1AdditionalInfoSections(item);

	return {
		id: item._id ?? "",
		slug: item.slug ?? "",
		title: item.name ?? "",
		description: item.description ?? undefined,
		availableForSale: variants.some((v) => v.availableForSale !== false),
		price: item.price?.price ?? 0,
		currency: item.price?.currency,
		image,
		images:
			item.media?.items
				?.filter((m) => m.image?.url)
				.map((m) => m.image!.url!) ?? [],
		category: categoryName ?? "Books",
		categoryId,
		categorySlug,
		author: getInfoSectionValue(infoSections, "Author"),
		publisher: getInfoSectionValue(infoSections, "Publisher"),
		language: getInfoSectionValue(infoSections, "Language"),
		infoSections,
		sku: item.sku ?? undefined,
		variants,
		defaultVariant: variants[0],
	};
}

function toNumericBookId(wixId: string, slug?: string): number {
	const key = wixId || slug || "0";
	return (
		Number.parseInt(key.replace(/\D/g, "").slice(0, 8), 10) ||
		Math.abs(
			key.split("").reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
		)
	);
}

export function catalogProductToBookProps(product: CatalogProduct): BookProps {
	const wixId = product.id || product.slug;
	const numericId = toNumericBookId(wixId, product.slug);

	return {
		id: numericId,
		wixProductId: product.id || product.slug,
		slug: product.slug,
		title: product.title,
		author: product.author ?? "Unknown",
		price: product.price,
		image: product.image,
		category: product.category,
		categoryId: product.categoryId,
		categorySlug: product.categorySlug,
		variants: product.variants,
		defaultVariant: product.defaultVariant,
		availableForSale: product.availableForSale,
	};
}

function resolveV3AvailableForSale(product: WixCatalogProduct): boolean {
	if (product.visible === false) return false;
	if (product.inventoryStatus === "OUT_OF_STOCK") return false;
	if (
		product.variantInStock === false &&
		product.variantPreorderEnabled !== true
	) {
		return false;
	}
	return true;
}

export function wixCatalogToBookProps(
	product: WixCatalogProduct,
	categoryNameMap?: Map<string, string>,
	variants?: ProductVariant[]
): BookProps {
	const resolvedVariants =
		variants ?? buildV3VariantsFromCatalog(product, product.variantId);
	const availableForSale =
		resolvedVariants.some((v) => v.availableForSale !== false) &&
		resolveV3AvailableForSale(product);

	const base = catalogProductToBookProps({
		id: product.id,
		slug: product.slug,
		title: product.name,
		description: product.description,
		availableForSale,
		price: product.price ?? 0,
		currency: product.currency,
		image: product.imageUrl ?? "",
		category:
			product.categoryNames?.[0] ??
			(product.categoryIds ?? product.collectionIds ?? [])
				.map((id) => categoryNameMap?.get(id))
				.filter(Boolean)[0] ??
			product.genre ??
			"Books",
		categoryId: product.primaryCategoryId ?? product.categoryIds?.[0],
		categorySlug: product.primaryCategorySlug,
		author: product.author,
		publisher: product.publisher,
		language: product.language,
		sku: product.sku,
		variants: resolvedVariants,
		defaultVariant: resolvedVariants[0],
	});
	return base;
}

function variantAvailableFromV3(product: WixCatalogProduct): boolean {
	if (product.inventoryStatus === "OUT_OF_STOCK") return false;
	if (
		product.variantInStock === false &&
		product.variantPreorderEnabled !== true
	) {
		return false;
	}
	return true;
}

export function buildV3VariantsFromCatalog(
	product: WixCatalogProduct,
	variantId?: string
): ProductVariant[] {
	const availableForSale = variantAvailableFromV3(product);
	const price = {
		amount: String(product.price ?? 0),
		currencyCode: product.currency,
	};

	if (!variantId) {
		return [
			{
				id: PLACEHOLDER_VARIANT_ID,
				selectedOptions: [],
				availableForSale,
				price,
			},
		];
	}
	return [
		{
			id: variantId,
			selectedOptions: [],
			availableForSale,
			price,
		},
	];
}
