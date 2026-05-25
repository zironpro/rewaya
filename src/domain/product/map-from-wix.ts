import type { BookProps } from "@/lib/store";
import type { CatalogProduct } from "@/lib/wix/catalog-types";
import {
	catalogProductToBookProps,
	reshapeV1Product,
	reshapeV3FromCatalog,
	wixCatalogToBookProps,
} from "@/lib/wix/reshape-product";
import type { WixCatalogProduct } from "@/lib/wix/types";

export {
	catalogProductToBookProps,
	reshapeV1Product,
	reshapeV3FromCatalog,
	wixCatalogToBookProps,
};

export function mapCatalogProductToBookProps(
	product: CatalogProduct
): BookProps {
	return catalogProductToBookProps(product);
}

export function mapWixCatalogToBookProps(
	product: WixCatalogProduct,
	categoryNameMap?: Map<string, string>
): BookProps {
	return wixCatalogToBookProps(product, categoryNameMap);
}

export function mapWixCatalogToCatalogProduct(
	product: WixCatalogProduct,
	categoryNameMap?: Map<string, string>
): CatalogProduct {
	return reshapeV3FromCatalog(product, categoryNameMap);
}
